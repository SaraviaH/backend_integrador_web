package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import org.springframework.data.domain.Pageable;

/**
 * Operaciones administrativas globales de supervisión y moderación de catálogo.
 */
public interface AdminProductoService {

    ProductoPaginadoResponseDTO listarProductosAdmin(String search, Pageable pageable);

    CambioEstadoResponseDTO cambiarEstadoPublicacionAdmin(Long productoId, CambiarEstadoProductoDTO request);
}
