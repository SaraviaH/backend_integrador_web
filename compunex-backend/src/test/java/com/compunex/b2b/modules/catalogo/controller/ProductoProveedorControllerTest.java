package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.config.SecurityConfig;
import com.compunex.b2b.modules.catalogo.service.ProductoService;
import com.compunex.b2b.security.JwtAuthenticationFilter;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(
    controllers = ProductoProveedorController.class,
    excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class},
    excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {SecurityConfig.class, JwtAuthenticationFilter.class})
)
@AutoConfigureMockMvc(addFilters = false)
class ProductoProveedorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductoService productoService;

    @Test
    @DisplayName("[2.6] Debe retornar HTTP 204 al eliminar producto propio")
    void debeRetornar204AlEliminarProductoPropio() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());
        doNothing().when(productoService).eliminarMiProducto("ventas.mayoristas@technova.com", 1L);

        mockMvc.perform(delete("/api/v1/providers/me/products/1").principal(auth))
                .andExpect(status().isNoContent());

        verify(productoService, times(1)).eliminarMiProducto("ventas.mayoristas@technova.com", 1L);
    }

    @Test
    @DisplayName("[2.6] Debe retornar 404 cuando el producto no es del proveedor")
    void debeRetornar404CuandoProductoNoEsDelProveedor() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());
        doThrow(new jakarta.persistence.EntityNotFoundException("Producto no encontrado: 99"))
                .when(productoService).eliminarMiProducto("ventas.mayoristas@technova.com", 99L);

        mockMvc.perform(delete("/api/v1/providers/me/products/99").principal(auth))
                .andExpect(status().isNotFound());
    }
}
