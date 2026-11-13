package com.compunex.b2b.exception;

import org.springframework.http.HttpStatus;

/**
 * Excepción lanzada cuando se intenta registrar un recurso duplicado.
 */
public class DuplicateResourceException extends BusinessException {

    public DuplicateResourceException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
