package com.compunex.b2b.modules.ordenes.service.impl;

import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutItemDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.SubordenResumenDTO;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.exception.AutoCompraException;
import com.compunex.b2b.modules.ordenes.exception.StockInsuficienteException;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Motor transaccional Split Order ACID con recálculo fiscal en servidor (IGV 18%).
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private static final BigDecimal IGV_RATE = new BigDecimal("0.18");
    private static final AtomicLong CORRELATIVO_FACTURA = new AtomicLong(1);
    private static final AtomicLong CORRELATIVO_ORDEN = new AtomicLong(1);

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final OrdenRepository ordenRepository;
    private final com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository perfilProveedorRepository;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @com.compunex.b2b.config.audit.Auditable(accion = "ORDER_CHECKOUT_SPLIT")
    public CheckoutResponseDTO procesarCheckout(String correoComprador, CheckoutRequestDTO request) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        Map<Long, List<ItemResuelto>> itemsPorProveedor = new LinkedHashMap<>();

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

            producto.setStockDisponible(producto.getStockDisponible() - itemDto.getCantidad());
            productoRepository.save(producto);

            itemsPorProveedor
                    .computeIfAbsent(proveedorUsuario.getId(), k -> new ArrayList<>())
                    .add(new ItemResuelto(producto, proveedorUsuario, itemDto.getCantidad()));
        }

        Orden orden = new Orden();
        orden.setCodigoOrden(String.format("ORD-%08d", CORRELATIVO_ORDEN.getAndIncrement()));
        orden.setComprador(comprador);
        orden.setRucReceptor(request.getRucReceptor());
        orden.setRazonSocialReceptor(request.getRazonSocialReceptor());
        orden.setDireccionFiscal(request.getDireccionFiscal());

        BigDecimal totalSubtotal = BigDecimal.ZERO;
        BigDecimal totalIgv = BigDecimal.ZERO;
        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (List<ItemResuelto> grupo : itemsPorProveedor.values()) {
            Usuario proveedor = grupo.get(0).proveedor();
            SubordenFactura suborden = new SubordenFactura();
            suborden.setProveedor(proveedor);
            suborden.setNumeroComprobante(String.format("F001-%08d", CORRELATIVO_FACTURA.getAndIncrement()));

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

        List<SubordenResumenDTO> subordenResumenes = guardada.getSubordenes().stream()
                .map(s -> SubordenResumenDTO.builder()
                        .subordenId(s.getId())
                        .numeroComprobante(s.getNumeroComprobante())
                        .proveedorId(s.getProveedor().getId())
                        .subtotal(s.getSubtotal())
                        .igv(s.getIgv())
                        .total(s.getTotal())
                        .build())
                .toList();

        return CheckoutResponseDTO.builder()
                .ordenId(guardada.getId())
                .codigoOrden(guardada.getCodigoOrden())
                .montoTotal(guardada.getMontoTotal())
                .subordenes(subordenResumenes)
                .build();
    }

    private record ItemResuelto(Producto producto, Usuario proveedor, int cantidad) {
    }

    @Override
    @Transactional(readOnly = true)
    public com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO obtenerMisOrdenes(
            String correoComprador, org.springframework.data.domain.Pageable pageable) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        var pagina = ordenRepository.findByCompradorId(comprador.getId(), pageable);
        var contenido = pagina.getContent().stream()
                .map(o -> com.compunex.b2b.modules.ordenes.dto.response.OrdenResumenDTO.builder()
                        .ordenId(o.getId())
                        .codigoOrden(o.getCodigoOrden())
                        .fechaCreacion(o.getFechaCreacion())
                        .cantidadSubordenes(o.getSubordenes().size())
                        .montoTotal(o.getMontoTotal())
                        .estado(o.getEstado().name())
                        .build())
                .toList();

        return com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO.builder()
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
    public com.compunex.b2b.modules.ordenes.dto.response.OrdenDetalleResponseDTO obtenerDetalleOrden(
            String correoComprador, Long ordenId) {
        Usuario comprador = usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));

        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + ordenId));

        if (!orden.getComprador().getId().equals(comprador.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("No tienes permiso para consultar esta orden");
        }

        var subordenesDto = orden.getSubordenes().stream()
                .map(sub -> {
                    var perfilOpt = perfilProveedorRepository.findByUsuarioId(sub.getProveedor().getId());
                    String provNombre = perfilOpt.map(p -> p.getRazonSocial()).orElse(sub.getProveedor().getNombre());
                    String provRuc = perfilOpt.map(p -> p.getIdentificacionFiscal()).orElse("");

                    var itemsDto = sub.getItems().stream()
                            .map(item -> com.compunex.b2b.modules.ordenes.dto.response.OrdenItemDetalleDTO.builder()
                                    .productoId(item.getProducto().getId())
                                    .titulo(item.getProducto().getTitulo())
                                    .cantidad(item.getCantidad())
                                    .precioUnitario(item.getPrecioUnitario())
                                    .subtotal(item.getSubtotal())
                                    .build())
                            .toList();

                    return com.compunex.b2b.modules.ordenes.dto.response.SubordenDetalleDTO.builder()
                            .subordenId(sub.getId())
                            .proveedorNombre(provNombre)
                            .proveedorRuc(provRuc)
                            .numeroComprobante(sub.getNumeroComprobante())
                            .subtotal(sub.getSubtotal())
                            .igv(sub.getIgv())
                            .total(sub.getTotal())
                            .estado(sub.getEstado().name())
                            .items(itemsDto)
                            .build();
                })
                .toList();

        return com.compunex.b2b.modules.ordenes.dto.response.OrdenDetalleResponseDTO.builder()
                .ordenId(orden.getId())
                .codigoOrden(orden.getCodigoOrden())
                .fechaCreacion(orden.getFechaCreacion())
                .estado(orden.getEstado().name())
                .rucReceptor(orden.getRucReceptor())
                .razonSocialReceptor(orden.getRazonSocialReceptor())
                .direccionFiscal(orden.getDireccionFiscal())
                .montoSubtotal(orden.getMontoSubtotal())
                .montoIgv(orden.getMontoIgv())
                .montoTotal(orden.getMontoTotal())
                .subordenes(subordenesDto)
                .build();
    }
}
