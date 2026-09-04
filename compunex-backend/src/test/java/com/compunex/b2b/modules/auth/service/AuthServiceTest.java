package com.compunex.b2b.modules.auth.service;

import com.compunex.b2b.modules.auth.dto.request.LoginRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.AuthResponseDTO;
import com.compunex.b2b.modules.auth.service.impl.AuthServiceImpl;
import com.compunex.b2b.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private com.compunex.b2b.modules.auth.repository.UsuarioRepository usuarioRepository;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthServiceImpl authService;

    /*
     * =========================================================================
     * 🔴 REGISTRO HISTÓRICO - TDD FASE 1: RED
     * =========================================================================
     * En la Fase 1, este test se ejecutó contra la implementación stub de
     * AuthServiceImpl que lanzaba UnsupportedOperationException, generando la
     * falla inicial esperada (Barra Roja en JUnit).
     *
     * 🟢 TDD FASE 2: GREEN (Prueba Actual)
     * En la Fase 2, se configuran los mocks con Mockito para simular la
     * autenticación exitosa con AuthenticationManager y la emisión con JwtTokenProvider,
     * haciendo que la prueba pase exitosamente (Barra Verde en JUnit).
     * =========================================================================
     */
    @Test
    @DisplayName(" FASE 2 GREEN: Debe emitir token JWT cuando las credenciales son válidas")
    void debeEmitirTokenJwtCuandoCredencialesSonValidas() {
        // Arrange (Preparación de credenciales y simulación de dependencias)
        LoginRequestDTO request = new LoginRequestDTO(
                "ventas.mayoristas@technova.com",
                "PasswordMayorista123!"
        );

        String tokenSimulado = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2ZW50YXMubWF5b3Jpc3Rhc0B0ZWNobm92YS5jb20iLCJyb2wiOiJQUk9WRUVET1IiLCJpYXQiOjE3MjUyODAwMDAsImV4cCI6MTcyNTM2NjQwMH0.simulatedTokenPayload";

        Authentication authMock = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authMock);
        when(jwtTokenProvider.generarToken(authMock))
                .thenReturn(tokenSimulado);

        // Act (Ejecución del método)
        AuthResponseDTO respuesta = authService.login(request);

        // Assert (Validaciones que deben cumplirse en verde según contrato)
        assertNotNull(respuesta, "La respuesta de autenticación no debe ser nula");
        assertEquals(tokenSimulado, respuesta.token(), "El token emitido debe coincidir con el generado");
        assertEquals("Bearer", respuesta.tipoToken(), "El tipo de token debe ser Bearer");
        assertEquals(86400L, respuesta.expiraEnSegundos(), "La expiración debe ser de 86400 segundos");

        // Verificaciones de comportamiento
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenProvider, times(1)).generarToken(authMock);
    }

    @Test
    @DisplayName("[0.2] debeRetornarDatosSesionCuandoTokenEsValido")
    void debeRetornarDatosSesionCuandoTokenEsValido() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new com.compunex.b2b.modules.auth.entity.Usuario(
                "TechNova Mayorista S.A.C.", correo, "hash",
                com.compunex.b2b.modules.auth.entity.RolUsuario.PROVEEDOR,
                com.compunex.b2b.modules.auth.entity.EstadoUsuario.ACTIVO);
        when(usuarioRepository.findByCorreo(correo)).thenReturn(java.util.Optional.of(usuario));
        var auth = new UsernamePasswordAuthenticationToken(correo, null, java.util.List.of());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
        try {
            var sesion = authService.obtenerSesion();
            assertNotNull(sesion);
            assertEquals(correo, sesion.correo());
            assertEquals("TechNova Mayorista S.A.C.", sesion.nombre());
            assertEquals("PROVEEDOR", sesion.rol());
            assertTrue(sesion.valido());
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("[0.3] debeActualizarPasswordCuandoClaveActualEsCorrecta")
    void debeActualizarPasswordCuandoClaveActualEsCorrecta() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new com.compunex.b2b.modules.auth.entity.Usuario(
                "TechNova Mayorista S.A.C.", correo, "hashActual",
                com.compunex.b2b.modules.auth.entity.RolUsuario.PROVEEDOR,
                com.compunex.b2b.modules.auth.entity.EstadoUsuario.ACTIVO);
        when(usuarioRepository.findByCorreo(correo)).thenReturn(java.util.Optional.of(usuario));
        when(passwordEncoder.matches("PasswordMayorista123!", "hashActual")).thenReturn(true);
        when(passwordEncoder.encode("NuevaClaveCorporativa2026*")).thenReturn("hashNuevo");
        var auth = new UsernamePasswordAuthenticationToken(correo, null, java.util.List.of());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
        try {
            var resp = authService.cambiarPassword(
                    new com.compunex.b2b.modules.auth.dto.request.CambiarPasswordDTO(
                            "PasswordMayorista123!", "NuevaClaveCorporativa2026*"));
            assertNotNull(resp);
            assertEquals("Contraseña actualizada exitosamente", resp.mensaje());
            assertNotNull(resp.fechaActualizacion());
            assertEquals("hashNuevo", usuario.getHashContrasena());
            verify(usuarioRepository, times(1)).save(usuario);
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }

    @Test
    @DisplayName("[0.3] debeRechazarCuandoClaveActualEsIncorrecta")
    void debeRechazarCuandoClaveActualEsIncorrecta() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new com.compunex.b2b.modules.auth.entity.Usuario(
                "TechNova Mayorista S.A.C.", correo, "hashActual",
                com.compunex.b2b.modules.auth.entity.RolUsuario.PROVEEDOR,
                com.compunex.b2b.modules.auth.entity.EstadoUsuario.ACTIVO);
        when(usuarioRepository.findByCorreo(correo)).thenReturn(java.util.Optional.of(usuario));
        when(passwordEncoder.matches("clave-mala", "hashActual")).thenReturn(false);
        var auth = new UsernamePasswordAuthenticationToken(correo, null, java.util.List.of());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(auth);
        try {
            assertThrows(com.compunex.b2b.modules.auth.exception.ContrasenaActualIncorrectaException.class,
                    () -> authService.cambiarPassword(
                            new com.compunex.b2b.modules.auth.dto.request.CambiarPasswordDTO(
                                    "clave-mala", "NuevaClaveCorporativa2026*")));
            verify(usuarioRepository, never()).save(any());
        } finally {
            org.springframework.security.core.context.SecurityContextHolder.clearContext();
        }
    }
}
