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
import com.compunex.b2b.modules.ordenes.entity.OrdenItem;
import com.compunex.b2b.modules.ordenes.entity.SubordenFactura;
import com.compunex.b2b.modules.ordenes.repository.OrdenItemRepository;
import com.compunex.b2b.modules.ordenes.repository.OrdenRepository;
import com.compunex.b2b.modules.ordenes.repository.SubordenFacturaRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminPanelService {

    private static final ZoneId LIMA_ZONE = ZoneId.of("America/Lima");
    private static final String[] MESES_ES = {
            "Ene", "Feb", "Mar", "Abr", "May", "Jun",
            "Jul", "Ago", "Set", "Oct", "Nov", "Dic"
    };

    private final OrdenRepository ordenRepository;
    private final SubordenFacturaRepository subordenRepository;
    private final OrdenItemRepository ordenItemRepository;
    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository proveedorRepository;
    private final ProductoRepository productoRepository;
    private final SuscripcionProveedorRepository suscripcionRepository;

    @Transactional
    public AdminDashboardDTO obtenerDashboard() {
        asegurarSuscripcionesIniciales();

        List<Orden> ordenes = ordenRepository.findAll();
        List<SubordenFactura> subordenes = subordenRepository.findAll();
        List<OrdenItem> ordenItems = ordenItemRepository.findAll();
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

        List<AdminDashboardDTO.SerieMensualDTO> ventasMensuales = calcularSerieMensual(ordenes, subordenes);
        List<AdminDashboardDTO.CategoriaMetricDTO> ventasPorCategoria = calcularMetricasPorCategoria(ordenItems);

        double crecimientoMensual = calcularCrecimientoMensual(ventasMensuales);

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

        BigDecimal comisionPlataforma = gmvTotal.multiply(new BigDecimal("0.035")).setScale(2, RoundingMode.HALF_UP);
        BigDecimal ingresosTotales = comisionPlataforma.add(mrr);

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
                .crecimientoMensualPorcentaje(crecimientoMensual)
                .comisionPlataformaEstimada(comisionPlataforma)
                .ingresosTotalesPlataforma(ingresosTotales)
                .subordenesPorEstado(subPorEstado)
                .ordenesPorMetodoPago(porMetodoPago)
                .topProveedores(topProveedores)
                .ventasMensuales(ventasMensuales)
                .ventasPorCategoria(ventasPorCategoria)
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

    private List<AdminDashboardDTO.SerieMensualDTO> calcularSerieMensual(
            List<Orden> ordenes, List<SubordenFactura> subordenes) {
        YearMonth ultimoMes = YearMonth.now(LIMA_ZONE);
        for (Orden o : ordenes) {
            if (o.getFechaCreacion() != null) {
                YearMonth ym = YearMonth.from(o.getFechaCreacion().atZone(LIMA_ZONE));
                if (ym.isAfter(ultimoMes)) {
                    ultimoMes = ym;
                }
            }
        }

        List<YearMonth> meses = new ArrayList<>(6);
        for (int i = 5; i >= 0; i--) {
            meses.add(ultimoMes.minusMonths(i));
        }

        Map<YearMonth, BigDecimal> gmvMes = new HashMap<>();
        Map<YearMonth, BigDecimal> igvMes = new HashMap<>();
        Map<YearMonth, Long> countMes = new HashMap<>();
        for (Orden o : ordenes) {
            if (o.getFechaCreacion() == null || o.getEstado() == EstadoOrden.CANCELADO) continue;
            YearMonth ym = YearMonth.from(o.getFechaCreacion().atZone(LIMA_ZONE));
            gmvMes.merge(ym, o.getMontoTotal() != null ? o.getMontoTotal() : BigDecimal.ZERO, BigDecimal::add);
            igvMes.merge(ym, o.getMontoIgv() != null ? o.getMontoIgv() : BigDecimal.ZERO, BigDecimal::add);
            countMes.merge(ym, 1L, Long::sum);
        }

        Map<YearMonth, Double> horasSumMes = new HashMap<>();
        Map<YearMonth, Long> horasCountMes = new HashMap<>();
        for (SubordenFactura s : subordenes) {
            if ((s.getEstado() == EstadoSuborden.DESPACHADO || s.getEstado() == EstadoSuborden.ENTREGADO)
                    && s.getFechaCreacion() != null && s.getFechaActualizacion() != null) {
                YearMonth ym = YearMonth.from(s.getFechaCreacion().atZone(LIMA_ZONE));
                long mins = Math.max(15L, Duration.between(s.getFechaCreacion(), s.getFechaActualizacion()).toMinutes());
                horasSumMes.merge(ym, mins / 60.0, Double::sum);
                horasCountMes.merge(ym, 1L, Long::sum);
            }
        }

        List<AdminDashboardDTO.SerieMensualDTO> serie = new ArrayList<>(6);
        for (YearMonth ym : meses) {
            BigDecimal gmv = gmvMes.getOrDefault(ym, BigDecimal.ZERO);
            BigDecimal igv = igvMes.getOrDefault(ym, BigDecimal.ZERO);
            long count = countMes.getOrDefault(ym, 0L);
            BigDecimal ticket = count > 0
                    ? gmv.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            long hc = horasCountMes.getOrDefault(ym, 0L);
            double horasProm = hc > 0
                    ? Math.round((horasSumMes.getOrDefault(ym, 0.0) / hc) * 10.0) / 10.0
                    : 0.0;

            String etiqueta = MESES_ES[ym.getMonthValue() - 1] + " " + String.valueOf(ym.getYear()).substring(2);
            serie.add(AdminDashboardDTO.SerieMensualDTO.builder()
                    .periodo(ym.toString())
                    .etiqueta(etiqueta)
                    .gmv(gmv)
                    .igv(igv)
                    .ordenesCount(count)
                    .ticketPromedio(ticket)
                    .horasDespachoPromedio(horasProm)
                    .build());
        }
        return serie;
    }

    private List<AdminDashboardDTO.CategoriaMetricDTO> calcularMetricasPorCategoria(List<OrdenItem> items) {
        Map<String, Long> unidadesPorCat = new HashMap<>();
        Map<String, BigDecimal> montoPorCat = new HashMap<>();
        Map<String, Set<Long>> ordenesPorCat = new HashMap<>();
        BigDecimal totalGeneral = BigDecimal.ZERO;

        for (OrdenItem item : items) {
            if (item.getSuborden() != null && item.getSuborden().getEstado() == EstadoSuborden.CANCELADO) continue;
            if (item.getProducto() == null || item.getProducto().getCategoria() == null) continue;

            String cat = item.getProducto().getCategoria().getNombre();
            long qty = item.getCantidad() != null ? item.getCantidad() : 0L;
            BigDecimal sub = item.getSubtotal() != null ? item.getSubtotal() : BigDecimal.ZERO;

            unidadesPorCat.merge(cat, qty, Long::sum);
            montoPorCat.merge(cat, sub, BigDecimal::add);
            totalGeneral = totalGeneral.add(sub);

            if (item.getSuborden() != null && item.getSuborden().getOrden() != null) {
                ordenesPorCat.computeIfAbsent(cat, k -> new HashSet<>())
                        .add(item.getSuborden().getOrden().getId());
            }
        }

        final BigDecimal divisor = totalGeneral;
        return montoPorCat.entrySet().stream()
                .map(entry -> {
                    String cat = entry.getKey();
                    BigDecimal monto = entry.getValue();
                    double pct = divisor.compareTo(BigDecimal.ZERO) > 0
                            ? monto.multiply(BigDecimal.valueOf(100))
                                    .divide(divisor, 1, RoundingMode.HALF_UP)
                                    .doubleValue()
                            : 0.0;
                    return AdminDashboardDTO.CategoriaMetricDTO.builder()
                            .categoria(cat)
                            .unidadesVendidas(unidadesPorCat.getOrDefault(cat, 0L))
                            .ordenesCount(ordenesPorCat.getOrDefault(cat, Set.of()).size())
                            .montoTotal(monto)
                            .porcentajeParticipacion(pct)
                            .build();
                })
                .sorted((a, b) -> b.getMontoTotal().compareTo(a.getMontoTotal()))
                .toList();
    }

    private double calcularCrecimientoMensual(List<AdminDashboardDTO.SerieMensualDTO> serie) {
        if (serie.size() < 2) return 0.0;
        BigDecimal anterior = serie.get(serie.size() - 2).getGmv();
        BigDecimal actual = serie.get(serie.size() - 1).getGmv();
        if (anterior == null || anterior.compareTo(BigDecimal.ZERO) <= 0) {
            return actual != null && actual.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return actual.subtract(anterior)
                .multiply(BigDecimal.valueOf(100))
                .divide(anterior, 1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Transactional
    public byte[] generarCsvEjecutivo() {
        AdminDashboardDTO dto = obtenerDashboard();
        StringBuilder sb = new StringBuilder();
        sb.append('\uFEFF');
        sb.append("COMPUNEX B2B - REPORTE EJECUTIVO DE NEGOCIO\n");
        sb.append("Generado UTC,").append(Instant.now()).append('\n');
        sb.append('\n');
        sb.append("INDICADOR,VALOR\n");
        sb.append("GMV Total (S/),").append(dto.getGmvTotal()).append('\n');
        sb.append("IGV Recaudado SUNAT (S/),").append(dto.getIgvTotalRecaudado()).append('\n');
        sb.append("Comision Marketplace Estimada 3.5% (S/),").append(dto.getComisionPlataformaEstimada()).append('\n');
        sb.append("MRR Suscripciones SaaS (S/),").append(dto.getMrrSuscripciones()).append('\n');
        sb.append("Ingresos Totales Plataforma (S/),").append(dto.getIngresosTotalesPlataforma()).append('\n');
        sb.append("Total Ordenes,").append(dto.getTotalOrdenes()).append('\n');
        sb.append("Ordenes Pagadas,").append(dto.getOrdenesPagadas()).append('\n');
        sb.append("Ticket Promedio B2B (S/),").append(dto.getTicketPromedio()).append('\n');
        sb.append("Tasa Entrega Completa (%),").append(dto.getTasaEntregaPorcentaje()).append('\n');
        sb.append("Tiempo Promedio Despacho (horas),").append(dto.getTiempoPromedioDespachoHoras()).append('\n');
        sb.append('\n');
        sb.append("EVOLUCION MENSUAL\n");
        sb.append("Periodo,Etiqueta,GMV (S/),IGV (S/),Ordenes,Ticket Promedio (S/),Despacho Promedio (h)\n");
        for (AdminDashboardDTO.SerieMensualDTO m : dto.getVentasMensuales()) {
            sb.append(csvCell(m.getPeriodo())).append(',')
                    .append(csvCell(m.getEtiqueta())).append(',')
                    .append(m.getGmv()).append(',')
                    .append(m.getIgv()).append(',')
                    .append(m.getOrdenesCount()).append(',')
                    .append(m.getTicketPromedio()).append(',')
                    .append(m.getHorasDespachoPromedio()).append('\n');
        }
        sb.append('\n');
        sb.append("VENTAS POR CATEGORIA\n");
        sb.append("Categoria,Unidades,Ordenes,Monto Total (S/),Participacion (%)\n");
        for (AdminDashboardDTO.CategoriaMetricDTO c : dto.getVentasPorCategoria()) {
            sb.append(csvCell(c.getCategoria())).append(',')
                    .append(c.getUnidadesVendidas()).append(',')
                    .append(c.getOrdenesCount()).append(',')
                    .append(c.getMontoTotal()).append(',')
                    .append(c.getPorcentajeParticipacion()).append('\n');
        }
        sb.append('\n');
        sb.append("TOP PROVEEDORES\n");
        sb.append("Razon Social,RUC,Subordenes,Facturacion (S/)\n");
        for (AdminDashboardDTO.TopProveedorDTO p : dto.getTopProveedores()) {
            sb.append(csvCell(p.getRazonSocial())).append(',')
                    .append(csvCell(p.getRuc())).append(',')
                    .append(p.getVentasCount()).append(',')
                    .append(p.getMontoTotal()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional(readOnly = true)
    public byte[] generarCsvOrdenes() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(LIMA_ZONE);
        StringBuilder sb = new StringBuilder();
        sb.append('\uFEFF');
        sb.append("Codigo Orden,Fecha Lima,Comprador,RUC,Metodo Pago,Autorizacion,Subtotal (S/),IGV (S/),Total (S/),Estado,Subordenes\n");
        List<Orden> ordenes = ordenRepository.findAll().stream()
                .sorted(Comparator.comparing(Orden::getFechaCreacion).reversed())
                .toList();
        for (Orden o : ordenes) {
            sb.append(csvCell(o.getCodigoOrden())).append(',')
                    .append(csvCell(o.getFechaCreacion() != null ? fmt.format(o.getFechaCreacion()) : "")).append(',')
                    .append(csvCell(o.getRazonSocialReceptor())).append(',')
                    .append(csvCell(o.getRucReceptor())).append(',')
                    .append(csvCell(o.getMetodoPagoSimulado())).append(',')
                    .append(csvCell(o.getCodigoAutorizacionPago())).append(',')
                    .append(o.getMontoSubtotal()).append(',')
                    .append(o.getMontoIgv()).append(',')
                    .append(o.getMontoTotal()).append(',')
                    .append(csvCell(o.getEstado().name())).append(',')
                    .append(o.getSubordenes().size()).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional
    public byte[] generarCsvSuscripciones() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd").withZone(LIMA_ZONE);
        List<AdminDashboardDTO.SuscripcionItemDTO> lista = listarSuscripciones();
        StringBuilder sb = new StringBuilder();
        sb.append('\uFEFF');
        sb.append("Proveedor,RUC,Plan SaaS,Estado,Tarifa Mensual (S/),Facturacion SUNAT,Guia Remision GRE,Inicio,Vencimiento\n");
        for (AdminDashboardDTO.SuscripcionItemDTO s : lista) {
            sb.append(csvCell(s.getProveedorRazonSocial())).append(',')
                    .append(csvCell(s.getProveedorRuc())).append(',')
                    .append(csvCell(s.getPlan())).append(',')
                    .append(csvCell(s.getEstado())).append(',')
                    .append(s.getPrecioMensual()).append(',')
                    .append(s.isIncluyeFacturacionSunat() ? "SI" : "NO").append(',')
                    .append(s.isIncluyeGuiaRemision() ? "SI" : "NO").append(',')
                    .append(csvCell(s.getFechaInicio() != null ? fmt.format(s.getFechaInicio()) : "")).append(',')
                    .append(csvCell(s.getFechaVencimiento() != null ? fmt.format(s.getFechaVencimiento()) : "")).append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String csvCell(String val) {
        if (val == null) return "\"\"";
        String clean = val.replace("\"", "\"\"");
        return "\"" + clean + "\"";
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
                .sorted(Comparator.comparing(s -> s.getProveedor().getId()))
                .map(this::toSuscripcionDTO)
                .toList();
    }

    @Transactional
    public AdminDashboardDTO.SuscripcionItemDTO guardarSuscripcion(Long proveedorId, String plan, String estado) {
        PerfilProveedor prov = proveedorRepository.findById(proveedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado: " + proveedorId));

        SuscripcionProveedor sus = suscripcionRepository.findFirstByProveedorIdOrderByIdAsc(proveedorId)
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
        List<PerfilProveedor> proveedores = proveedorRepository.findAll();
        List<SuscripcionProveedor> existentes = suscripcionRepository.findAll();
        Map<Long, List<SuscripcionProveedor>> porProveedor = new HashMap<>();
        for (SuscripcionProveedor s : existentes) {
            porProveedor.computeIfAbsent(s.getProveedor().getId(), k -> new ArrayList<>()).add(s);
        }

        for (int i = 0; i < proveedores.size(); i++) {
            PerfilProveedor p = proveedores.get(i);
            List<SuscripcionProveedor> lista = porProveedor.getOrDefault(p.getId(), List.of());
            if (lista.size() > 1) {
                lista.sort(Comparator.comparing(SuscripcionProveedor::getId));
                for (int k = 1; k < lista.size(); k++) {
                    suscripcionRepository.delete(lista.get(k));
                }
            } else if (lista.isEmpty()) {
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
