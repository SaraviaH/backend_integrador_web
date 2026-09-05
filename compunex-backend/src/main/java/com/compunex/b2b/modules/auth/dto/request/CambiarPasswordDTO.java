package com.compunex.b2b.modules.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record CambiarPasswordDTO(
        @NotBlank String contrasenaActual,
        @NotBlank String nuevaContrasena) {
}
