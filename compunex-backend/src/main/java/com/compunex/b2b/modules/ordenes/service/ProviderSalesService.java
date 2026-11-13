package com.compunex.b2b.modules.ordenes.service;

import com.compunex.b2b.modules.ordenes.dto.response.SubordenDetalleProveedorDTO;
import com.compunex.b2b.modules.ordenes.dto.response.VentaPaginadaResponseDTO;
import com.compunex.b2b.modules.ordenes.entity.EstadoSuborden;
import org.springframework.data.domain.Pageable;

/**
 * Contrato de servicio para ventas recibidas y despacho logístico de proveedores.
 */
public interface ProviderSalesService {

    VentaPaginadaResponseDTO obtenerMisVentas(String correoProveedor, Pageable pageable);

    SubordenDetalleProveedorDTO obtenerDetalleVenta(String correoProveedor, Long subordenId);

    SubordenDetalleProveedorDTO actualizarEstadoDespacho(String correoProveedor, Long subordenId, EstadoSuborden nuevoEstado);
}
