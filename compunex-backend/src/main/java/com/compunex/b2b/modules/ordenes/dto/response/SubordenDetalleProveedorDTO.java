package com.compunex.b2b.modules.ordenes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubordenDetalleProveedorDTO {
    private Long subordenId;
    private Long ordenId;
    private String codigoOrden;
    private String numeroComprobante;
    private Instant fechaCreacion;
    private String compradorNombre;
    private String rucReceptor;
    private String razonSocialReceptor;
    private String direccionFiscal;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private List<OrdenItemDetalleDTO> items;
}
