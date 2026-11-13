package com.compunex.b2b.modules.ordenes.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Datos de facturación y pago simulado enviados durante el checkout B2B.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatosFacturacionDTO {

    @Builder.Default
    private String tipoComprobante = "FACTURA";

    @NotBlank(message = "El RUC del receptor es obligatorio")
    @Pattern(regexp = "^[0-9]{11}$", message = "El RUC debe tener 11 dígitos numéricos")
    private String rucReceptor;

    @NotBlank(message = "La razón social del receptor es obligatoria")
    private String razonSocialReceptor;

    @NotBlank(message = "La dirección fiscal es obligatoria")
    private String direccionFiscal;

    @Builder.Default
    private String metodoPagoSimulado = "TRANSFERENCIA_B2B";
}
