package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador público para consulta del catálogo B2B y ficha técnica de productos.
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
@Tag(name = "10. Catálogo Público B2B", description = "Búsqueda paginada y ficha técnica pública de productos activos")
public class ProductoPublicoController {

    private final ProductoService productoService;

    @GetMapping
    @Operation(
            summary = "[18] Buscar productos públicos con paginación y filtros",
            description = "Retorna productos activos (no eliminados) filtrados por texto y/o categoría."
    )
    public ResponseEntity<ProductoPaginadoResponseDTO> listarProductosPublicos(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
        return ResponseEntity.ok(productoService.listarProductosPublicos(search, categoryId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "[19] Consultar ficha técnica pública de producto",
            description = "Retorna el detalle completo de un producto activo con sus especificaciones e imágenes."
    )
    public ResponseEntity<ProductoDetalleResponseDTO> obtenerProductoPublico(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.obtenerProductoPublicoPorId(id));
    }
}
