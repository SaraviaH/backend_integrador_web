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
    private String tipoComprobante;
    private Instant fechaEmision;
    private ReceptorFacturaDTO receptor;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String moneda;
    private String estado;
    private List<OrdenItemDetalleDTO> items;
}
