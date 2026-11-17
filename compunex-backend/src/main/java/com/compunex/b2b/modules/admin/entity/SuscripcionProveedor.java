package com.compunex.b2b.modules.admin.entity;

import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Suscripción SaaS de un proveedor mayorista para acceder al módulo de Facturación Electrónica y beneficios B2B.
 */
@Entity
@Table(name = "suscripciones_proveedor")
@Getter
@Setter
@NoArgsConstructor
public class SuscripcionProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id", nullable = false)
    private PerfilProveedor proveedor;

    @Column(nullable = false, length = 40)
    private String plan = "PRO_FACTURACION"; // BASICO_CATALOGO | PRO_FACTURACION | ENTERPRISE_SUNAT

    @Column(name = "precio_mensual", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioMensual = new BigDecimal("149.00");

    @Column(nullable = false, length = 10)
    private String moneda = "PEN";

    @Column(nullable = false, length = 20)
    private String estado = "ACTIVA"; // ACTIVA | PRUEBA | VENCIDA | CANCELADA

    @Column(name = "incluye_facturacion_sunat", nullable = false)
    private boolean incluyeFacturacionSunat = true;

    @Column(name = "incluye_guia_remision", nullable = false)
    private boolean incluyeGuiaRemision = true;

    @Column(name = "fecha_inicio", nullable = false)
    private Instant fechaInicio = Instant.now();

    @Column(name = "fecha_vencimiento", nullable = false)
    private Instant fechaVencimiento = Instant.now().plus(30, ChronoUnit.DAYS);

    @Column(name = "fecha_actualizacion", nullable = false)
    private Instant fechaActualizacion = Instant.now();
}
