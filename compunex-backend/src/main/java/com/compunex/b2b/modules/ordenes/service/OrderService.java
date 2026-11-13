package com.compunex.b2b.modules.ordenes.service;

import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenDetalleResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO;
import org.springframework.data.domain.Pageable;

/**
 * Contrato de servicio para el motor transaccional de órdenes B2B.
 */
public interface OrderService {

    CheckoutResponseDTO procesarCheckout(String correoComprador, CheckoutRequestDTO request);

    OrdenPaginadaResponseDTO obtenerMisOrdenes(String correoComprador, Pageable pageable);

    OrdenDetalleResponseDTO obtenerDetalleOrden(String correoComprador, Long ordenId);
}
