package com.compunex.b2b.modules.ordenes.entity;

import com.compunex.b2b.modules.auth.entity.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ordenes")
@Getter
@Setter
@NoArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, updatable = false)
    private UUID uuid = UUID.randomUUID();

    @Column(name = "codigo_orden", nullable = false, unique = true, length = 40)
    private String codigoOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comprador_id", nullable = false)
    private Usuario comprador;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoOrden estado = EstadoOrden.PENDIENTE;

    @Column(name = "monto_subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoSubtotal;

    @Column(name = "monto_igv", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoIgv;

    @Column(name = "monto_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "ruc_receptor", nullable = false, length = 20)
    private String rucReceptor;

    @Column(name = "razon_social_receptor", nullable = false, length = 200)
    private String razonSocialReceptor;

    @Column(name = "direccion_fiscal", nullable = false, length = 300)
    private String direccionFiscal;

    @Column(name = "tipo_comprobante", nullable = false, length = 20, columnDefinition = "varchar(20) default 'FACTURA'")
    private String tipoComprobante = "FACTURA";

    @Column(name = "metodo_pago_simulado", length = 40)
    private String metodoPagoSimulado = "TRANSFERENCIA_B2B";

    @Column(name = "moneda", nullable = false, length = 10, columnDefinition = "varchar(10) default 'PEN'")
    private String moneda = "PEN";

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private Instant fechaCreacion = Instant.now();

    @Column(name = "fecha_actualizacion", nullable = false)
    private Instant fechaActualizacion = Instant.now();

    @OneToMany(mappedBy = "orden", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private List<SubordenFactura> subordenes = new ArrayList<>();

    public void agregarSuborden(SubordenFactura suborden) {
        subordenes.add(suborden);
        suborden.setOrden(this);
    }
}
