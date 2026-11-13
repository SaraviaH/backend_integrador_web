package com.compunex.b2b.modules.auth.controller;

import com.compunex.b2b.modules.auth.dto.request.RegistroEmpresaRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CompanyRegistrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registrarEmpresa_datosValidos_retorna201YToken() throws Exception {
        RegistroEmpresaRequestDTO request = RegistroEmpresaRequestDTO.builder()
                .ruc("20601234567")
                .razonSocial("Tech Buyer SAC")
                .nombreComercial("Tech Buyer")
                .direccionFiscal("Av. Javier Prado 123")
                .ciudad("Lima")
                .telefono("999888777")
                .correo("empresa.compradora@test.com")
                .contrasena("Secret123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/register-company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.tipoToken").value("Bearer"))
                .andExpect(jsonPath("$.rol").value("CLIENTE"))
                .andExpect(jsonPath("$.ruc").value("20601234567"));
    }

    @Test
    void registrarEmpresa_rucInvalido_retorna400() throws Exception {
        RegistroEmpresaRequestDTO request = RegistroEmpresaRequestDTO.builder()
                .ruc("12345")
                .razonSocial("Tech Buyer SAC")
                .direccionFiscal("Av. Javier Prado 123")
                .telefono("999888777")
                .correo("invalido@test.com")
                .contrasena("Secret123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/register-company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registrarEmpresa_rucDuplicado_retorna409() throws Exception {
        RegistroEmpresaRequestDTO primero = RegistroEmpresaRequestDTO.builder()
                .ruc("20609998881")
                .razonSocial("Primera Empresa SAC")
                .direccionFiscal("Av. Arequipa 100")
                .telefono("999111222")
                .correo("primera@test.com")
                .contrasena("Secret123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/register-company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(primero)))
                .andExpect(status().isCreated());

        RegistroEmpresaRequestDTO duplicado = RegistroEmpresaRequestDTO.builder()
                .ruc("20609998881")
                .razonSocial("Segunda Empresa SAC")
                .direccionFiscal("Av. Arequipa 200")
                .telefono("999333444")
                .correo("segunda@test.com")
                .contrasena("Secret123!")
                .build();

        mockMvc.perform(post("/api/v1/auth/register-company")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(duplicado)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.mensaje").isNotEmpty());
    }
}
