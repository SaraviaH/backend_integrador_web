package com.compunex.b2b.modules.ordenes.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "El RUC del receptor es obligatorio")
    @Pattern(regexp = "^[0-9]{11}$", message = "El RUC debe tener 11 dígitos numéricos")
    private String rucReceptor;

    @NotBlank(message = "La razón social del receptor es obligatoria")
    private String razonSocialReceptor;

    @NotBlank(message = "La dirección fiscal es obligatoria")
    private String direccionFiscal;

    @NotEmpty(message = "Debe incluir al menos un ítem en el checkout")
    @Valid
    private List<CheckoutItemDTO> items;
}
