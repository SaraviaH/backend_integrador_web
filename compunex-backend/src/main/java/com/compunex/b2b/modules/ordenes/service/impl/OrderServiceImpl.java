package com.compunex.b2b.modules.ordenes.service.impl;

import com.compunex.b2b.config.audit.Auditable;
import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.service.OrderService;
import com.compunex.b2b.modules.ordenes.service.support.OrderResponseMapper;
import com.compunex.b2b.modules.ordenes.service.support.SplitOrderCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orquestador transaccional de órdenes y consultas del comprador B2B.
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UsuarioRepository usuarioRepository;
    private final OrdenRepository ordenRepository;
    private final SplitOrderCalculator splitOrderCalculator;
    private final OrderResponseMapper orderResponseMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @Auditable(accion = "ORDER_CHECKOUT_SPLIT")
    public CheckoutResponseDTO procesarCheckout(String correoComprador, CheckoutRequestDTO request) {
        Usuario comprador = buscarComprador(correoComprador);
        Orden orden = splitOrderCalculator.construirOrdenSplit(comprador, request);
        Orden guardada = ordenRepository.save(orden);
        return orderResponseMapper.toCheckoutResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public OrdenPaginadaResponseDTO obtenerMisOrdenes(String correoComprador, Pageable pageable) {
        Usuario comprador = buscarComprador(correoComprador);
        var pagina = ordenRepository.findByCompradorId(comprador.getId(), pageable);
        var contenido = pagina.getContent().stream()
                .map(orderResponseMapper::toOrdenResumen)
                .toList();

        return OrdenPaginadaResponseDTO.builder()
                .contenido(contenido)
                .pagina(pagina.getNumber())
                .tamano(pagina.getSize())
                .totalElementos(pagina.getTotalElements())
                .totalPaginas(pagina.getTotalPages())
                .esUltima(pagina.isLast())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CheckoutResponseDTO obtenerDetalleOrden(String correoComprador, Long ordenId) {
        Usuario comprador = buscarComprador(correoComprador);
        Orden orden = ordenRepository.findById(ordenId)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada: " + ordenId));

        if (!orden.getComprador().getId().equals(comprador.getId())) {
            throw new AccessDeniedException("No tienes permiso para consultar esta orden");
        }

        return orderResponseMapper.toCheckoutResponse(orden);
    }

    private Usuario buscarComprador(String correoComprador) {
        return usuarioRepository.findByCorreo(correoComprador)
                .orElseThrow(() -> new ResourceNotFoundException("Comprador no encontrado"));
    }
}
