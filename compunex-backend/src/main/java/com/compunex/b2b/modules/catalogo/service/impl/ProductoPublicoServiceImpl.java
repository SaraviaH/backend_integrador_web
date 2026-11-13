package com.compunex.b2b.modules.catalogo.service.impl;

import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPublicoDetalleDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPublicoItemDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPublicoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.repository.ProductoSpecification;
import com.compunex.b2b.modules.catalogo.service.ProductoPublicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación pública para búsqueda facetada y ficha técnica del catálogo B2B.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoPublicoServiceImpl implements ProductoPublicoService {

    private final ProductoRepository productoRepository;

    @Override
    public ProductoPublicoPaginadoResponseDTO listarProductosPublicos(String search, String categoryId, Pageable pageable) {
        Page<ProductoPublicoItemDTO> paginaDto = productoRepository
                .findAll(ProductoSpecification.filtroPublico(search, categoryId), pageable)
                .map(ProductoPublicoItemDTO::from);

        return new ProductoPublicoPaginadoResponseDTO(
                paginaDto.getContent(),
                paginaDto.getNumber(),
                paginaDto.getSize(),
                paginaDto.getTotalElements(),
                paginaDto.getTotalPages(),
                paginaDto.isLast()
        );
    }

    @Override
    public ProductoPublicoDetalleDTO obtenerProductoPublicoPorId(Long productoId) {
        var producto = productoRepository.findById(productoId)
                .filter(p -> p.getFechaEliminacion() == null && p.getEstado() == EstadoProducto.ACTIVO)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + productoId));
        return ProductoPublicoDetalleDTO.from(producto);
    }
}
