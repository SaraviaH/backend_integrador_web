package com.compunex.b2b.config;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.entity.*;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Siembra histórico analítico B2B (junio - noviembre) de forma idempotente para
 * alimentar métricas mensuales, categorías y reportes del panel administrativo.
 */
@Component
@Order(20)
@RequiredArgsConstructor
public class AdminAnalyticsSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminAnalyticsSeeder.class);
    private static final ZoneId LIMA_ZONE = ZoneId.of("America/Lima");

    private final OrdenRepository ordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        List<Producto> productosActivos = productoRepository.findAll().stream()
                .filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.ACTIVO)
                .toList();

        if (productosActivos.size() < 2) {
            return;
        }

        boolean yaSembrado = ordenRepository.findAll().stream()
                .anyMatch(o -> o.getCodigoOrden() != null && o.getCodigoOrden().startsWith("ORD-HIST-2026-"));
        if (yaSembrado) {
            return;
        }

        Usuario comprador1 = usuarioRepository.findByCorreo("compras@comercialtech.pe")
                .orElseGet(() -> crearComprador("Comercial Tech MYPE S.A.C.", "compras@comercialtech.pe"));
        Usuario comprador2 = usuarioRepository.findByCorreo("compras@invdigitales.pe")
                .orElseGet(() -> crearComprador("Inversiones Digitales Perú S.A.C.", "compras@invdigitales.pe"));
        Usuario comprador3 = usuarioRepository.findByCorreo("adquisiciones@solucionesti.pe")
                .orElseGet(() -> crearComprador("Soluciones TI Corporativas E.I.R.L.", "adquisiciones@solucionesti.pe"));

        asegurarTercerProveedor();

        List<Usuario> compradores = List.of(comprador1, comprador2, comprador3);
        List<String> rucs = List.of("20607776661", "20601234567", "20549988771");
        List<String> direcciones = List.of(
                "Av. República de Panamá 3420, San Isidro, Lima",
                "Calle Las Camelias 780, San Isidro, Lima",
                "Av. Javier Prado Este 4200, Santiago de Surco, Lima"
        );
        List<String> metodos = List.of("TRANSFERENCIA_B2B", "CREDITO_B2B", "TARJETA_CORPORATIVA");

        // Agrupar productos por categoría para asegurar variedad en las gráficas
        Map<String, Producto> muestraPorCategoria = new LinkedHashMap<>();
        for (Producto p : productosActivos) {
            if (p.getCategoria() != null) {
                muestraPorCategoria.putIfAbsent(p.getCategoria().getNombre(), p);
            }
        }
        List<Producto> pool = new ArrayList<>(muestraPorCategoria.values());
        if (pool.size() < 4) {
            pool = new ArrayList<>(productosActivos);
        }

        // Distribución creciente realista entre Junio 2026 y Noviembre 2026
        record SeedSpec(int monthsAgo, int dayOfMonth, int qtyA, int qtyB, long dispatchHours, EstadoOrden ordenEstado, EstadoSuborden subEstado) {}
        List<SeedSpec> specs = List.of(
                new SeedSpec(5, 8, 2, 1, 34, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(5, 22, 3, 2, 31, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(4, 5, 3, 2, 29, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(4, 16, 4, 2, 27, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(4, 27, 2, 3, 25, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(3, 6, 4, 3, 24, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(3, 14, 2, 1, 20, EstadoOrden.CANCELADO, EstadoSuborden.CANCELADO),
                new SeedSpec(3, 25, 5, 3, 22, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(2, 4, 4, 4, 20, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(2, 12, 5, 3, 19, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(2, 21, 6, 2, 18, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(2, 28, 3, 5, 17, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(1, 5, 6, 4, 16, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(1, 13, 5, 4, 15, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(1, 20, 7, 3, 14, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(1, 27, 4, 6, 13, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(0, 2, 5, 4, 12, EstadoOrden.PAGADO, EstadoSuborden.ENTREGADO),
                new SeedSpec(0, 7, 6, 4, 11, EstadoOrden.PAGADO, EstadoSuborden.DESPACHADO)
        );

        LocalDate baseLima = LocalDate.now(LIMA_ZONE);
        for (int i = 0; i < specs.size(); i++) {
            SeedSpec spec = specs.get(i);
            LocalDate fechaOrdenDate = baseLima.minusMonths(spec.monthsAgo())
                    .withDayOfMonth(Math.min(spec.dayOfMonth(), baseLima.minusMonths(spec.monthsAgo()).lengthOfMonth()));
            if (fechaOrdenDate.isAfter(baseLima)) {
                fechaOrdenDate = baseLima.minusDays(1);
            }
            Instant createdAt = fechaOrdenDate.atTime(10 + (i % 7), 15).atZone(LIMA_ZONE).toInstant();
            Instant updatedAt = createdAt.plus(spec.dispatchHours(), ChronoUnit.HOURS);

            int buyerIdx = i % compradores.size();
            Usuario buyer = compradores.get(buyerIdx);
            Producto prodA = pool.get(i % pool.size());
            Producto prodB = pool.get((i + 3) % pool.size());

            Orden orden = new Orden();
            orden.setCodigoOrden(String.format("ORD-HIST-2026-%03d", i + 1));
            orden.setComprador(buyer);
            orden.setEstado(spec.ordenEstado());
            orden.setRucReceptor(rucs.get(buyerIdx));
            orden.setRazonSocialReceptor(buyer.getNombre());
            orden.setDireccionFiscal(direcciones.get(buyerIdx));
            orden.setTipoComprobante("FACTURA");
            orden.setMetodoPagoSimulado(metodos.get(i % metodos.size()));
            orden.setCodigoAutorizacionPago(String.format("AUTH-B2B-%04d", 4100 + i));
            orden.setEstadoPagoSimulado(spec.ordenEstado() == EstadoOrden.CANCELADO ? "RECHAZADO" : "APROBADO");
            orden.setMoneda("PEN");
            orden.setFechaCreacion(createdAt);
            orden.setFechaActualizacion(updatedAt);

            Map<Long, List<ItemPair>> porProveedor = new LinkedHashMap<>();
            porProveedor.computeIfAbsent(prodA.getProveedor().getId(), k -> new ArrayList<>())
                    .add(new ItemPair(prodA, spec.qtyA()));
            porProveedor.computeIfAbsent(prodB.getProveedor().getId(), k -> new ArrayList<>())
                    .add(new ItemPair(prodB, spec.qtyB()));

            BigDecimal ordenSubtotal = BigDecimal.ZERO;
            BigDecimal ordenIgv = BigDecimal.ZERO;
            BigDecimal ordenTotal = BigDecimal.ZERO;

            int subIndex = 1;
            for (List<ItemPair> group : porProveedor.values()) {
                SubordenFactura sub = new SubordenFactura();
                sub.setProveedor(group.get(0).producto().getProveedor().getUsuario());
                sub.setNumeroComprobante(String.format("FH%02d-%06d", subIndex++, 1000 + i * 10 + subIndex));
                sub.setTipoComprobante("FACTURA");
                sub.setMoneda("PEN");
                sub.setEstado(spec.subEstado());
                sub.setFechaCreacion(createdAt);
                sub.setFechaActualizacion(updatedAt);

                BigDecimal subTotalSinIgv = BigDecimal.ZERO;
                for (ItemPair ip : group) {
                    BigDecimal precio = normalizarPrecioSoles(ip.producto());
                    BigDecimal lineSubtotal = precio.multiply(BigDecimal.valueOf(ip.cantidad()))
                            .setScale(2, RoundingMode.HALF_UP);
                    OrdenItem item = new OrdenItem();
                    item.setProducto(ip.producto());
                    item.setCantidad(ip.cantidad());
                    item.setPrecioUnitario(precio);
                    item.setSubtotal(lineSubtotal);
                    sub.agregarItem(item);
                    subTotalSinIgv = subTotalSinIgv.add(lineSubtotal);
                }

                BigDecimal subIgv = subTotalSinIgv.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
                BigDecimal subTotalConIgv = subTotalSinIgv.add(subIgv);
                sub.setSubtotal(subTotalSinIgv);
                sub.setIgv(subIgv);
                sub.setTotal(subTotalConIgv);

                orden.agregarSuborden(sub);
                ordenSubtotal = ordenSubtotal.add(subTotalSinIgv);
                ordenIgv = ordenIgv.add(subIgv);
                ordenTotal = ordenTotal.add(subTotalConIgv);
            }

            orden.setMontoSubtotal(ordenSubtotal);
            orden.setMontoIgv(ordenIgv);
            orden.setMontoTotal(ordenTotal);
            ordenRepository.save(orden);
        }

        log.info("[COMPUNEX-ANALYTICS] Historico analitico de {} ordenes sembrado para dashboard y reportes.", specs.size());
    }

    private BigDecimal normalizarPrecioSoles(Producto p) {
        BigDecimal base = p.getPrecioUnitarioRef() != null ? p.getPrecioUnitarioRef() : new BigDecimal("180.00");
        if ("USD".equalsIgnoreCase(p.getMoneda())) {
            return base.multiply(new BigDecimal("3.75")).setScale(2, RoundingMode.HALF_UP);
        }
        return base.setScale(2, RoundingMode.HALF_UP);
    }

    private Usuario crearComprador(String nombre, String correo) {
        Usuario u = new Usuario(
                nombre,
                correo,
                passwordEncoder.encode("ClienteB2B2026!"),
                RolUsuario.CLIENTE,
                EstadoUsuario.ACTIVO
        );
        return usuarioRepository.save(u);
    }

    private void asegurarTercerProveedor() {
        String email = "ventas@megaredes.pe";
        if (usuarioRepository.findByCorreo(email).isPresent()) {
            return;
        }
        Usuario provUser = usuarioRepository.save(new Usuario(
                "MegaRedes & Servidores S.A.C.",
                email,
                passwordEncoder.encode("ProveedorB2B2026!"),
                RolUsuario.PROVEEDOR,
                EstadoUsuario.ACTIVO
        ));
        PerfilProveedor perfil = new PerfilProveedor();
        perfil.setUsuario(provUser);
        perfil.setIdentificacionFiscal("20609911223");
        perfil.setRazonSocial("MegaRedes & Servidores S.A.C.");
        perfil.setNombreComercial("MegaRedes Enterprise B2B");
        perfil.setTelefonoContacto("+51 944 812 300");
        perfil.setDireccion("Av. Petit Thouars 2450, Lince");
        perfil.setCiudad("Lima");
        perfil.setAnosMercado("6 años");
        perfil.setDescripcion("Especialistas en infraestructura enterprise, almacenamiento NVMe y memoria ECC.");
        perfil.setPoliticaComercial("Despacho en 24h en Lima Metropolitana y cobertura nacional.");
        perfil.setCalificacion(new BigDecimal("4.78"));
        perfil.setVerificado(true);
        perfil.setDestacado(true);
        proveedorRepository.save(perfil);
    }

    private record ItemPair(Producto producto, int cantidad) {}
}
