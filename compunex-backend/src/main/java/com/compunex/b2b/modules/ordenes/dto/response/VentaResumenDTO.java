package com.compunex.b2b.modules.ordenes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VentaResumenDTO {
    private Long subordenId;
    private Long ordenId;
    private String codigoOrden;
    private String numeroComprobante;
    private Instant fechaEmision;
    private String razonSocialComprador;
    private String rucComprador;
    private BigDecimal total;
    private String moneda;
    private String estado;
}
