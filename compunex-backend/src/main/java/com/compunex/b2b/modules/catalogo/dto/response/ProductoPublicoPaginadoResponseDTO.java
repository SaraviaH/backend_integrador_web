package com.compunex.b2b.modules.catalogo.dto.response;

import java.util.List;

/**
 * DTO de respuesta paginada para la consulta pública de productos B2B.
 */
public record ProductoPublicoPaginadoResponseDTO(
        List<ProductoPublicoItemDTO> contenido,
        int pagina,
        int tamano,
        long totalElementos,
        int totalPaginas,
        boolean esUltima
) {}
