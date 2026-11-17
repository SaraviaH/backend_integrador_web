package com.compunex.b2b.modules.admin.service;

import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.admin.dto.AdminDashboardDTO;
import com.compunex.b2b.modules.admin.entity.SuscripcionProveedor;
import com.compunex.b2b.modules.admin.repository.SuscripcionProveedorRepository;
import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.ordenes.entity.EstadoOrden;
import com.compunex.b2b.modules.ordenes.entity.EstadoSuborden;
import com.compunex.b2b.modules.ordenes.entity.Orden;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.repository.SubordenFacturaRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminPanelService {

    private final OrdenRepository ordenRepository;
    private final SubordenFacturaRepository subordenRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final SuscripcionProveedorRepository suscripcionRepository;

    @Transactional
    public AdminDashboardDTO obtenerDashboard() {
        asegurarSuscripcionesIniciales();

        List<Orden> ordenes = ordenRepository.findAll();
        List<SubordenFactura> subordenes = subordenRepository.findAll();
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<PerfilProveedor> proveedores = proveedorRepository.findAll();
        List<Producto> productos = productoRepository.findAll();
        List<SuscripcionProveedor> suscripciones = suscripcionRepository.findAll();

        BigDecimal gmvTotal = BigDecimal.ZERO;
        BigDecimal igvTotal = BigDecimal.ZERO;
        long pagadas = 0;
        long procesando = 0;
        long canceladas = 0;
        Map<String, Long> porMetodoPago = new LinkedHashMap<>();

        for (Orden o : ordenes) {
            if (o.getEstado() != EstadoOrden.CANCELADO) {
                gmvTotal = gmvTotal.add(o.getMontoTotal() != null ? o.getMontoTotal() : BigDecimal.ZERO);
                igvTotal = igvTotal.add(o.getMontoIgv() != null ? o.getMontoIgv() : BigDecimal.ZERO);
            }
            if (o.getEstado() == EstadoOrden.PAGADO) pagadas++;
            else if (o.getEstado() == EstadoOrden.PROCESANDO) procesando++;
            else if (o.getEstado() == EstadoOrden.CANCELADO) canceladas++;

            String mp = o.getMetodoPagoSimulado() != null ? o.getMetodoPagoSimulado() : "OTRO";
            porMetodoPago.merge(mp, 1L, Long::sum);
        }

        long ordenesValidas = ordenes.size() - canceladas;
        BigDecimal ticketPromedio = ordenesValidas > 0
                ? gmvTotal.divide(BigDecimal.valueOf(ordenesValidas), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Long> subPorEstado = new LinkedHashMap<>();
        for (EstadoSuborden es : EstadoSuborden.values()) {
            subPorEstado.put(es.name(), 0L);
        }
        long entregadas = 0;
        double sumaHorasDespacho = 0.0;
        long countConDespacho = 0;

        Map<Long, BigDecimal> montoPorProveedorUsuario = new HashMap<>();
        Map<Long, Long> ventasPorProveedorUsuario = new HashMap<>();

        for (SubordenFactura s : subordenes) {
            subPorEstado.merge(s.getEstado().name(), 1L, Long::sum);
            if (s.getEstado() == EstadoSuborden.ENTREGADO) entregadas++;
            if ((s.getEstado() == EstadoSuborden.DESPACHADO || s.getEstado() == EstadoSuborden.ENTREGADO)
                    && s.getFechaCreacion() != null && s.getFechaActualizacion() != null) {
                long mins = Math.max(15L, Duration.between(s.getFechaCreacion(), s.getFechaActualizacion()).toMinutes());
                sumaHorasDespacho += mins / 60.0;
                countConDespacho++;
            }
            if (s.getEstado() != EstadoSuborden.CANCELADO && s.getProveedor() != null) {
                Long uid = s.getProveedor().getId();
                montoPorProveedorUsuario.merge(uid, s.getTotal() != null ? s.getTotal() : BigDecimal.ZERO, BigDecimal::add);
                ventasPorProveedorUsuario.merge(uid, 1L, Long::sum);
            }
        }

        double tasaEntrega = !subordenes.isEmpty()
                ? Math.round((entregadas * 1000.0) / subordenes.size()) / 10.0
                : 0.0;
        double tiempoPromedioHoras = countConDespacho > 0
                ? Math.round((sumaHorasDespacho / countConDespacho) * 10.0) / 10.0
                : 0.0;

        List<AdminDashboardDTO.TopProveedorDTO> topProveedores = proveedores.stream()
                .map(p -> {
                    Long uid = p.getUsuario().getId();
                    return AdminDashboardDTO.TopProveedorDTO.builder()
                            .proveedorId(p.getId())
                            .razonSocial(p.getRazonSocial())
                            .ruc(p.getIdentificacionFiscal())
                            .ventasCount(ventasPorProveedorUsuario.getOrDefault(uid, 0L))
                            .montoTotal(montoPorProveedorUsuario.getOrDefault(uid, BigDecimal.ZERO))
                            .build();
                })
                .sorted((a, b) -> b.getMontoTotal().compareTo(a.getMontoTotal()))
                .toList();

        long clientes = usuarios.stream().filter(u -> u.getRol() == RolUsuario.CLIENTE).count();
        long provUsers = usuarios.stream().filter(u -> u.getRol() == RolUsuario.PROVEEDOR).count();
        long verificados = proveedores.stream().filter(p -> Boolean.TRUE.equals(p.getVerificado())).count();

        long activos = productos.stream().filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.ACTIVO).count();
        long ocultosAdmin = productos.stream().filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.OCULTO_POR_ADMIN).count();
        long deshab = productos.stream().filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.DESHABILITADO_POR_PROVEEDOR).count();

        BigDecimal mrr = suscripciones.stream()
                .filter(s -> "ACTIVA".equalsIgnoreCase(s.getEstado()))
                .map(SuscripcionProveedor::getPrecioMensual)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long susActivas = suscripciones.stream().filter(s -> "ACTIVA".equalsIgnoreCase(s.getEstado())).count();
        long conFact = suscripciones.stream().filter(s -> "ACTIVA".equalsIgnoreCase(s.getEstado()) && s.isIncluyeFacturacionSunat()).count();

        return AdminDashboardDTO.builder()
                .gmvTotal(gmvTotal)
                .igvTotalRecaudado(igvTotal)
                .ticketPromedio(ticketPromedio)
                .totalOrdenes(ordenes.size())
                .ordenesPagadas(pagadas)
                .ordenesProcesando(procesando)
                .ordenesCanceladas(canceladas)
                .totalSubordenes(subordenes.size())
                .tasaEntregaPorcentaje(tasaEntrega)
                .tiempoPromedioDespachoHoras(tiempoPromedioHoras)
                .subordenesPorEstado(subPorEstado)
                .ordenesPorMetodoPago(porMetodoPago)
                .topProveedores(topProveedores)
                .totalUsuarios(usuarios.size())
                .totalClientes(clientes)
                .totalProveedores(provUsers)
                .proveedoresVerificados(verificados)
                .totalProductos(productos.stream().filter(p -> p.getFechaEliminacion() == null).count())
                .productosActivos(activos)
                .productosOcultosAdmin(ocultosAdmin)
                .productosDeshabilitados(deshab)
                .mrrSuscripciones(mrr)
                .suscripcionesActivas(susActivas)
                .proveedoresConFacturacion(conFact)
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.AdminProveedorItemDTO> listarProveedores() {
        List<Producto> productos = productoRepository.findAll();
        return proveedorRepository.findAll().stream()
                .map(p -> AdminDashboardDTO.AdminProveedorItemDTO.builder()
                        .proveedorId(p.getId())
                        .razonSocial(p.getRazonSocial())
                        .nombreComercial(p.getNombreComercial())
                        .ruc(p.getIdentificacionFiscal())
                        .ciudad(p.getCiudad())
                        .verificado(Boolean.TRUE.equals(p.getVerificado()))
                        .destacado(Boolean.TRUE.equals(p.getDestacado()))
                        .totalProductos(productos.stream().filter(pr -> pr.getFechaEliminacion() == null && pr.getProveedor().getId().equals(p.getId())).count())
                        .fechaCreacion(p.getFechaCreacion())
                        .build())
                .toList();
    }

    @Transactional
    public AdminDashboardDTO.AdminProveedorItemDTO toggleVerificarProveedor(Long proveedorId, boolean verificado, boolean destacado) {
        PerfilProveedor p = proveedorRepository.findById(proveedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado: " + proveedorId));
        p.setVerificado(verificado);
        p.setDestacado(destacado);
        p.setFechaActualizacion(Instant.now());
        proveedorRepository.save(p);
        return AdminDashboardDTO.AdminProveedorItemDTO.builder()
                .proveedorId(p.getId())
                .razonSocial(p.getRazonSocial())
                .nombreComercial(p.getNombreComercial())
                .ruc(p.getIdentificacionFiscal())
                .ciudad(p.getCiudad())
                .verificado(Boolean.TRUE.equals(p.getVerificado()))
                .destacado(Boolean.TRUE.equals(p.getDestacado()))
                .totalProductos(0)
                .fechaCreacion(p.getFechaCreacion())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.AdminUsuarioItemDTO> listarUsuarios() {
        return usuarioRepository.findAll().stream()
                .sorted(Comparator.comparing(Usuario::getId))
                .map(u -> AdminDashboardDTO.AdminUsuarioItemDTO.builder()
                        .id(u.getId())
                        .nombre(u.getNombre())
                        .correo(u.getCorreo())
                        .rol(u.getRol().name())
                        .estado(u.getEstado().name())
                        .fechaRegistro(u.getFechaRegistro())
                        .ultimoAcceso(u.getUltimoAcceso())
                        .build())
                .toList();
    }

    @Transactional
    public AdminDashboardDTO.AdminUsuarioItemDTO cambiarEstadoUsuario(Long usuarioId, String estadoStr, String motivo) {
        Usuario u = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + usuarioId));
        if (u.getRol() == RolUsuario.ADMIN) {
            throw new IllegalArgumentException("No se puede bloquear una cuenta de administrador.");
        }
        u.setEstado(EstadoUsuario.valueOf(estadoStr.toUpperCase()));
        u.setMotivoEstado(motivo);
        u.setFechaActualizacion(Instant.now());
        usuarioRepository.save(u);
        return AdminDashboardDTO.AdminUsuarioItemDTO.builder()
                .id(u.getId())
                .nombre(u.getNombre())
                .correo(u.getCorreo())
                .rol(u.getRol().name())
                .estado(u.getEstado().name())
                .fechaRegistro(u.getFechaRegistro())
                .ultimoAcceso(u.getUltimoAcceso())
                .build();
    }

    @Transactional(readOnly = true)
    public List<AdminDashboardDTO.AdminOrdenItemDTO> listarOrdenesGlobales() {
        return ordenRepository.findAll().stream()
                .sorted(Comparator.comparing(Orden::getFechaCreacion).reversed())
                .map(o -> AdminDashboardDTO.AdminOrdenItemDTO.builder()
                        .ordenId(o.getId())
                        .codigoOrden(o.getCodigoOrden())
                        .compradorNombre(o.getRazonSocialReceptor())
                        .compradorRuc(o.getRucReceptor())
                        .metodoPago(o.getMetodoPagoSimulado())
                        .codigoAutorizacionPago(o.getCodigoAutorizacionPago())
                        .estado(o.getEstado().name())
                        .montoTotal(o.getMontoTotal())
                        .cantidadSubordenes(o.getSubordenes().size())
                        .fechaCreacion(o.getFechaCreacion())
                        .build())
                .toList();
    }

    @Transactional
    public List<AdminDashboardDTO.SuscripcionItemDTO> listarSuscripciones() {
        asegurarSuscripcionesIniciales();
        return suscripcionRepository.findAll().stream()
                .map(this::toSuscripcionDTO)
                .toList();
    }

    @Transactional
    public AdminDashboardDTO.SuscripcionItemDTO guardarSuscripcion(Long proveedorId, String plan, String estado) {
        PerfilProveedor prov = proveedorRepository.findById(proveedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado: " + proveedorId));

        SuscripcionProveedor sus = suscripcionRepository.findByProveedorId(proveedorId)
                .orElseGet(() -> {
                    SuscripcionProveedor n = new SuscripcionProveedor();
                    n.setProveedor(prov);
                    return n;
                });

        String planNorm = plan.toUpperCase();
        sus.setPlan(planNorm);
        sus.setEstado(estado.toUpperCase());
        if ("ENTERPRISE_SUNAT".equals(planNorm)) {
            sus.setPrecioMensual(new BigDecimal("349.00"));
            sus.setIncluyeFacturacionSunat(true);
            sus.setIncluyeGuiaRemision(true);
        } else if ("PRO_FACTURACION".equals(planNorm)) {
            sus.setPrecioMensual(new BigDecimal("149.00"));
            sus.setIncluyeFacturacionSunat(true);
            sus.setIncluyeGuiaRemision(true);
        } else {
            sus.setPrecioMensual(BigDecimal.ZERO);
            sus.setIncluyeFacturacionSunat(false);
            sus.setIncluyeGuiaRemision(false);
        }
        sus.setFechaInicio(Instant.now());
        sus.setFechaVencimiento(Instant.now().plus(30, ChronoUnit.DAYS));
        sus.setFechaActualizacion(Instant.now());

        return toSuscripcionDTO(suscripcionRepository.save(sus));
    }

    private void asegurarSuscripcionesIniciales() {
        if (suscripcionRepository.count() > 0) return;
        List<PerfilProveedor> proveedores = proveedorRepository.findAll();
        for (int i = 0; i < proveedores.size(); i++) {
            PerfilProveedor p = proveedores.get(i);
            SuscripcionProveedor s = new SuscripcionProveedor();
            s.setProveedor(p);
            if (i == 0) {
                s.setPlan("PRO_FACTURACION");
                s.setPrecioMensual(new BigDecimal("149.00"));
            } else {
                s.setPlan("ENTERPRISE_SUNAT");
                s.setPrecioMensual(new BigDecimal("349.00"));
            }
            s.setEstado("ACTIVA");
            s.setIncluyeFacturacionSunat(true);
            s.setIncluyeGuiaRemision(true);
            suscripcionRepository.save(s);
        }
    }

    private AdminDashboardDTO.SuscripcionItemDTO toSuscripcionDTO(SuscripcionProveedor s) {
        return AdminDashboardDTO.SuscripcionItemDTO.builder()
                .id(s.getId())
                .proveedorId(s.getProveedor().getId())
                .proveedorRazonSocial(s.getProveedor().getRazonSocial())
                .proveedorRuc(s.getProveedor().getIdentificacionFiscal())
                .plan(s.getPlan())
                .precioMensual(s.getPrecioMensual())
                .moneda(s.getMoneda())
                .estado(s.getEstado())
                .incluyeFacturacionSunat(s.isIncluyeFacturacionSunat())
                .incluyeGuiaRemision(s.isIncluyeGuiaRemision())
                .fechaInicio(s.getFechaInicio())
                .fechaVencimiento(s.getFechaVencimiento())
                .build();
    }
}
