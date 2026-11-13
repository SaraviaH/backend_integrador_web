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
public class OrdenResumenDTO {
    private Long ordenId;
    private String codigoOrden;
    private Instant fechaCreacion;
    private int cantidadSubordenes;
    private BigDecimal montoTotal;
    private String estado;
}
