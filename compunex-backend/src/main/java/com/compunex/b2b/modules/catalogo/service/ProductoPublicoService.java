package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.catalogo.dto.response.ProductoPublicoDetalleDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPublicoPaginadoResponseDTO;
import org.springframework.data.domain.Pageable;

/**
 * Consultas de lectura pública del catálogo B2B.
 */
public interface ProductoPublicoService {

    ProductoPublicoPaginadoResponseDTO listarProductosPublicos(String search, String categoryId, Pageable pageable);

    ProductoPublicoDetalleDTO obtenerProductoPublicoPorId(Long productoId);
}
