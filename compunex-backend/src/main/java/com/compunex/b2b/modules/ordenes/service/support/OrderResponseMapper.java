package com.compunex.b2b.modules.ordenes.service.support;

import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.EmisorFacturaDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenItemDetalleDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenResumenDTO;
import com.compunex.b2b.modules.ordenes.dto.response.ReceptorFacturaDTO;
import com.compunex.b2b.modules.ordenes.dto.response.SubordenResumenDTO;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Mapeador de entidades de orden y subórdenes hacia los DTOs definidos en CONTRATOS_JSON.
 */
@Component
@RequiredArgsConstructor
public class OrderResponseMapper {

    private final PerfilProveedorRepository perfilProveedorRepository;

    public CheckoutResponseDTO toCheckoutResponse(Orden orden) {
        ReceptorFacturaDTO receptor = ReceptorFacturaDTO.builder()
                .ruc(orden.getRucReceptor())
                .razonSocial(orden.getRazonSocialReceptor())
                .direccionFiscal(orden.getDireccionFiscal())
                .build();

        List<SubordenResumenDTO> facturasEmitidas = orden.getSubordenes().stream()
                .map(sub -> mapSubordenResumen(sub, receptor))
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

    public OrdenResumenDTO toOrdenResumen(Orden orden) {
        return OrdenResumenDTO.builder()
                .ordenId(orden.getId())
                .codigoOrden(orden.getCodigoOrden())
                .fechaEmision(orden.getFechaCreacion())
                .cantidadProveedores(orden.getSubordenes().size())
                .totalGeneral(orden.getMontoTotal())
                .moneda(orden.getMoneda())
                .esSimulado(true)
                .build();
    }

    private SubordenResumenDTO mapSubordenResumen(SubordenFactura sub, ReceptorFacturaDTO receptor) {
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
    }
}
