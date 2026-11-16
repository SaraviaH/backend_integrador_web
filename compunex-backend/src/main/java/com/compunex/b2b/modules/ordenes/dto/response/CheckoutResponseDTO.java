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
public class CheckoutResponseDTO {
    private Long ordenId;
    private String codigoOrden;
    private Instant fechaEmision;
    private String moneda;
    private BigDecimal totalGeneral;
    private Boolean esSimulado;
    private String metodoPagoSimulado;
    private String codigoAutorizacionPago;
    private String estadoPagoSimulado;
    private List<SubordenResumenDTO> facturasEmitidas;
}
