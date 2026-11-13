package com.compunex.b2b.modules.catalogo.dto.response;

import com.compunex.b2b.modules.catalogo.entity.Producto;
import org.springframework.data.domain.Page;

import java.util.List;

public record ProductoPaginadoResponseDTO(
        List<ProductoResumenResponseDTO> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas,
        boolean esUltima
) {
    public static ProductoPaginadoResponseDTO from(Page<Producto> pagina) {
        Page<ProductoResumenResponseDTO> paginaDto = pagina.map(ProductoResumenResponseDTO::from);
        return new ProductoPaginadoResponseDTO(
                paginaDto.getContent(),
                paginaDto.getNumber(),
                paginaDto.getSize(),
                paginaDto.getTotalElements(),
                paginaDto.getTotalPages(),
                paginaDto.isLast()
        );
    }
}
