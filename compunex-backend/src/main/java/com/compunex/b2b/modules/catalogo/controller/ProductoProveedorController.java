package com.compunex.b2b.modules.catalogo.controller;

import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/providers/me/products")
public class ProductoProveedorController {

    private final ProductoService productoService;

    public ProductoProveedorController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<ProductoPaginadoResponseDTO> listarMisProductos(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String correoAutenticado = authentication.getName();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPublicacion"));
        ProductoPaginadoResponseDTO response = productoService.listarMisProductos(correoAutenticado, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetalleResponseDTO> obtenerFichaTecnica(
            Authentication authentication,
            @PathVariable Long id) {

        ProductoDetalleResponseDTO response = productoService.obtenerFichaTecnica(authentication.getName(), id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CambioEstadoResponseDTO> cambiarEstadoPublicacion(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CambiarEstadoProductoDTO request) {

        CambioEstadoResponseDTO response = productoService.cambiarEstadoPublicacion(authentication.getName(), id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMiProducto(Authentication authentication,
                                                   @PathVariable Long id) {
        productoService.eliminarMiProducto(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
