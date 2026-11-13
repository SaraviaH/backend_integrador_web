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
public class OrdenDetalleResponseDTO {
    private Long ordenId;
    private String codigoOrden;
    private Instant fechaCreacion;
    private String estado;
    private String rucReceptor;
    private String razonSocialReceptor;
    private String direccionFiscal;
    private BigDecimal montoSubtotal;
    private BigDecimal montoIgv;
    private BigDecimal montoTotal;
    private List<SubordenDetalleDTO> subordenes;
}
