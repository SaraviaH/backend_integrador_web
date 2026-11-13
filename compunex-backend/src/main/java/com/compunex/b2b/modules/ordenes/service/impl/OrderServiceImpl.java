package com.compunex.b2b.modules.ordenes.service.impl;

import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutItemDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.request.DatosFacturacionDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.EmisorFacturaDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenItemDetalleDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenResumenDTO;
import com.compunex.b2b.modules.ordenes.dto.response.ReceptorFacturaDTO;
import com.compunex.b2b.modules.ordenes.dto.response.SubordenResumenDTO;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.exception.AutoCompraException;
import com.compunex.b2b.modules.ordenes.exception.StockInsuficienteException;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.repository.SubordenFacturaRepository;
import com.compunex.b2b.modules.ordenes.service.OrderService;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Motor transaccional Split Order ACID con recálculo fiscal en servidor (IGV 18%).
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final SubordenFacturaRepository subordenFacturaRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @com.compunex.b2b.config.audit.Auditable(accion = "ORDER_CHECKOUT_SPLIT")
    public CheckoutResponseDTO procesarCheckout(String correoComprador, CheckoutRequestDTO request) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        Map<Long, List<ItemResuelto>> itemsPorProveedor = new LinkedHashMap<>();
        String monedaOrden = "PEN";

        for (CheckoutItemDTO itemDto : request.getItems()) {
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

            if (producto.getMoneda() != null && !producto.getMoneda().isBlank()) {
                monedaOrden = producto.getMoneda();
            }

            producto.setStockDisponible(producto.getStockDisponible() - itemDto.getCantidad());
            productoRepository.save(producto);

            itemsPorProveedor
                    .computeIfAbsent(proveedorUsuario.getId(), k -> new ArrayList<>())
                    .add(new ItemResuelto(producto, proveedorUsuario, itemDto.getCantidad()));
        }

        DatosFacturacionDTO datos = request.getDatosFacturacion();
        String tipoComprobante = (datos.getTipoComprobante() != null && !datos.getTipoComprobante().isBlank())
                ? datos.getTipoComprobante()
                : "FACTURA";
        String metodoPago = (datos.getMetodoPagoSimulado() != null && !datos.getMetodoPagoSimulado().isBlank())
                ? datos.getMetodoPagoSimulado()
                : "TRANSFERENCIA_B2B";

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
            Usuario proveedor = grupo.get(0).proveedor();
            String monedaSub = grupo.get(0).producto().getMoneda();
            SubordenFactura suborden = new SubordenFactura();
            suborden.setProveedor(proveedor);
            suborden.setNumeroComprobante(String.format("SIM-F001-%08d", siguienteFactura++));
            suborden.setTipoComprobante(tipoComprobante);
            suborden.setMoneda(monedaSub != null && !monedaSub.isBlank() ? monedaSub : monedaOrden);

            BigDecimal subSubtotal = BigDecimal.ZERO;
            for (ItemResuelto ir : grupo) {
                BigDecimal precioUnitario = ir.producto().getPrecioUnitarioRef();
                BigDecimal lineaSubtotal = precioUnitario.multiply(BigDecimal.valueOf(ir.cantidad()))
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
            orden.agregarSuborden(suborden);

            totalSubtotal = totalSubtotal.add(subSubtotal);
            totalIgv = totalIgv.add(subIgv);
            totalGeneral = totalGeneral.add(subTotal);
        }

        orden.setMontoSubtotal(totalSubtotal);
        orden.setMontoIgv(totalIgv);
        orden.setMontoTotal(totalGeneral);

        Orden guardada = ordenRepository.save(orden);
        return mapToCheckoutResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenPaginadaResponseDTO obtenerMisOrdenes(String correoComprador, Pageable pageable) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        var pagina = ordenRepository.findByCompradorId(comprador.getId(), pageable);
        var contenido = pagina.getContent().stream()
                .map(o -> OrdenResumenDTO.builder()
                        .ordenId(o.getId())
                        .codigoOrden(o.getCodigoOrden())
                        .fechaEmision(o.getFechaCreacion())
                        .cantidadProveedores(o.getSubordenes().size())
                        .totalGeneral(o.getMontoTotal())
                        .moneda(o.getMoneda())
                        .esSimulado(true)
                        .build())
                .toList();

        return OrdenPaginadaResponseDTO.builder()
                .contenido(contenido)
                .pagina(pagina.getNumber())
                .tamano(pagina.getSize())
                .totalElementos(pagina.getTotalElements())
                .totalPaginas(pagina.getTotalPages())
                .esUltima(pagina.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CheckoutResponseDTO obtenerDetalleOrden(String correoComprador, Long ordenId) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + ordenId));

        if (!orden.getComprador().getId().equals(comprador.getId())) {
            throw new AccessDeniedException("No tienes permiso para consultar esta orden");
        }

        return mapToCheckoutResponse(orden);
    }

    private CheckoutResponseDTO mapToCheckoutResponse(Orden orden) {
        ReceptorFacturaDTO receptor = ReceptorFacturaDTO.builder()
                .ruc(orden.getRucReceptor())
                .razonSocial(orden.getRazonSocialReceptor())
                .direccionFiscal(orden.getDireccionFiscal())
                .build();

        List<SubordenResumenDTO> facturasEmitidas = orden.getSubordenes().stream()
                .map(sub -> {
                    var perfilOpt = perfilProveedorRepository.findByUsuarioId(sub.getProveedor().getId());
                    Long proveedorId = perfilOpt.map(PerfilProveedor::getId).orElse(sub.getProveedor().getId());
                    String provRuc = perfilOpt.map(PerfilProveedor::getIdentificacionFiscal).orElse("");
                    String provRazonSocial = perfilOpt.map(PerfilProveedor::getRazonSocial)
                            .orElse(sub.getProveedor().getNombre());

                    EmisorFacturaDTO emisor = EmisorFacturaDTO.builder()
                            .proveedorId(proveedorId)
                            .ruc(provRuc)
                            .razonSocial(provRazonSocial)
                            .build();

                    var itemsDto = sub.getItems().stream()
                            .map(item -> OrdenItemDetalleDTO.builder()
                                    .productoId(item.getProducto().getId())
                                    .titulo(item.getProducto().getTitulo())
                                    .cantidad(item.getCantidad())
                                    .precioUnitario(item.getPrecioUnitario())
                                    .subtotalLinea(item.getSubtotal())
                                    .build())
                            .toList();

                    return SubordenResumenDTO.builder()
                            .subordenId(sub.getId())
                            .numeroComprobante(sub.getNumeroComprobante())
                            .tipoComprobante(sub.getTipoComprobante())
                            .emisor(emisor)
                            .receptor(receptor)
                            .subtotal(sub.getSubtotal())
                            .igv(sub.getIgv())
                            .total(sub.getTotal())
                            .estado(sub.getEstado().name())
                            .items(itemsDto)
                            .build();
                })
                .toList();

        return CheckoutResponseDTO.builder()
                .ordenId(orden.getId())
                .codigoOrden(orden.getCodigoOrden())
                .fechaEmision(orden.getFechaCreacion())
                .moneda(orden.getMoneda())
                .totalGeneral(orden.getMontoTotal())
                .esSimulado(true)
                .facturasEmitidas(facturasEmitidas)
                .build();
    }

    private record ItemResuelto(Producto producto, Usuario proveedor, int cantidad) {
    }
}
