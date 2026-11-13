package com.compunex.b2b.modules.perfiles.controller;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.perfiles.dto.request.ActivarProveedorRequestDTO;
import com.compunex.b2b.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProviderProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void activarProveedorYObtenerPerfil_clienteAutenticado_retorna200() throws Exception {
        Usuario cliente = new Usuario(
                "Cliente Prueba",
                "cliente.activar@test.com",
                passwordEncoder.encode("Secret123!"),
                RolUsuario.CLIENTE,
                EstadoUsuario.ACTIVO
        );
        usuarioRepository.save(cliente);

        String tokenCliente = jwtTokenProvider.generarTokenConRol(cliente.getCorreo(), RolUsuario.CLIENTE.name());

        ActivarProveedorRequestDTO request = ActivarProveedorRequestDTO.builder()
                .ruc("20551234567")
                .razonSocial("Distribuidora Norte SAC")
                .nombreComercial("Norte Tech")
                .telefonoContacto("987654321")
                .direccion("Av. Industrial 450")
                .ciudad("Trujillo")
                .descripcion("Mayorista de hardware")
                .build();

        mockMvc.perform(post("/api/v1/providers/me/activate")
                        .header("Authorization", "Bearer " + tokenCliente)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ruc").value("20551234567"))
                .andExpect(jsonPath("$.razonSocial").value("Distribuidora Norte SAC"));

        String tokenProveedor = jwtTokenProvider.generarTokenConRol(cliente.getCorreo(), RolUsuario.PROVEEDOR.name());

        mockMvc.perform(get("/api/v1/providers/me/profile")
                        .header("Authorization", "Bearer " + tokenProveedor))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value("cliente.activar@test.com"))
                .andExpect(jsonPath("$.ruc").value("20551234567"));
    }

    @Test
    void obtenerPerfil_sinRolProveedor_retorna403() throws Exception {
        Usuario cliente = new Usuario(
                "Solo Cliente",
                "solo.cliente@test.com",
                passwordEncoder.encode("Secret123!"),
                RolUsuario.CLIENTE,
                EstadoUsuario.ACTIVO
        );
        usuarioRepository.save(cliente);

        String tokenCliente = jwtTokenProvider.generarTokenConRol(cliente.getCorreo(), RolUsuario.CLIENTE.name());

        mockMvc.perform(get("/api/v1/providers/me/profile")
                        .header("Authorization", "Bearer " + tokenCliente))
                .andExpect(status().isForbidden());
    }
}
