package com.compunex.b2b.modules.perfiles.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO de salida con la información comercial pública y fiscal del proveedor.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorPerfilResponseDTO {
    private Long proveedorId;
    private Long usuarioId;
    private String identificacionFiscal;
    private String razonSocial;
    private String nombreComercial;
    private String telefonoContacto;
    private String correoContacto;
    private String direccion;
    private String ciudad;
    private String anosMercado;
    private String descripcion;
    private String politicaComercial;
    private BigDecimal calificacion;
    private Boolean verificado;
    private Boolean destacado;
}
