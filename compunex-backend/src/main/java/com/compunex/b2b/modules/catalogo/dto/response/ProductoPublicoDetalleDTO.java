package com.compunex.b2b.modules.catalogo.dto.response;

import com.compunex.b2b.modules.catalogo.entity.ImagenProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * DTO completo de ficha técnica pública de producto B2B alineado a CONTRATOS_JSON.
 */
public record ProductoPublicoDetalleDTO(
        Long id,
        UUID uuid,
        String categoriaId,
        String categoriaNombre,
        String titulo,
        String descripcion,
        String modeloComercial,
        String tipoFormato,
        String unidadesPorPaquete,
        String pedidoMinimo,
        BigDecimal precioUnitarioRef,
        BigDecimal precioTotalRef,
        String moneda,
        Integer stockDisponible,
        String terminosComerciales,
        String estado,
        List<EspecificacionDTO> especificaciones,
        List<ImagenDTO> imagenes,
        ProveedorPublicoDTO proveedor
) {
    public record EspecificacionDTO(Long id, String clave, String valor) {}

    public record ImagenDTO(Long id, String urlImagen, Short orden) {}

    public record ProveedorPublicoDTO(
            Long id,
            String razonSocial,
            String nombreComercial,
            String identificacionFiscal,
            String ciudad,
            String telefonoContacto,
            String correoContacto
    ) {}

    public static ProductoPublicoDetalleDTO from(Producto producto) {
        String categoriaId = producto.getCategoria() != null ? producto.getCategoria().getId() : null;
        String categoriaNombre = producto.getCategoria() != null ? producto.getCategoria().getNombre() : null;

        List<EspecificacionDTO> especificaciones = producto.getEspecificaciones() == null ? List.of()
                : producto.getEspecificaciones().stream()
                        .map(e -> new EspecificacionDTO(e.getId(), e.getClave(), e.getValor()))
                        .toList();

        List<ImagenDTO> imagenes = producto.getImagenes() == null ? List.of()
                : producto.getImagenes().stream()
                        .sorted(Comparator.comparing(ImagenProducto::getOrden))
                        .map(i -> new ImagenDTO(i.getId(), i.getUrlImagen(), i.getOrden()))
                        .toList();

        ProveedorPublicoDTO proveedorDto = null;
        if (producto.getProveedor() != null) {
            var p = producto.getProveedor();
            String correoContacto = p.getUsuario() != null ? p.getUsuario().getCorreo() : null;
            proveedorDto = new ProveedorPublicoDTO(
                    p.getId(),
                    p.getRazonSocial(),
                    p.getNombreComercial(),
                    p.getIdentificacionFiscal(),
                    p.getCiudad(),
                    p.getTelefonoContacto(),
                    correoContacto
            );
        }

        return new ProductoPublicoDetalleDTO(
                producto.getId(),
                producto.getUuid(),
                categoriaId,
                categoriaNombre,
                producto.getTitulo(),
                producto.getDescripcion(),
                producto.getModeloComercial() != null ? producto.getModeloComercial().name() : null,
                producto.getTipoFormato(),
                producto.getUnidadesPorPaquete(),
                producto.getPedidoMinimo(),
                producto.getPrecioUnitarioRef(),
                producto.getPrecioTotalRef(),
                producto.getMoneda(),
                producto.getStockDisponible(),
                producto.getTerminosComerciales(),
                producto.getEstado() != null ? producto.getEstado().name() : null,
                especificaciones,
                imagenes,
                proveedorDto
        );
    }
}
