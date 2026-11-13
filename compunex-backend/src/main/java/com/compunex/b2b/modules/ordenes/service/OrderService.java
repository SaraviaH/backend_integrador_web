package com.compunex.b2b.modules.ordenes.service;

import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;

/**
 * Contrato de servicio para el motor transaccional de órdenes B2B.
 */
public interface OrderService {

    CheckoutResponseDTO procesarCheckout(String correoComprador, CheckoutRequestDTO request);
}
