package com.compunex.b2b.modules.ordenes.controller;

import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de órdenes y checkout transaccional Split Order B2B.
 */
@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "11. Órdenes y Checkout B2B", description = "Procesamiento transaccional Split Order y facturación simulada")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "[20] Procesar checkout Split Order ACID",
            description = "Descompone el pedido en subórdenes por proveedor, valida stock, prohíbe auto-compra y calcula IGV 18%."
    )
    public ResponseEntity<CheckoutResponseDTO> checkout(
            Authentication authentication,
            @Valid @RequestBody CheckoutRequestDTO request) {
        CheckoutResponseDTO response = orderService.procesarCheckout(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "[21] Listar historial de compras del comprador",
            description = "Retorna las órdenes realizadas por el usuario autenticado de forma paginada."
    )
    public ResponseEntity<com.compunex.b2b.modules.ordenes.dto.response.OrdenPaginadaResponseDTO> misOrdenes(
            Authentication authentication,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "0") int page,
            @org.springframework.web.bind.annotation.RequestParam(defaultValue = "10") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(
                page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "fechaCreacion"));
        return ResponseEntity.ok(orderService.obtenerMisOrdenes(authentication.getName(), pageable));
    }

    @org.springframework.web.bind.annotation.GetMapping("/me/{ordenId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "[22] Consultar detalle de una orden y sus comprobantes",
            description = "Retorna el desglose completo de subórdenes, ítems y comprobantes simulados de una orden propia."
    )
    public ResponseEntity<CheckoutResponseDTO> detalleOrden(
            Authentication authentication,
            @org.springframework.web.bind.annotation.PathVariable Long ordenId) {
        return ResponseEntity.ok(orderService.obtenerDetalleOrden(authentication.getName(), ordenId));
    }
}
