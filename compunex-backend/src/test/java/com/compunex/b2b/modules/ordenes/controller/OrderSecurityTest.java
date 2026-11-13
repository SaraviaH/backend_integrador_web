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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrderSecurityTest {

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
    void consultarOrdenAjena_retorna403() throws Exception {
        Usuario dueno = usuarioRepository.save(new Usuario("Dueno", "dueno@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario intruso = usuarioRepository.save(new Usuario("Intruso", "intruso@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));

        PerfilProveedor proveedor = perfilProveedorRepository.findAll().stream().findFirst().orElseThrow();
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();

        Producto prod = new Producto();
        prod.setProveedor(proveedor);
        prod.setCategoria(cat);
        prod.setTitulo("Fuente 750W");
        prod.setDescripcion("80+ Gold");
        prod.setModeloComercial(ModeloComercial.values()[0]);
        prod.setTipoFormato("Caja");
        prod.setUnidadesPorPaquete("1");
        prod.setPedidoMinimo("1");
        prod.setPrecioUnitarioRef(new BigDecimal("120.00"));
        prod.setPrecioTotalRef(new BigDecimal("120.00"));
        prod.setMoneda("PEN");
        prod.setStockDisponible(10);
        prod.setEstado(EstadoProducto.ACTIVO);
        prod = productoRepository.save(prod);

        var checkout = orderService.procesarCheckout(dueno.getCorreo(), CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Dueno SAC")
                        .direccionFiscal("Av. Lima 123")
                        .build())
                .items(List.of(new CheckoutItemDTO(prod.getId(), 1)))
                .build());

        String tokenIntruso = jwtTokenProvider.generarTokenConRol(intruso.getCorreo(), RolUsuario.CLIENTE.name());

        mockMvc.perform(get("/api/v1/orders/me/{ordenId}", checkout.getOrdenId())
                        .header("Authorization", "Bearer " + tokenIntruso))
                .andExpect(status().isForbidden());
    }
}
