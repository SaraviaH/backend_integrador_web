package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import org.springframework.data.domain.Pageable;

public interface ProductoService {

    ProductoPaginadoResponseDTO listarMisProductos(String correoAutenticado, Pageable pageable);

    ProductoDetalleResponseDTO obtenerFichaTecnica(String correoAutenticado, Long productoId);

    CambioEstadoResponseDTO cambiarEstadoPublicacion(String correoAutenticado, Long productoId,
                                                      CambiarEstadoProductoDTO request);

    void eliminarMiProducto(String correoAutenticado, Long productoId);
}
