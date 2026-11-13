package com.compunex.b2b.modules.ordenes.exception;

import com.compunex.b2b.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class AutoCompraException extends BusinessException {

    public AutoCompraException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
