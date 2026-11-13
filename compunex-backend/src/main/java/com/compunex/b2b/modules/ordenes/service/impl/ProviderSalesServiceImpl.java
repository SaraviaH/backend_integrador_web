package com.compunex.b2b.modules.ordenes.service.impl;

import com.compunex.b2b.exception.BusinessException;
import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenItemDetalleDTO;
import com.compunex.b2b.modules.ordenes.dto.response.ReceptorFacturaDTO;
import com.compunex.b2b.modules.ordenes.dto.response.SubordenDetalleProveedorDTO;
import com.compunex.b2b.modules.ordenes.dto.response.VentaPaginadaResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.VentaResumenDTO;
import com.compunex.b2b.modules.ordenes.entity.EstadoSuborden;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.repository.SubordenFacturaRepository;
import com.compunex.b2b.modules.ordenes.service.ProviderSalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementación del servicio de ventas y despacho de proveedores con aislamiento multi-tenant.
 */
@Service
@RequiredArgsConstructor
public class ProviderSalesServiceImpl implements ProviderSalesService {

    private final UsuarioRepository usuarioRepository;
    private final SubordenFacturaRepository subordenFacturaRepository;

    @Override
    @Transactional(readOnly = true)
    public VentaPaginadaResponseDTO obtenerMisVentas(String correoProveedor, Pageable pageable) {
        Usuario proveedor = buscarUsuario(correoProveedor);
        var pagina = subordenFacturaRepository.findByProveedorId(proveedor.getId(), pageable);

        var contenido = pagina.getContent().stream()
                .map(sub -> {
                    var orden = sub.getOrden();
                    String razonSocialComprador = (orden.getRazonSocialReceptor() != null
                            && !orden.getRazonSocialReceptor().isBlank())
                            ? orden.getRazonSocialReceptor()
                            : orden.getComprador().getNombre();

                    return VentaResumenDTO.builder()
                            .subordenId(sub.getId())
                            .ordenId(orden.getId())
                            .codigoOrden(orden.getCodigoOrden())
                            .numeroComprobante(sub.getNumeroComprobante())
                            .fechaEmision(sub.getFechaCreacion())
                            .razonSocialComprador(razonSocialComprador)
                            .rucComprador(orden.getRucReceptor())
                            .total(sub.getTotal())
                            .moneda(sub.getMoneda())
                            .estado(sub.getEstado().name())
                            .build();
                })
                .toList();

        return VentaPaginadaResponseDTO.builder()
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
    public SubordenDetalleProveedorDTO obtenerDetalleVenta(String correoProveedor, Long subordenId) {
        Usuario proveedor = buscarUsuario(correoProveedor);
        SubordenFactura suborden = buscarSubordenPropia(proveedor.getId(), subordenId);
        return mapToDetalle(suborden);
    }

    @Override
    @Transactional
    @com.compunex.b2b.config.audit.Auditable(accion = "PROVIDER_DISPATCH_UPDATE")
    public SubordenDetalleProveedorDTO actualizarEstadoDespacho(String correoProveedor, Long subordenId, EstadoSuborden nuevoEstado) {
        Usuario proveedor = buscarUsuario(correoProveedor);
        SubordenFactura suborden = buscarSubordenPropia(proveedor.getId(), subordenId);

        validarTransicion(suborden.getEstado(), nuevoEstado);
        suborden.setEstado(nuevoEstado);
        suborden.setFechaActualizacion(Instant.now());
        suborden = subordenFacturaRepository.save(suborden);

        return mapToDetalle(suborden);
    }

    private Usuario buscarUsuario(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado"));
    }

    private SubordenFactura buscarSubordenPropia(Long proveedorId, Long subordenId) {
        SubordenFactura suborden = subordenFacturaRepository.findById(subordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Suborden no encontrada: " + subordenId));
        if (!suborden.getProveedor().getId().equals(proveedorId)) {
            throw new AccessDeniedException("No tienes permiso para acceder a esta suborden");
        }
        return suborden;
    }

    private void validarTransicion(EstadoSuborden actual, EstadoSuborden nuevo) {
        boolean valida = switch (actual) {
            case PENDIENTE_DESPACHO -> nuevo == EstadoSuborden.EN_PREPARACION || nuevo == EstadoSuborden.CANCELADO;
            case EN_PREPARACION -> nuevo == EstadoSuborden.DESPACHADO || nuevo == EstadoSuborden.CANCELADO;
            case DESPACHADO -> nuevo == EstadoSuborden.ENTREGADO;
            case ENTREGADO, CANCELADO -> false;
        };
        if (!valida) {
            throw new BusinessException("Transición de estado de despacho inválida: " + actual + " -> " + nuevo);
        }
    }

    private SubordenDetalleProveedorDTO mapToDetalle(SubordenFactura sub) {
        var orden = sub.getOrden();
        var itemsDto = sub.getItems().stream()
                .map(item -> OrdenItemDetalleDTO.builder()
                        .productoId(item.getProducto().getId())
                        .titulo(item.getProducto().getTitulo())
                        .cantidad(item.getCantidad())
                        .precioUnitario(item.getPrecioUnitario())
                        .subtotalLinea(item.getSubtotal())
                        .build())
                .toList();

        ReceptorFacturaDTO receptor = ReceptorFacturaDTO.builder()
                .ruc(orden.getRucReceptor())
                .razonSocial(orden.getRazonSocialReceptor())
                .direccionFiscal(orden.getDireccionFiscal())
                .build();

        return SubordenDetalleProveedorDTO.builder()
                .subordenId(sub.getId())
                .ordenId(orden.getId())
                .codigoOrden(orden.getCodigoOrden())
                .numeroComprobante(sub.getNumeroComprobante())
                .tipoComprobante(sub.getTipoComprobante())
                .fechaEmision(sub.getFechaCreacion())
                .receptor(receptor)
                .subtotal(sub.getSubtotal())
                .igv(sub.getIgv())
                .total(sub.getTotal())
                .moneda(sub.getMoneda())
                .estado(sub.getEstado().name())
                .items(itemsDto)
                .build();
    }
}
