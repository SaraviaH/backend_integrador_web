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
    private Instant fechaEmision;
    private int cantidadProveedores;
    private BigDecimal totalGeneral;
    private String moneda;
    private Boolean esSimulado;
}
