package com.compunex.b2b.modules.ordenes.repository;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
class SubordenRepositoryTest {

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private SubordenFacturaRepository subordenFacturaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void consultarPorProveedorYComprobante_yValidarUnicidad() {
        Usuario comprador = usuarioRepository.save(new Usuario("Comprador", "c@test.com", "hash", RolUsuario.CLIENTE, EstadoUsuario.ACTIVO));
        Usuario proveedor = usuarioRepository.save(new Usuario("Proveedor", "p@test.com", "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO));

        Orden orden = new Orden();
        orden.setCodigoOrden("ORD-SUB-001");
        orden.setComprador(comprador);
        orden.setMontoSubtotal(new BigDecimal("100.00"));
        orden.setMontoIgv(new BigDecimal("18.00"));
        orden.setMontoTotal(new BigDecimal("118.00"));
        orden.setRucReceptor("20601234567");
        orden.setRazonSocialReceptor("Comprador SAC");
        orden.setDireccionFiscal("Av. Lima 123");

        SubordenFactura sub = new SubordenFactura();
        sub.setProveedor(proveedor);
        sub.setNumeroComprobante("F001-00000099");
        sub.setSubtotal(new BigDecimal("100.00"));
        sub.setIgv(new BigDecimal("18.00"));
        sub.setTotal(new BigDecimal("118.00"));
        orden.agregarSuborden(sub);

        ordenRepository.saveAndFlush(orden);

        assertThat(subordenFacturaRepository.findByProveedorId(proveedor.getId(), PageRequest.of(0, 10)).getTotalElements()).isEqualTo(1);
        assertThat(subordenFacturaRepository.findByNumeroComprobante("F001-00000099")).isPresent();

        SubordenFactura duplicada = new SubordenFactura();
        duplicada.setOrden(orden);
        duplicada.setProveedor(proveedor);
        duplicada.setNumeroComprobante("F001-00000099");
        duplicada.setSubtotal(new BigDecimal("10.00"));
        duplicada.setIgv(new BigDecimal("1.80"));
        duplicada.setTotal(new BigDecimal("11.80"));

        assertThatThrownBy(() -> subordenFacturaRepository.saveAndFlush(duplicada))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
