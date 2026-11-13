package com.compunex.b2b.modules.ordenes.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequestDTO {

    @NotNull(message = "Los datos de facturación son obligatorios")
    @Valid
    private DatosFacturacionDTO datosFacturacion;

    @NotEmpty(message = "Debe incluir al menos un ítem en el checkout")
    @Valid
    private List<CheckoutItemDTO> items;
}
