package com.compunex.b2b.modules.auth.controller;

import com.compunex.b2b.config.SecurityConfig;
import com.compunex.b2b.modules.auth.dto.request.LoginRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.AuthResponseDTO;
import com.compunex.b2b.modules.auth.service.AuthService;
import com.compunex.b2b.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/*
 * =========================================================================
 * 🔵 TDD FASE 3: REFACTOR
 * =========================================================================
 * En la Fase 3, se verifica la capa web del controlador con @WebMvcTest y MockMvc:
 * - Validación del contrato JSON de entrada (LoginRequestDTO)
 * - Verificación de código de estado HTTP 200 OK
 * - Formato del contrato JSON de salida (AuthResponseDTO: token, tipoToken, expiraEnSegundos)
 * - Manejo de validación de campos obligatorios (HTTP 400 Bad Request)
 * =========================================================================
 */
@WebMvcTest(
    controllers = AuthController.class,
    excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class},
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {SecurityConfig.class, JwtAuthenticationFilter.class})
)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("🔵 FASE 3 REFACTOR: Debe retornar HTTP 200 OK y AuthResponseDTO cuando el login es exitoso")
    void debeRetornarHttp200YTokenCuandoLoginEsExitoso() throws Exception {
        // Arrange (Preparación del payload y simulación del servicio)
        LoginRequestDTO request = new LoginRequestDTO(
            "ventas.mayoristas@technova.com",
            "PasswordMayorista123!"
        );

        AuthResponseDTO responseSimulado = new AuthResponseDTO(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2ZW50YXMubWF5b3Jpc3Rhc0B0ZWNobm92YS5jb20iLCJyb2wiOiJQUk9WRUVET1IiLCJpYXQiOjE3MjUyODAwMDAsImV4cCI6MTcyNTM2NjQwMH0.simulatedTokenPayload",
            "Bearer",
            86400L
        );

        when(authService.login(any(LoginRequestDTO.class))).thenReturn(responseSimulado);

        // Act & Assert (Llamada HTTP POST y validación del contrato JSON)
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value(responseSimulado.token()))
                .andExpect(jsonPath("$.tipoToken").value("Bearer"))
                .andExpect(jsonPath("$.expiraEnSegundos").value(86400));
    }

    @Test
    @DisplayName("🔵 FASE 3 REFACTOR: Debe rechazar con HTTP 400 cuando faltan campos obligatorios")
    void debeRetornarHttp400CuandoPayloadEsInvalido() throws Exception {
        // Arrange: Correo con formato inválido y contraseña vacía
        LoginRequestDTO requestInvalido = new LoginRequestDTO("correo-invalido", "");

        // Act & Assert (Verificación de validación Jakarta Bean Validation)
        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest());
    }
}
