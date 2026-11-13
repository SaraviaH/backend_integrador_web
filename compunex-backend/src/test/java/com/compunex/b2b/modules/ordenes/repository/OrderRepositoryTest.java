package com.compunex.b2b.modules.ordenes.repository;

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
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class OrderRepositoryTest {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilProveedorRepository perfilProveedorRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    void guardarOrdenConDosSubordenesYCuatroItems_enCascada() {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador SAC", "comp@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario prov1User = usuarioRepository.save(new Usuario("Prov 1", "p1@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));
        Usuario prov2User = usuarioRepository.save(new Usuario("Prov 2", "p2@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));

        PerfilProveedor perfil1 = crearPerfil(prov1User, "20111111111", "Prov 1 SAC");
        Categoria cat = crearCategoria("cat-test", "Periféricos");
        Producto prod1 = crearProducto(perfil1, cat, "Mouse B2B");
        Producto prod2 = crearProducto(perfil1, cat, "Teclado B2B");

        Orden orden = crearOrdenBase(comprador, "ORD-2026-0001");

        SubordenFactura sub1 = crearSuborden(prov1User, "F001-00000001");
        sub1.agregarItem(crearItem(prod1, 2, new BigDecimal("50.00")));
        sub1.agregarItem(crearItem(prod2, 1, new BigDecimal("100.00")));

        SubordenFactura sub2 = crearSuborden(prov2User, "F001-00000002");
        sub2.agregarItem(crearItem(prod1, 3, new BigDecimal("50.00")));
        sub2.agregarItem(crearItem(prod2, 2, new BigDecimal("100.00")));

        orden.agregarSuborden(sub1);
        orden.agregarSuborden(sub2);

        Orden guardada = ordenRepository.saveAndFlush(orden);

        assertThat(guardada.getId()).isNotNull();
        assertThat(guardada.getSubordenes()).hasSize(2);
        assertThat(guardada.getSubordenes().get(0).getItems()).hasSize(2);
        assertThat(guardada.getSubordenes().get(1).getItems()).hasSize(2);
        assertThat(ordenRepository.findByCompradorId(comprador.getId(), PageRequest.of(0, 10)).getTotalElements()).isEqualTo(1);
        assertThat(ordenRepository.findByCodigoOrden("ORD-2026-0001")).isPresent();
    }

    @Test
    void codigoOrdenDuplicado_lanzaExcepcionDeIntegridad() {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador 2", "comp2@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        ordenRepository.saveAndFlush(crearOrdenBase(comprador, "ORD-DUP-001"));

        Orden duplicada = crearOrdenBase(comprador, "ORD-DUP-001");
        assertThatThrownBy(() -> ordenRepository.saveAndFlush(duplicada))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    private Orden crearOrdenBase(Usuario comprador, String codigo) {
        Orden orden = new Orden();
        orden.setCodigoOrden(codigo);
        orden.setComprador(comprador);
        orden.setMontoSubtotal(new BigDecimal("550.00"));
        orden.setMontoIgv(new BigDecimal("99.00"));
        orden.setMontoTotal(new BigDecimal("649.00"));
        orden.setRucReceptor("20601234567");
        orden.setRazonSocialReceptor("Comprador SAC");
        orden.setDireccionFiscal("Av. Lima 123");
        return orden;
    }

    private SubordenFactura crearSuborden(Usuario proveedor, String comprobante) {
        SubordenFactura sub = new SubordenFactura();
        sub.setProveedor(proveedor);
        sub.setNumeroComprobante(comprobante);
        sub.setSubtotal(new BigDecimal("200.00"));
        sub.setIgv(new BigDecimal("36.00"));
        sub.setTotal(new BigDecimal("236.00"));
        return sub;
    }

    private OrdenItem crearItem(Producto producto, int cantidad, BigDecimal precio) {
        OrdenItem item = new OrdenItem();
        item.setProducto(producto);
        item.setCantidad(cantidad);
        item.setPrecioUnitario(precio);
        item.setSubtotal(precio.multiply(BigDecimal.valueOf(cantidad)));
        return item;
    }

    private PerfilProveedor crearPerfil(Usuario u, String ruc, String razon) {
        PerfilProveedor p = new PerfilProveedor();
        p.setUsuario(u);
        p.setIdentificacionFiscal(ruc);
        p.setRazonSocial(razon);
        p.setTelefonoContacto("999000111");
        p.setDireccion("Av. Test 100");
        p.setCiudad("Lima");
        return perfilProveedorRepository.save(p);
    }

    private Categoria crearCategoria(String id, String nombre) {
        Categoria c = new Categoria();
        c.setId(id);
        c.setNombre(nombre);
        c.setEstado(EstadoCategoria.ACTIVA);
        return categoriaRepository.save(c);
    }

    private Producto crearProducto(PerfilProveedor prov, Categoria cat, String titulo) {
        Producto p = new Producto();
        p.setProveedor(prov);
        p.setCategoria(cat);
        p.setTitulo(titulo);
        p.setDescripcion("Descripción B2B");
        p.setModeloComercial(ModeloComercial.values()[0]);
        p.setTipoFormato("Caja");
        p.setUnidadesPorPaquete("1");
        p.setPedidoMinimo("1");
        p.setPrecioUnitarioRef(new BigDecimal("50.00"));
        p.setPrecioTotalRef(new BigDecimal("50.00"));
        p.setMoneda("PEN");
        p.setEstado(EstadoProducto.ACTIVO);
        return productoRepository.save(p);
    }
}
