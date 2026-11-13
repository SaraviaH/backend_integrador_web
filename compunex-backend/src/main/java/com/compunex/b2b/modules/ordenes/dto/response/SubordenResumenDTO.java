package com.compunex.b2b.modules.ordenes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubordenResumenDTO {
    private Long subordenId;
    private String numeroComprobante;
    private String tipoComprobante;
    private EmisorFacturaDTO emisor;
    private ReceptorFacturaDTO receptor;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
    private String estado;
    private List<OrdenItemDetalleDTO> items;
}
