package com.compunex.b2b.modules.admin.controller;

import com.compunex.b2b.modules.admin.dto.AdminDashboardDTO;
import com.compunex.b2b.modules.admin.service.AdminPanelService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "12. Panel Administrativo y Suscripciones", description = "KPIs de negocio, proveedores, usuarios, órdenes y suscripciones de facturación")
@SecurityRequirement(name = "bearerAuth")
public class AdminPanelController {

    private final AdminPanelService adminPanelService;

    @GetMapping("/dashboard")
    @Operation(summary = "Indicadores globales de negocio, ventas, tiempos y MRR")
    public ResponseEntity<AdminDashboardDTO> dashboard() {
        return ResponseEntity.ok(adminPanelService.obtenerDashboard());
    }

    @GetMapping("/providers")
    @Operation(summary = "Listar empresas proveedoras")
    public ResponseEntity<List<AdminDashboardDTO.AdminProveedorItemDTO>> providers() {
        return ResponseEntity.ok(adminPanelService.listarProveedores());
    }

    @PatchMapping("/providers/{id}/verify")
    @Operation(summary = "Verificar o destacar un proveedor")
    public ResponseEntity<AdminDashboardDTO.AdminProveedorItemDTO> verifyProvider(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body) {
        boolean verificado = Boolean.TRUE.equals(body.get("verificado"));
        boolean destacado = Boolean.TRUE.equals(body.get("destacado"));
        return ResponseEntity.ok(adminPanelService.toggleVerificarProveedor(id, verificado, destacado));
    }

    @GetMapping("/users")
    @Operation(summary = "Listar usuarios del sistema")
    public ResponseEntity<List<AdminDashboardDTO.AdminUsuarioItemDTO>> users() {
        return ResponseEntity.ok(adminPanelService.listarUsuarios());
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activar o bloquear un usuario")
    public ResponseEntity<AdminDashboardDTO.AdminUsuarioItemDTO> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String estado = body.getOrDefault("estado", "ACTIVO");
        String motivo = body.getOrDefault("motivo", "");
        return ResponseEntity.ok(adminPanelService.cambiarEstadoUsuario(id, estado, motivo));
    }

    @GetMapping("/orders")
    @Operation(summary = "Listar todas las órdenes del marketplace")
    public ResponseEntity<List<AdminDashboardDTO.AdminOrdenItemDTO>> orders() {
        return ResponseEntity.ok(adminPanelService.listarOrdenesGlobales());
    }

    @GetMapping("/subscriptions")
    @Operation(summary = "Listar suscripciones de facturación electrónica de proveedores")
    public ResponseEntity<List<AdminDashboardDTO.SuscripcionItemDTO>> subscriptions() {
        return ResponseEntity.ok(adminPanelService.listarSuscripciones());
    }

    @PostMapping("/subscriptions")
    @Operation(summary = "Asignar o actualizar plan de suscripción de un proveedor")
    public ResponseEntity<AdminDashboardDTO.SuscripcionItemDTO> upsertSubscription(
            @RequestBody Map<String, Object> body) {
        Long proveedorId = Long.valueOf(String.valueOf(body.get("proveedorId")));
        String plan = String.valueOf(body.getOrDefault("plan", "PRO_FACTURACION"));
        String estado = String.valueOf(body.getOrDefault("estado", "ACTIVA"));
        return ResponseEntity.ok(adminPanelService.guardarSuscripcion(proveedorId, plan, estado));
    }
}
