package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AdminProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void listarYModerarProducto_comoAdmin_registraEliminadoPorEnBd() throws Exception {
        Usuario admin = usuarioRepository.save(new Usuario("Admin Audit", "admin.audit@test.com", "hash", RolUsuario.ADMIN, EstadoUsuario.ACTIVO));
        Producto producto = productoRepository.findAll().stream().findFirst().orElseThrow();

        String tokenAdmin = jwtTokenProvider.generarTokenConRol(admin.getCorreo(), RolUsuario.ADMIN.name());

        mockMvc.perform(get("/api/v1/admin/products")
                        .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido").isArray());

        mockMvc.perform(patch("/api/v1/admin/products/{id}/status", producto.getId())
                        .header("Authorization", "Bearer " + tokenAdmin)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CambiarEstadoProductoDTO(EstadoProducto.OCULTO_POR_ADMIN))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nuevoEstado").value("OCULTO_POR_ADMIN"));

        Producto actualizado = productoRepository.findById(producto.getId()).orElseThrow();
        assertThat(actualizado.getEstado()).isEqualTo(EstadoProducto.OCULTO_POR_ADMIN);
        assertThat(actualizado.getEliminadoPor()).isEqualTo(admin.getId());
    }

    @Test
    void rutasAdmin_sinRolAdmin_retornan403() throws Exception {
        Usuario cliente = usuarioRepository.save(new Usuario("Cliente", "cli.admin@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario proveedor = usuarioRepository.save(new Usuario("Proveedor", "prov.admin@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));

        String tokenCliente = jwtTokenProvider.generarTokenConRol(cliente.getCorreo(), RolUsuario.CLIENTE.name());
        String tokenProveedor = jwtTokenProvider.generarTokenConRol(proveedor.getCorreo(), RolUsuario.PROVEEDOR.name());

        mockMvc.perform(get("/api/v1/admin/products")
                        .header("Authorization", "Bearer " + tokenCliente))
                .andExpect(status().isForbidden());

        mockMvc.perform(patch("/api/v1/admin/products/1/status")
                        .header("Authorization", "Bearer " + tokenProveedor)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"estado\":\"OCULTO_POR_ADMIN\"}"))
                .andExpect(status().isForbidden());
    }
}
