package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.modules.catalogo.entity.Categoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoCategoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.ModeloComercial;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.CategoriaRepository;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProductoPublicoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private PerfilProveedorRepository perfilProveedorRepository;

    @Test
    void listarProductosPublicos_filtraYExcluyeEliminados() throws Exception {
        PerfilProveedor proveedor = perfilProveedorRepository.findAll().stream().findFirst().orElseThrow();
        Categoria categoria = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst()
                .orElseThrow();

        Producto activo = new Producto();
        activo.setUuid(UUID.randomUUID());
        activo.setProveedor(proveedor);
        activo.setCategoria(categoria);
        activo.setTitulo("Laptop Dell Latitude 5440");
        activo.setDescripcion("Laptop empresarial Core i7");
        activo.setModeloComercial(ModeloComercial.values()[0]);
        activo.setTipoFormato("Caja");
        activo.setUnidadesPorPaquete("1");
        activo.setPedidoMinimo("5");
        activo.setPrecioUnitarioRef(new BigDecimal("3500.00"));
        activo.setPrecioTotalRef(new BigDecimal("17500.00"));
        activo.setMoneda("PEN");
        activo.setEstado(EstadoProducto.ACTIVO);
        productoRepository.save(activo);

        Producto eliminado = new Producto();
        eliminado.setUuid(UUID.randomUUID());
        eliminado.setProveedor(proveedor);
        eliminado.setCategoria(categoria);
        eliminado.setTitulo("Laptop Eliminada");
        eliminado.setDescripcion("No debe aparecer");
        eliminado.setModeloComercial(ModeloComercial.values()[0]);
        eliminado.setTipoFormato("Caja");
        eliminado.setUnidadesPorPaquete("1");
        eliminado.setPedidoMinimo("5");
        eliminado.setPrecioUnitarioRef(new BigDecimal("1000.00"));
        eliminado.setPrecioTotalRef(new BigDecimal("5000.00"));
        eliminado.setMoneda("PEN");
        eliminado.setEstado(EstadoProducto.ELIMINADO_LOGICO);
        eliminado.setFechaEliminacion(Instant.now());
        productoRepository.save(eliminado);

        mockMvc.perform(get("/api/v1/products")
                        .param("search", "laptop")
                        .param("categoryId", categoria.getId().toString())
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contenido[*].titulo", hasItem("Laptop Dell Latitude 5440")))
                .andExpect(jsonPath("$.contenido[*].titulo", not(hasItem("Laptop Eliminada"))));

        mockMvc.perform(get("/api/v1/products/{id}", activo.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.titulo").value("Laptop Dell Latitude 5440"));

        mockMvc.perform(get("/api/v1/products/{id}", eliminado.getId()))
                .andExpect(status().isNotFound());
    }
}
