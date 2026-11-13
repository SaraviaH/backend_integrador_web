package com.compunex.b2b.modules.ordenes.service.support;

import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutItemDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.request.DatosFacturacionDTO;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.exception.AutoCompraException;
import com.compunex.b2b.modules.ordenes.exception.StockInsuficienteException;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.repository.SubordenFacturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Calculadora de dominio encargada de dividir un carrito en subórdenes por proveedor,
 * descontar stock validando reglas B2B y recalcular subtotales e IGV 18% en servidor.
 */
@Component
@RequiredArgsConstructor
public class SplitOrderCalculator {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final SubordenFacturaRepository subordenFacturaRepository;

    public Orden construirOrdenSplit(Usuario comprador, CheckoutRequestDTO request) {
        Map<Long, List<ItemResuelto>> itemsPorProveedor = agruparYDescontarStock(comprador, request.getItems());

        DatosFacturacionDTO datos = request.getDatosFacturacion();
        String tipoComprobante = valorPorDefecto(datos.getTipoComprobante(), "FACTURA");
        String metodoPago = valorPorDefecto(datos.getMetodoPagoSimulado(), "TRANSFERENCIA_B2B");
        String monedaOrden = resolverMonedaPrincipal(itemsPorProveedor);

        Long maxOrdenId = ordenRepository.findMaxId();
        long siguienteOrden = (maxOrdenId != null ? maxOrdenId : 0L) + 1L;
        Long maxFacturaId = subordenFacturaRepository.findMaxId();
        long siguienteFactura = (maxFacturaId != null ? maxFacturaId : 0L) + 1L;

        Orden orden = new Orden();
        orden.setCodigoOrden(String.format("PED-2026-%06d", siguienteOrden));
        orden.setComprador(comprador);
        orden.setRucReceptor(datos.getRucReceptor());
        orden.setRazonSocialReceptor(datos.getRazonSocialReceptor());
        orden.setDireccionFiscal(datos.getDireccionFiscal());
        orden.setTipoComprobante(tipoComprobante);
        orden.setMetodoPagoSimulado(metodoPago);
        orden.setMoneda(monedaOrden);

        BigDecimal totalSubtotal = BigDecimal.ZERO;
        BigDecimal totalIgv = BigDecimal.ZERO;
        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (List<ItemResuelto> grupo : itemsPorProveedor.values()) {
            String numeroComprobante = String.format("SIM-F001-%08d", siguienteFactura++);
            SubordenFactura suborden = construirSuborden(grupo, numeroComprobante, tipoComprobante, monedaOrden);
            orden.agregarSuborden(suborden);

            totalSubtotal = totalSubtotal.add(suborden.getSubtotal());
            totalIgv = totalIgv.add(suborden.getIgv());
            totalGeneral = totalGeneral.add(suborden.getTotal());
        }

        orden.setMontoSubtotal(totalSubtotal);
        orden.setMontoIgv(totalIgv);
        orden.setMontoTotal(totalGeneral);
        return orden;
    }

    private Map<Long, List<ItemResuelto>> agruparYDescontarStock(Usuario comprador, List<CheckoutItemDTO> items) {
        Map<Long, List<ItemResuelto>> itemsPorProveedor = new LinkedHashMap<>();

        for (CheckoutItemDTO itemDto : items) {
            Producto producto = productoRepository.findById(itemDto.getProductoId())
                    .filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.ACTIVO)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no disponible: " + itemDto.getProductoId()));

            Usuario proveedorUsuario = producto.getProveedor().getUsuario();
            if (proveedorUsuario.getId().equals(comprador.getId())) {
                throw new AutoCompraException("No puedes comprar tus propios productos: " + producto.getTitulo());
            }

            if (producto.getStockDisponible() < itemDto.getCantidad()) {
                throw new StockInsuficienteException("Stock insuficiente para el producto: " + producto.getTitulo());
            }

            producto.setStockDisponible(producto.getStockDisponible() - itemDto.getCantidad());
            productoRepository.save(producto);

            itemsPorProveedor
                    .computeIfAbsent(proveedorUsuario.getId(), k -> new ArrayList<>())
                    .add(new ItemResuelto(producto, proveedorUsuario, itemDto.getCantidad()));
        }

        return itemsPorProveedor;
    }

    private SubordenFactura construirSuborden(
            List<ItemResuelto> grupo, String numeroComprobante, String tipoComprobante, String monedaFallback) {
        Usuario proveedor = grupo.get(0).proveedor();
        String monedaSub = valorPorDefecto(grupo.get(0).producto().getMoneda(), monedaFallback);

        SubordenFactura suborden = new SubordenFactura();
        suborden.setProveedor(proveedor);
        suborden.setNumeroComprobante(numeroComprobante);
        suborden.setTipoComprobante(tipoComprobante);
        suborden.setMoneda(monedaSub);

        BigDecimal subSubtotal = BigDecimal.ZERO;
        for (ItemResuelto ir : grupo) {
            BigDecimal precioUnitario = ir.producto().getPrecioUnitarioRef();
            BigDecimal lineaSubtotal = precioUnitario
                    .multiply(BigDecimal.valueOf(ir.cantidad()))
                    .setScale(2, RoundingMode.HALF_UP);

            OrdenItem ordenItem = new OrdenItem();
            ordenItem.setProducto(ir.producto());
            ordenItem.setCantidad(ir.cantidad());
            ordenItem.setPrecioUnitario(precioUnitario);
            ordenItem.setSubtotal(lineaSubtotal);

            suborden.agregarItem(ordenItem);
            subSubtotal = subSubtotal.add(lineaSubtotal);
        }

        BigDecimal subIgv = subSubtotal.multiply(IGV_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal subTotal = subSubtotal.add(subIgv).setScale(2, RoundingMode.HALF_UP);

        suborden.setSubtotal(subSubtotal);
        suborden.setIgv(subIgv);
        suborden.setTotal(subTotal);
        return suborden;
    }

    private String resolverMonedaPrincipal(Map<Long, List<ItemResuelto>> grupos) {
        return grupos.values().stream()
                .flatMap(List::stream)
                .map(ir -> ir.producto().getMoneda())
                .filter(m -> m != null && !m.isBlank())
                .findFirst()
                .orElse("PEN");
    }

    private String valorPorDefecto(String valor, String fallback) {
        return (valor != null && !valor.isBlank()) ? valor : fallback;
    }

    private record ItemResuelto(Producto producto, Usuario proveedor, int cantidad) {
    }
}
