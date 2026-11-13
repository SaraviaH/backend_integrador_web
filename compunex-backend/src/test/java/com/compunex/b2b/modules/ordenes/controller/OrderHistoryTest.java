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
import com.compunex.b2b.modules.ordenes.service.OrderService;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderHistoryTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrderService orderService;

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
    void listarYConsultarDetalleOrden_compradorDueno_retorna200() throws Exception {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador Hist", "hist@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        PerfilProveedor proveedor = perfilProveedorRepository.findAll().stream().findFirst().orElseThrow();
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();

        Producto prod = new Producto();
        prod.setProveedor(proveedor);
        prod.setCategoria(cat);
        prod.setTitulo("SSD 1TB B2B");
        prod.setDescripcion("NVMe");
        prod.setModeloComercial(ModeloComercial.values()[0]);
        prod.setTipoFormato("Caja");
        prod.setUnidadesPorPaquete("1");
        prod.setPedidoMinimo("1");
        prod.setPrecioUnitarioRef(new BigDecimal("100.00"));
        prod.setPrecioTotalRef(new BigDecimal("100.00"));
        prod.setMoneda("PEN");
        prod.setStockDisponible(10);
        prod.setEstado(EstadoProducto.ACTIVO);
        prod = productoRepository.save(prod);

        var checkout = orderService.procesarCheckout(comprador.getCorreo(), CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .tipoComprobante("FACTURA")
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Comprador Hist SAC")
                        .direccionFiscal("Av. Lima 123")
                        .metodoPagoSimulado("TRANSFERENCIA_B2B")
                        .build())
                .items(List.of(new CheckoutItemDTO(prod.getId(), 2)))
                .build());

        String token = jwtTokenProvider.generarTokenConRol(comprador.getCorreo(), RolUsuario.CLIENTE.name());

        mockMvc.perform(get("/api/v1/orders/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElementos").value(1))
                .andExpect(jsonPath("$.contenido[0].codigoOrden").value(checkout.getCodigoOrden()))
                .andExpect(jsonPath("$.contenido[0].cantidadProveedores").value(1))
                .andExpect(jsonPath("$.contenido[0].totalGeneral").value(236.0))
                .andExpect(jsonPath("$.contenido[0].moneda").value("PEN"))
                .andExpect(jsonPath("$.contenido[0].esSimulado").value(true));

        mockMvc.perform(get("/api/v1/orders/me/{ordenId}", checkout.getOrdenId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigoOrden").value(checkout.getCodigoOrden()))
                .andExpect(jsonPath("$.totalGeneral").value(236.0))
                .andExpect(jsonPath("$.esSimulado").value(true))
                .andExpect(jsonPath("$.facturasEmitidas.length()").value(1))
                .andExpect(jsonPath("$.facturasEmitidas[0].items[0].titulo").value("SSD 1TB B2B"))
                .andExpect(jsonPath("$.facturasEmitidas[0].items[0].subtotalLinea").value(200.0));
    }
}
