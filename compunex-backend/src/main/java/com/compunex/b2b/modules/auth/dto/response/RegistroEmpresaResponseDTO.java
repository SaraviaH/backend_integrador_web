package com.compunex.b2b.modules.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de registro de empresa compradora con emisión de credencial JWT")
public record RegistroEmpresaResponseDTO(

        @Schema(description = "Identificador único secuencial del usuario registrado", example = "12")
        Long usuarioId,

        @Schema(description = "Correo electrónico corporativo asignado a la cuenta", example = "compras@cliente.pe")
        String correo,

        @Schema(description = "Nombre del representante o contacto de la empresa", example = "María López")
        String nombre,

        @Schema(description = "Rol inicial del usuario en el sistema", example = "CLIENTE")
        String rol,

        @Schema(description = "Indica si la cuenta ya tiene perfil de proveedor activo", example = "false")
        Boolean tienePerfilProveedor,

        @Schema(description = "RUC de la empresa registrada", example = "20512345678")
        String ruc,

        @Schema(description = "Razón social de la empresa registrada", example = "Comercializadora Andina S.A.C.")
        String razonSocial,

        @Schema(description = "Token de autenticación Bearer JWT generado para uso inmediato")
        String token,

        @Schema(description = "Esquema de autenticación HTTP", example = "Bearer")
        String tipoToken,

        @Schema(description = "Tiempo de vigencia del token en segundos (24 horas)", example = "86400")
        Long expiraEnSegundos,

        @Schema(description = "Mensaje informativo del resultado de la operación")
        String mensaje
) {}
