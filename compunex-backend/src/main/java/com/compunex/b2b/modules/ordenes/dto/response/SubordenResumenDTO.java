package com.compunex.b2b.modules.ordenes.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubordenResumenDTO {
    private Long subordenId;
    private String numeroComprobante;
    private Long proveedorId;
    private BigDecimal subtotal;
    private BigDecimal igv;
    private BigDecimal total;
}
