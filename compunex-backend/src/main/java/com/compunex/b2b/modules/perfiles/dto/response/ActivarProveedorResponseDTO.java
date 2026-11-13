package com.compunex.b2b.modules.perfiles.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de activación de perfil de proveedor con emisión de nuevo token JWT con rol PROVEEDOR")
public record ActivarProveedorResponseDTO(

        @Schema(description = "Identificador único del perfil de proveedor activado", example = "9")
        Long proveedorId,

        @Schema(description = "Nuevo rol asignado al usuario", example = "PROVEEDOR")
        String rol,

        @Schema(description = "Nuevo token JWT emitido con permisos de PROVEEDOR")
        String token,

        @Schema(description = "Esquema de autenticación HTTP", example = "Bearer")
        String tipoToken,

        @Schema(description = "Tiempo de vigencia del token en segundos", example = "86400")
        Long expiraEnSegundos,

        @Schema(description = "Mensaje informativo del resultado de la operación")
        String mensaje
) {}
