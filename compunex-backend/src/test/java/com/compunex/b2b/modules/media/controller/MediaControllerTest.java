package com.compunex.b2b.modules.media.controller;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class MediaControllerTest {

    @TempDir
    static Path tempUploadDir;

    @DynamicPropertySource
    static void registerUploadDir(DynamicPropertyRegistry registry) {
        registry.add("app.media.upload-dir", () -> tempUploadDir.toAbsolutePath().toString());
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void uploadYDescargaPublica_proveedorAutenticado_retorna201Y200() throws Exception {
        Usuario proveedor = usuarioRepository.save(
                new Usuario("Proveedor Media", "media.prov@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO)
        );
        String token = jwtTokenProvider.generarTokenConRol(proveedor.getCorreo(), RolUsuario.PROVEEDOR.name());

        byte[] contenidoImagen = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
        MockMultipartFile file = new MockMultipartFile(
                "file", "producto.png", MediaType.IMAGE_PNG_VALUE, contenidoImagen
        );

        MvcResult result = mockMvc.perform(multipart("/api/v1/media/upload")
                        .file(file)
                        .param("folder", "products")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.url").isNotEmpty())
                .andExpect(jsonPath("$.nombreArchivo").isNotEmpty())
                .andExpect(jsonPath("$.contentType").value("image/png"))
                .andExpect(jsonPath("$.tamanoBytes").value(contenidoImagen.length))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        String nombreArchivo = json.get("nombreArchivo").asText();
        assertThat(nombreArchivo).endsWith(".png");

        mockMvc.perform(get("/api/v1/media/files/products/{filename}", nombreArchivo))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG))
                .andExpect(content().bytes(contenidoImagen));
    }

    @Test
    void upload_sinRolProveedorOAdmin_retorna403() throws Exception {
        Usuario cliente = usuarioRepository.save(
                new Usuario("Cliente Media", "media.cli@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO)
        );
        String token = jwtTokenProvider.generarTokenConRol(cliente.getCorreo(), RolUsuario.CLIENTE.name());

        MockMultipartFile file = new MockMultipartFile(
                "file", "logo.png", MediaType.IMAGE_PNG_VALUE, new byte[]{1, 2, 3}
        );

        mockMvc.perform(multipart("/api/v1/media/upload")
                        .file(file)
                        .param("folder", "profiles")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void upload_formatoInvalidoOCarpetaInvalida_retorna400() throws Exception {
        Usuario admin = usuarioRepository.save(
                new Usuario("Admin Media", "media.adm@test.com", "hash", RolUsuario.ADMIN, EstadoUsuario.ACTIVO)
        );
        String token = jwtTokenProvider.generarTokenConRol(admin.getCorreo(), RolUsuario.ADMIN.name());

        MockMultipartFile txtFile = new MockMultipartFile(
                "file", "malware.txt", MediaType.TEXT_PLAIN_VALUE, "no-es-imagen".getBytes()
        );

        mockMvc.perform(multipart("/api/v1/media/upload")
                        .file(txtFile)
                        .param("folder", "products")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").isNotEmpty());

        MockMultipartFile pngFile = new MockMultipartFile(
                "file", "ok.png", MediaType.IMAGE_PNG_VALUE, new byte[]{1, 2, 3}
        );

        mockMvc.perform(multipart("/api/v1/media/upload")
                        .file(pngFile)
                        .param("folder", "../etc")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
    }

    @Test
    void serveImage_noExiste_retorna404() throws Exception {
        mockMvc.perform(get("/api/v1/media/files/products/inexistente.png"))
                .andExpect(status().isNotFound());
    }
}
