package com.compunex.b2b.modules.ordenes.service;

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
import com.compunex.b2b.modules.ordenes.dto.response.CheckoutResponseDTO;
import com.compunex.b2b.modules.ordenes.exception.AutoCompraException;
import com.compunex.b2b.modules.ordenes.exception.StockInsuficienteException;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class OrderServiceSplitOrderTest {

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
    private OrdenRepository ordenRepository;

    @Test
    void procesarCheckout_multiProveedor_genera1OrdenY2SubordenesYDescuentaStock() {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador", "buyer@split.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario prov1 = usuarioRepository.save(new Usuario("Prov 1", "p1@split.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));
        Usuario prov2 = usuarioRepository.save(new Usuario("Prov 2", "p2@split.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));

        PerfilProveedor perfil1 = crearPerfil(prov1, "20111111112");
        PerfilProveedor perfil2 = crearPerfil(prov2, "20222222223");
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();

        Producto prod1 = crearProducto(perfil1, cat, "Prod A", new BigDecimal("100.00"), 10);
        Producto prod2 = crearProducto(perfil2, cat, "Prod B", new BigDecimal("200.00"), 5);

        CheckoutRequestDTO request = CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .tipoComprobante("FACTURA")
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Comprador SAC")
                        .direccionFiscal("Av. Lima 100")
                        .metodoPagoSimulado("TRANSFERENCIA_B2B")
                        .build())
                .items(List.of(
                        new CheckoutItemDTO(prod1.getId(), 2),
                        new CheckoutItemDTO(prod2.getId(), 1)
                ))
                .build();

        CheckoutResponseDTO resp = orderService.procesarCheckout(comprador.getCorreo(), request);

        assertThat(resp.getFacturasEmitidas()).hasSize(2);
        // (200 + 200) * 1.18 = 472.00
        assertThat(resp.getTotalGeneral()).isEqualByComparingTo("472.00");
        assertThat(resp.getEsSimulado()).isTrue();
        assertThat(resp.getMoneda()).isEqualTo("PEN");
        assertThat(resp.getCodigoOrden()).startsWith("PED-2026-");
        assertThat(resp.getFacturasEmitidas().get(0).getNumeroComprobante()).startsWith("SIM-F001-");
        assertThat(productoRepository.findById(prod1.getId()).orElseThrow().getStockDisponible()).isEqualTo(8);
        assertThat(productoRepository.findById(prod2.getId()).orElseThrow().getStockDisponible()).isEqualTo(4);
    }

    @Test
    void procesarCheckout_autoCompra_lanzaAutoCompraException() {
        Usuario prov = usuarioRepository.save(new Usuario("Prov", "auto@split.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));
        PerfilProveedor perfil = crearPerfil(prov, "20333333334");
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();
        Producto prod = crearProducto(perfil, cat, "Prod Propio", new BigDecimal("50.00"), 10);

        CheckoutRequestDTO request = CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Prov SAC")
                        .direccionFiscal("Av. Lima 100")
                        .build())
                .items(List.of(new CheckoutItemDTO(prod.getId(), 1)))
                .build();

        assertThatThrownBy(() -> orderService.procesarCheckout(prov.getCorreo(), request))
                .isInstanceOf(AutoCompraException.class);
    }

    @Test
    void procesarCheckout_stockInsuficiente_lanzaExcepcionYNoGuardaOrden() {
        long ordenesAntes = ordenRepository.count();
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador 2", "buyer2@split.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario prov = usuarioRepository.save(new Usuario("Prov 3", "p3@split.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));
        PerfilProveedor perfil = crearPerfil(prov, "20444444445");
        Categoria cat = categoriaRepository.findAll().stream()
                .filter(c -> c.getEstado() == EstadoCategoria.ACTIVA)
                .findFirst().orElseThrow();
        Producto prod = crearProducto(perfil, cat, "Prod Limitado", new BigDecimal("50.00"), 2);

        CheckoutRequestDTO request = CheckoutRequestDTO.builder()
                .datosFacturacion(DatosFacturacionDTO.builder()
                        .rucReceptor("20601234567")
                        .razonSocialReceptor("Comprador SAC")
                        .direccionFiscal("Av. Lima 100")
                        .build())
                .items(List.of(new CheckoutItemDTO(prod.getId(), 5)))
                .build();

        assertThatThrownBy(() -> orderService.procesarCheckout(comprador.getCorreo(), request))
                .isInstanceOf(StockInsuficienteException.class);
        assertThat(ordenRepository.count()).isEqualTo(ordenesAntes);
    }

    private PerfilProveedor crearPerfil(Usuario u, String ruc) {
        PerfilProveedor p = new PerfilProveedor();
        p.setUsuario(u);
        p.setIdentificacionFiscal(ruc);
        p.setRazonSocial(u.getNombre());
        p.setTelefonoContacto("999000111");
        p.setDireccion("Av. Test 100");
        p.setCiudad("Lima");
        return perfilProveedorRepository.save(p);
    }

    private Producto crearProducto(PerfilProveedor prov, Categoria cat, String titulo, BigDecimal precio, int stock) {
        Producto p = new Producto();
        p.setProveedor(prov);
        p.setCategoria(cat);
        p.setTitulo(titulo);
        p.setDescripcion("Desc");
        p.setModeloComercial(ModeloComercial.values()[0]);
        p.setTipoFormato("Caja");
        p.setUnidadesPorPaquete("1");
        p.setPedidoMinimo("1");
        p.setPrecioUnitarioRef(precio);
        p.setPrecioTotalRef(precio);
        p.setMoneda("PEN");
        p.setStockDisponible(stock);
        p.setEstado(EstadoProducto.ACTIVO);
        return productoRepository.save(p);
    }
}
