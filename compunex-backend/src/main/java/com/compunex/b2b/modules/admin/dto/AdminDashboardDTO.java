package com.compunex.b2b.modules.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class AdminDashboardDTO {
    // Indicadores de negocio y ventas
    private BigDecimal gmvTotal;
    private BigDecimal igvTotalRecaudado;
    private BigDecimal ticketPromedio;
    private long totalOrdenes;
    private long ordenesPagadas;
    private long ordenesProcesando;
    private long ordenesCanceladas;
    private long totalSubordenes;
    private double tasaEntregaPorcentaje;

    // Indicadores de tiempo logístico
    private double tiempoPromedioDespachoHoras;

    // Desglose y rankings
    private Map<String, Long> subordenesPorEstado;
    private Map<String, Long> ordenesPorMetodoPago;
    private List<TopProveedorDTO> topProveedores;

    // Comunidad y catálogo
    private long totalUsuarios;
    private long totalClientes;
    private long totalProveedores;
    private long proveedoresVerificados;
    private long totalProductos;
    private long productosActivos;
    private long productosOcultosAdmin;
    private long productosDeshabilitados;

    // Monetización SaaS (Suscripciones de Facturación)
    private BigDecimal mrrSuscripciones;
    private long suscripcionesActivas;
    private long proveedoresConFacturacion;

    @Data
    @Builder
    public static class TopProveedorDTO {
        private Long proveedorId;
        private String razonSocial;
        private String ruc;
        private long ventasCount;
        private BigDecimal montoTotal;
    }

    @Data
    @Builder
    public static class AdminProveedorItemDTO {
        private Long proveedorId;
        private String razonSocial;
        private String nombreComercial;
        private String ruc;
        private String ciudad;
        private boolean verificado;
        private boolean destacado;
        private long totalProductos;
        private Instant fechaCreacion;
    }

    @Data
    @Builder
    public static class AdminUsuarioItemDTO {
        private Long id;
        private String nombre;
        private String correo;
        private String rol;
        private String estado;
        private Instant fechaRegistro;
        private Instant ultimoAcceso;
    }

    @Data
    @Builder
    public static class AdminOrdenItemDTO {
        private Long ordenId;
        private String codigoOrden;
        private String compradorNombre;
        private String compradorRuc;
        private String metodoPago;
        private String codigoAutorizacionPago;
        private String estado;
        private BigDecimal montoTotal;
        private int cantidadSubordenes;
        private Instant fechaCreacion;
    }

    @Data
    @Builder
    public static class SuscripcionItemDTO {
        private Long id;
        private Long proveedorId;
        private String proveedorRazonSocial;
        private String proveedorRuc;
        private String plan;
        private BigDecimal precioMensual;
        private String moneda;
        private String estado;
        private boolean incluyeFacturacionSunat;
        private boolean incluyeGuiaRemision;
        private Instant fechaInicio;
        private Instant fechaVencimiento;
    }
}
