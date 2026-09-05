package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import org.springframework.data.domain.Pageable;

public interface ProductoService {

    ProductoPaginadoResponseDTO listarMisProductos(String correoAutenticado, Pageable pageable);

    void eliminarMiProducto(String correoAutenticado, Long productoId);
}
