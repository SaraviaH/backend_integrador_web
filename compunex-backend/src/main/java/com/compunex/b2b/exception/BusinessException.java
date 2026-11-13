package com.compunex.b2b.exception;

import org.springframework.http.HttpStatus;

/**
 * Excepción base para reglas de negocio del dominio Compunex B2B.
 */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
