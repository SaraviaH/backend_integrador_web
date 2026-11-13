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
}
