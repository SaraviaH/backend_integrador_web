package com.compunex.b2b.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * DTO estándar para respuestas de error HTTP.
 */
@Getter
@Builder
public class ErrorResponseDTO {
    private final int status;
    private final String error;
    private final String mensaje;
    private final LocalDateTime timestamp;
}
