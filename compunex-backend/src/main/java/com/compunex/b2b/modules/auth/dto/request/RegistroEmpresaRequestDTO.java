package com.compunex.b2b.modules.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de entrada para el registro directo de empresas compradoras (rol CLIENTE).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroEmpresaRequestDTO {

    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    private String nombre;

    @NotBlank(message = "El RUC es obligatorio")
    @Pattern(regexp = "^[0-9]{11}$", message = "El RUC debe tener exactamente 11 dígitos numéricos")
    private String ruc;

    @NotBlank(message = "La razón social es obligatoria")
    @Size(max = 200, message = "La razón social no puede superar los 200 caracteres")
    private String razonSocial;

    @Size(max = 200, message = "El nombre comercial no puede superar los 200 caracteres")
    private String nombreComercial;

    @Size(max = 300, message = "La dirección fiscal no puede superar los 300 caracteres")
    private String direccionFiscal;

    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres")
    private String ciudad;

    @Size(max = 20, message = "El teléfono no puede superar los 20 caracteres")
    private String telefono;

    @NotBlank(message = "El correo corporativo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String contrasena;
}
