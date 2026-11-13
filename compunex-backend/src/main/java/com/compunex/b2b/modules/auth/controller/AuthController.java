package com.compunex.b2b.modules.auth.controller;

import com.compunex.b2b.modules.auth.dto.request.CambiarPasswordDTO;
import com.compunex.b2b.modules.auth.dto.request.LoginRequestDTO;
import com.compunex.b2b.modules.auth.dto.request.RegistroEmpresaRequestDTO;
import com.compunex.b2b.modules.auth.dto.request.RegistroProveedorRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.AuthResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.CambioPasswordResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroEmpresaResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroProveedorResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.UsuarioSesionDTO;
import com.compunex.b2b.modules.auth.service.AuthService;
import com.compunex.b2b.modules.auth.service.RegistroCorporativoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "01. Autenticación", description = "Endpoints para login JWT y gestión de sesión")
public class AuthController {

    private final AuthService authService;
    private final RegistroCorporativoService registroCorporativoService;

    public AuthController(AuthService authService, RegistroCorporativoService registroCorporativoService) {
        this.authService = authService;
        this.registroCorporativoService = registroCorporativoService;
    }

    @PostMapping("/login")
    @Operation(summary = "[0.1] Iniciar sesión con credenciales", description = "Autentica al proveedor y devuelve el token Bearer JWT")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[0.2] Obtener datos de la sesión actual", description = "Retorna el perfil básico del usuario autenticado")
    public ResponseEntity<UsuarioSesionDTO> obtenerSesion() {
        return ResponseEntity.ok(authService.obtenerSesion());
    }

    @PatchMapping("/password")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[0.3] Cambiar contraseña", description = "Actualiza la contraseña verificando la clave actual")
    public ResponseEntity<CambioPasswordResponseDTO> cambiarPassword(@Valid @RequestBody CambiarPasswordDTO request) {
        return ResponseEntity.ok(authService.cambiarPassword(request));
    }

    @PostMapping("/register")
    @Operation(
        summary = "[0.4] Registro corporativo de nuevo proveedor mayorista",
        description = "Registra una nueva cuenta de usuario con rol PROVEEDOR, persiste su perfil fiscal de empresa en relación de clave foránea y emite un token JWT inicial."
    )
    public ResponseEntity<RegistroProveedorResponseDTO> registrarProveedor(
            @Valid @RequestBody RegistroProveedorRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(registroCorporativoService.registrarProveedor(request));
    }

    @PostMapping("/register-company")
    @Operation(
        summary = "[0.5] Registro directo de empresa compradora",
        description = "Registra una nueva empresa compradora con rol CLIENTE, valida RUC de 11 dígitos y emite un token JWT inicial."
    )
    public ResponseEntity<RegistroEmpresaResponseDTO> registrarEmpresa(
            @Valid @RequestBody RegistroEmpresaRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(registroCorporativoService.registrarEmpresa(request));
    }
}
