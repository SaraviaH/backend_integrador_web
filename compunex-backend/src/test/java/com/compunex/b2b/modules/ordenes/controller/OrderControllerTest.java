package com.compunex.b2b.modules.ordenes.controller;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.Categoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoCategoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.ModeloComercial;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.CategoriaRepository;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutItemDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.dto.request.DatosFacturacionDTO;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilProveedorRepository perfilProveedorRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void checkout_clienteAutenticado_retorna201() throws Exception {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador HTTP", "http.buyer@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        PerfilProveedor proveedor = perfilProveedorRepository.findAll().stream().findFirst().orElseThrow();
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();

        Producto prod = new Producto();
        prod.setProveedor(proveedor);
        prod.setCategoria(cat);
        prod.setTitulo("Monitor 27 B2B");
        prod.setDescripcion("Monitor IPS");
        prod.setModeloComercial(ModeloComercial.values()[0]);
        prod.setTipoFormato("Caja");
        prod.setUnidadesPorPaquete("1");
        prod.setPedidoMinimo("1");
        prod.setPrecioUnitarioRef(new BigDecimal("500.00"));
        prod.setPrecioTotalRef(new BigDecimal("500.00"));
        prod.setMoneda("PEN");
        prod.setStockDisponible(20);
        prod.setEstado(EstadoProducto.ACTIVO);
        prod = productoRepository.save(prod);

        String token = jwtTokenProvider.generarTokenConRol(comprador.getCorreo(), RolUsuario.CLIENTE.name());

        CheckoutRequestDTO request = CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .tipoComprobante("FACTURA")
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Comprador HTTP SAC")
                        .direccionFiscal("Av. Javier Prado 500")
                        .metodoPagoSimulado("TRANSFERENCIA_B2B")
                        .build())
                .items(List.of(new CheckoutItemDTO(prod.getId(), 2)))
                .build();

        mockMvc.perform(post("/api/v1/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codigoOrden").isNotEmpty())
                .andExpect(jsonPath("$.fechaEmision").isNotEmpty())
                .andExpect(jsonPath("$.moneda").value("PEN"))
                .andExpect(jsonPath("$.totalGeneral").value(1180.0))
                .andExpect(jsonPath("$.esSimulado").value(true))
                .andExpect(jsonPath("$.facturasEmitidas.length()").value(1))
                .andExpect(jsonPath("$.facturasEmitidas[0].tipoComprobante").value("FACTURA"))
                .andExpect(jsonPath("$.facturasEmitidas[0].emisor.ruc").value(proveedor.getIdentificacionFiscal()))
                .andExpect(jsonPath("$.facturasEmitidas[0].receptor.ruc").value("20601234567"))
                .andExpect(jsonPath("$.facturasEmitidas[0].items[0].subtotalLinea").value(1000.0));
    }
}
