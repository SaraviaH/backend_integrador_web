package com.compunex.b2b.modules.catalogo.dto.response;

import com.compunex.b2b.modules.catalogo.entity.ImagenProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.UUID;

/**
 * DTO de ítem de producto en la búsqueda paginada del catálogo público B2B.
 */
public record ProductoPublicoItemDTO(
        Long id,
        UUID uuid,
        String titulo,
        String categoriaId,
        String categoriaNombre,
        String pedidoMinimo,
        BigDecimal precioUnitarioRef,
        String moneda,
        Integer stockDisponible,
        String urlImagenPrincipal,
        Long proveedorId,
        String proveedorNombreComercial
) {
    public static ProductoPublicoItemDTO from(Producto producto) {
        String urlImagenPrincipal = producto.getImagenes() == null ? null
                : producto.getImagenes().stream()
                        .sorted(Comparator.comparing(ImagenProducto::getOrden))
                        .map(ImagenProducto::getUrlImagen)
                        .findFirst()
                        .orElse(null);

        String categoriaId = producto.getCategoria() != null ? producto.getCategoria().getId() : null;
        String categoriaNombre = producto.getCategoria() != null ? producto.getCategoria().getNombre() : null;
        Long proveedorId = producto.getProveedor() != null ? producto.getProveedor().getId() : null;
        String proveedorNombreComercial = null;
        if (producto.getProveedor() != null) {
            proveedorNombreComercial = producto.getProveedor().getNombreComercial() != null
                    && !producto.getProveedor().getNombreComercial().isBlank()
                    ? producto.getProveedor().getNombreComercial()
                    : producto.getProveedor().getRazonSocial();
        }

        return new ProductoPublicoItemDTO(
                producto.getId(),
                producto.getUuid(),
                producto.getTitulo(),
                categoriaId,
                categoriaNombre,
                producto.getPedidoMinimo(),
                producto.getPrecioUnitarioRef(),
                producto.getMoneda(),
                producto.getStockDisponible(),
                urlImagenPrincipal,
                proveedorId,
                proveedorNombreComercial
        );
    }
}
