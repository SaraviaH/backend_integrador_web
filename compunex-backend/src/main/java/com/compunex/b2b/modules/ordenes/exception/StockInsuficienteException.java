package com.compunex.b2b.modules.ordenes.exception;

import com.compunex.b2b.exception.BusinessException;
import org.springframework.http.HttpStatus;

public class StockInsuficienteException extends BusinessException {

    public StockInsuficienteException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
