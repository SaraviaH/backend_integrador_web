package com.compunex.b2b.modules.perfiles.controller;

import com.compunex.b2b.modules.perfiles.dto.request.ActivarProveedorRequestDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ActivarProveedorResponseDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ProveedorPerfilResponseDTO;
import com.compunex.b2b.modules.perfiles.service.ProviderProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para consulta y activación del perfil comercial de proveedor.
 */
@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
@Tag(name = "09. Perfil Comercial de Proveedor", description = "Consulta y activación de perfil comercial B2B")
@SecurityRequirement(name = "bearerAuth")
public class ProviderProfileController {

    private final ProviderProfileService providerProfileService;

    @GetMapping("/me/profile")
    @PreAuthorize("hasRole('PROVEEDOR')")
    @Operation(
            summary = "[16] Consultar perfil comercial del proveedor logueado",
            description = "Retorna la información comercial y fiscal del proveedor autenticado."
    )
    public ResponseEntity<ProveedorPerfilResponseDTO> obtenerMiPerfil(Authentication authentication) {
        return ResponseEntity.ok(providerProfileService.obtenerPerfilPorCorreo(authentication.getName()));
    }

    @PostMapping("/me/activate")
    @PreAuthorize("isAuthenticated()")
    @Operation(
            summary = "[17] Activar perfil comercial de proveedor",
            description = "Actualiza el rol del cliente autenticado a PROVEEDOR, registra su perfil comercial y emite un nuevo JWT."
    )
    public ResponseEntity<ActivarProveedorResponseDTO> activarPerfilProveedor(
            Authentication authentication,
            @Valid @RequestBody ActivarProveedorRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(providerProfileService.activarProveedor(authentication.getName(), request));
    }
}
