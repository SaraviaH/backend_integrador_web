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
import com.compunex.b2b.modules.ordenes.dto.request.CambiarEstadoDespachoDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutItemDTO;
import com.compunex.b2b.modules.ordenes.dto.request.CheckoutRequestDTO;
import com.compunex.b2b.modules.ordenes.entity.EstadoSuborden;
import com.compunex.b2b.modules.ordenes.service.OrderService;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProviderSalesControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
    void listarDetalleYActualizarEstadoDespacho_proveedorDueno_retorna200() throws Exception {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador Sales", "csales@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario proveedor = usuarioRepository.save(new Usuario("Proveedor Sales", "psales@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));
        Usuario otroProv = usuarioRepository.save(new Usuario("Otro Prov", "otrosales@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));

        PerfilProveedor perfil = new PerfilProveedor();
        perfil.setUsuario(proveedor);
        perfil.setIdentificacionFiscal("20777777771");
        perfil.setRazonSocial("Proveedor Sales SAC");
        perfil.setTelefonoContacto("999000111");
        perfil.setDireccion("Av. Test 100");
        perfil.setCiudad("Lima");
        perfil = perfilProveedorRepository.save(perfil);

        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();

        Producto prod = new Producto();
        prod.setProveedor(perfil);
        prod.setCategoria(cat);
        prod.setTitulo("Router Empresarial");
        prod.setDescripcion("WiFi 6");
        prod.setModeloComercial(ModeloComercial.values()[0]);
        prod.setTipoFormato("Caja");
        prod.setUnidadesPorPaquete("1");
        prod.setPedidoMinimo("1");
        prod.setPrecioUnitarioRef(new BigDecimal("250.00"));
        prod.setPrecioTotalRef(new BigDecimal("250.00"));
        prod.setMoneda("PEN");
        prod.setStockDisponible(15);
        prod.setEstado(EstadoProducto.ACTIVO);
        prod = productoRepository.save(prod);

        var checkout = orderService.procesarCheckout(comprador.getCorreo(), CheckoutRequestDTO.builder()
                .rucReceptor("20601234567")
                .razonSocialReceptor("Comprador Sales SAC")
                .direccionFiscal("Av. Lima 123")
                .items(List.of(new CheckoutItemDTO(prod.getId(), 2)))
                .build());

        Long subordenId = checkout.getSubordenes().get(0).getSubordenId();
        String tokenProv = jwtTokenProvider.generarTokenConRol(proveedor.getCorreo(), RolUsuario.PROVEEDOR.name());
        String tokenOtro = jwtTokenProvider.generarTokenConRol(otroProv.getCorreo(), RolUsuario.PROVEEDOR.name());

        mockMvc.perform(get("/api/v1/providers/me/sales")
                        .header("Authorization", "Bearer " + tokenProv))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElementos").value(1))
                .andExpect(jsonPath("$.contenido[0].subordenId").value(subordenId));

        mockMvc.perform(get("/api/v1/providers/me/sales/{id}", subordenId)
                        .header("Authorization", "Bearer " + tokenProv))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("PENDIENTE_DESPACHO"));

        mockMvc.perform(patch("/api/v1/providers/me/sales/{id}/status", subordenId)
                        .header("Authorization", "Bearer " + tokenProv)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new CambiarEstadoDespachoDTO(EstadoSuborden.EN_PREPARACION))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("EN_PREPARACION"));

        mockMvc.perform(get("/api/v1/providers/me/sales/{id}", subordenId)
                        .header("Authorization", "Bearer " + tokenOtro))
                .andExpect(status().isForbidden());
    }
}
