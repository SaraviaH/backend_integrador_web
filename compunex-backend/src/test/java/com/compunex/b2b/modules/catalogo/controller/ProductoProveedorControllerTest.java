package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.config.SecurityConfig;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
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
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
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

    @Test
    @DisplayName("[2.2] Debe retornar HTTP 200 con la ficha técnica completa")
    void debeRetornar200ConFichaTecnicaCompleta() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());

        var dto = new ProductoDetalleResponseDTO(
                1L, UUID.randomUUID(), 10L, "TechNova Mayorista S.A.C.", "ram",
                "Memoria RAM Kingston Fury Beast 16GB DDR5 5600MHz",
                "Módulo de memoria DDR5 de alto rendimiento.",
                "DISTRIBUIDOR_OFICIAL", "Caja Master x10 Blísteres", "10 unidades",
                "1 caja (10 unidades)", new BigDecimal("52.50"), new BigDecimal("525.00"),
                "USD", "Garantía de 3 años directa con fabricante.", "ACTIVO", null,
                true, false, false,
                List.of(new ProductoDetalleResponseDTO.EspecificacionDTO("Capacidad", "16 GB")),
                List.of(new ProductoDetalleResponseDTO.ImagenDTO("https://img.compunex.com/ram.jpg", (short) 1)),
                Instant.now(), Instant.now()
        );

        when(productoService.obtenerFichaTecnica("ventas.mayoristas@technova.com", 1L)).thenReturn(dto);

        mockMvc.perform(get("/api/v1/providers/me/products/1").principal(auth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Memoria RAM Kingston Fury Beast 16GB DDR5 5600MHz"))
                .andExpect(jsonPath("$.especificaciones[0].clave").value("Capacidad"))
                .andExpect(jsonPath("$.imagenes[0].urlImagen").value("https://img.compunex.com/ram.jpg"));
    }

    @Test
    @DisplayName("[2.2] Debe retornar 404 cuando el producto no existe")
    void debeRetornar404CuandoProductoNoExisteAlConsultarFichaTecnica() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());
        when(productoService.obtenerFichaTecnica("ventas.mayoristas@technova.com", 99L))
                .thenThrow(new jakarta.persistence.EntityNotFoundException("Producto no encontrado: 99"));

        mockMvc.perform(get("/api/v1/providers/me/products/99").principal(auth))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("[2.5] Debe retornar 200 al cambiar el estado de publicación")
    void debeRetornar200AlCambiarEstadoDePublicacion() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());

        var responseDto = new CambioEstadoResponseDTO(
                1L, UUID.randomUUID(), "ACTIVO", "DESHABILITADO_POR_PROVEEDOR",
                "El producto ha sido deshabilitado del catálogo mayorista temporalmente",
                Instant.now()
        );

        when(productoService.cambiarEstadoPublicacion(eq("ventas.mayoristas@technova.com"), eq(1L), any()))
                .thenReturn(responseDto);

        String body = "{\"estado\":\"DESHABILITADO_POR_PROVEEDOR\"}";

        mockMvc.perform(patch("/api/v1/providers/me/products/1/status")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nuevoEstado").value("DESHABILITADO_POR_PROVEEDOR"));
    }

    @Test
    @DisplayName("[2.5] Debe retornar 404 cuando el producto no es del proveedor al cambiar estado")
    void debeRetornar404CuandoProductoNoEsDelProveedorAlCambiarEstado() throws Exception {
        var auth = new UsernamePasswordAuthenticationToken(
                "ventas.mayoristas@technova.com", null, List.of());

        when(productoService.cambiarEstadoPublicacion(eq("ventas.mayoristas@technova.com"), eq(99L), any()))
                .thenThrow(new jakarta.persistence.EntityNotFoundException("Producto no encontrado: 99"));

        String body = "{\"estado\":\"ACTIVO\"}";

        mockMvc.perform(patch("/api/v1/providers/me/products/99/status")
                        .principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound());
    }
}
