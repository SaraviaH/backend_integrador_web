package com.compunex.b2b.modules.ordenes.controller;

import com.compunex.b2b.modules.ordenes.dto.request.CambiarEstadoDespachoDTO;
import com.compunex.b2b.modules.ordenes.dto.response.SubordenDetalleProveedorDTO;
import com.compunex.b2b.modules.ordenes.dto.response.VentaPaginadaResponseDTO;
import com.compunex.b2b.modules.ordenes.service.ProviderSalesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de ventas recibidas y gestión de despacho para proveedores.
 */
@RestController
@RequestMapping("/api/v1/providers/me/sales")
@PreAuthorize("hasRole('PROVEEDOR')")
@RequiredArgsConstructor
@Tag(name = "12. Ventas y Despacho de Proveedor", description = "Consulta de subórdenes recibidas y actualización de despacho")
@SecurityRequirement(name = "bearerAuth")
public class ProviderSalesController {

    private final ProviderSalesService providerSalesService;

    @GetMapping
    @Operation(summary = "[23] Listar ventas recibidas del proveedor")
    public ResponseEntity<VentaPaginadaResponseDTO> misVentas(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaCreacion"));
        return ResponseEntity.ok(providerSalesService.obtenerMisVentas(authentication.getName(), pageable));
    }

    @GetMapping("/{subordenId}")
    @Operation(summary = "[24] Consultar detalle de venta recibida")
    public ResponseEntity<SubordenDetalleProveedorDTO> detalleVenta(
            Authentication authentication,
            @PathVariable Long subordenId) {
        return ResponseEntity.ok(providerSalesService.obtenerDetalleVenta(authentication.getName(), subordenId));
    }

    @PatchMapping("/{subordenId}/status")
    @Operation(summary = "[24b] Actualizar estado de despacho de suborden")
    public ResponseEntity<SubordenDetalleProveedorDTO> actualizarEstado(
            Authentication authentication,
            @PathVariable Long subordenId,
            @Valid @RequestBody CambiarEstadoDespachoDTO request) {
        return ResponseEntity.ok(providerSalesService.actualizarEstadoDespacho(
                authentication.getName(), subordenId, request.getNuevoEstado()));
    }
}
