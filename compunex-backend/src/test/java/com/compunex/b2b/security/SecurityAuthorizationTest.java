package com.compunex.b2b.security;

import com.compunex.b2b.config.DataInitializer;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("[Seguridad 1] Consultar categorías sin autenticación debe retornar HTTP 200 OK")
    void debePermitirConsultarCategoriasSinToken() throws Exception {
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[Seguridad 2] Acceder a productos propios sin token debe retornar HTTP 401 Unauthorized")
    void debeRechazarAccesoAProductosSinTokenCon401() throws Exception {
        mockMvc.perform(get("/api/v1/providers/me/products"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("[Seguridad 3] Acceder a productos propios con token y rol PROVEEDOR válido debe retornar HTTP 200 OK")
    void debePermitirAccesoAProductosConTokenProveedor() throws Exception {
        String tokenProveedor = jwtTokenProvider.generarTokenConRol(DataInitializer.PROVEEDOR_EMAIL, "PROVEEDOR");

        mockMvc.perform(get("/api/v1/providers/me/products")
                .header("Authorization", "Bearer " + tokenProveedor))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[Seguridad 4] Intentar acceder a ruta administrativa como PROVEEDOR debe retornar HTTP 403 Forbidden")
    void debeDenegarAccesoAdminAProveedorCon403() throws Exception {
        String tokenProveedor = jwtTokenProvider.generarTokenConRol(DataInitializer.PROVEEDOR_EMAIL, "PROVEEDOR");

        mockMvc.perform(get("/api/v1/admin/products")
                .header("Authorization", "Bearer " + tokenProveedor))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("[Seguridad 5] Acceder a rutas administrativas como ADMIN debe retornar HTTP 200 OK")
    void debePermitirAccesoAdminConTokenAdmin() throws Exception {
        String tokenAdmin = jwtTokenProvider.generarTokenConRol(DataInitializer.ADMIN_EMAIL, "ADMIN");

        mockMvc.perform(get("/api/v1/admin/products")
                .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("[Seguridad 6] Acceder a /api/v1/auth/me sin token debe retornar HTTP 401 Unauthorized")
    void debeRechazarAuthMeSinTokenCon401() throws Exception {
        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("[Seguridad 7] Acceder a /api/v1/auth/me con token válido de ADMIN debe retornar HTTP 200 OK")
    void debePermitirAuthMeConTokenAdmin() throws Exception {
        String tokenAdmin = jwtTokenProvider.generarTokenConRol(DataInitializer.ADMIN_EMAIL, "ADMIN");

        mockMvc.perform(get("/api/v1/auth/me")
                .header("Authorization", "Bearer " + tokenAdmin))
                .andExpect(status().isOk());
    }
}
