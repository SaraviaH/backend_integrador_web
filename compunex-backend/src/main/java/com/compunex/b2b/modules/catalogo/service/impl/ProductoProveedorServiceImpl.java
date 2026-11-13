package com.compunex.b2b.modules.catalogo.service.impl;

import com.compunex.b2b.modules.catalogo.dto.request.ActualizarProductoRequestDTO;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.request.CrearProductoRequestDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ActualizarProductoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CrearProductoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.ImagenProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.entity.ProductoEspecificacion;
import com.compunex.b2b.modules.catalogo.repository.CategoriaRepository;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.service.ProductoProveedorService;
import com.compunex.b2b.modules.catalogo.service.support.ProductoEstadoHelper;
import com.compunex.b2b.modules.catalogo.service.support.ProveedorContextHelper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Implementación del catálogo CRUD privado multi-tenant de proveedores.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductoProveedorServiceImpl implements ProductoProveedorService {

    private final ProveedorContextHelper proveedorContextHelper;
    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;

    @Override
    public ProductoPaginadoResponseDTO listarMisProductos(String correoAutenticado, String search, Pageable pageable) {
        var perfil = proveedorContextHelper.obtenerPerfilPorCorreo(correoAutenticado);

        Page<Producto> pagina = (search != null && !search.trim().isEmpty())
                ? productoRepository.buscarPorProveedorYTitulo(
                        perfil.getId(), EstadoProducto.ELIMINADO_LOGICO, search.trim(), pageable)
                : productoRepository.findAllByProveedorIdAndEstadoNot(
                        perfil.getId(), EstadoProducto.ELIMINADO_LOGICO, pageable);

        return ProductoPaginadoResponseDTO.from(pagina);
    }

    @Override
    public ProductoDetalleResponseDTO obtenerFichaTecnica(String correoAutenticado, Long productoId) {
        Producto producto = proveedorContextHelper.obtenerProductoDeProveedor(correoAutenticado, productoId);
        return ProductoDetalleResponseDTO.from(producto);
    }

    @Override
    @Transactional
    public CrearProductoResponseDTO crearProducto(String correoAutenticado, CrearProductoRequestDTO request) {
        var perfil = proveedorContextHelper.obtenerPerfilPorCorreo(correoAutenticado);
        var categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada: " + request.categoriaId()));

        Instant ahora = Instant.now();
        Producto producto = new Producto();
        producto.setProveedor(perfil);
        producto.setCategoria(categoria);
        producto.setTitulo(request.titulo());
        producto.setDescripcion(request.descripcion());
        producto.setModeloComercial(request.modeloComercial());
        producto.setTipoFormato(request.tipoFormato());
        producto.setUnidadesPorPaquete(request.unidadesPorPaquete());
        producto.setPedidoMinimo(request.pedidoMinimo());
        producto.setPrecioUnitarioRef(request.precioUnitarioRef());
        producto.setPrecioTotalRef(request.precioTotalRef() != null ? request.precioTotalRef() : request.precioUnitarioRef());
        producto.setMoneda(request.moneda() != null && !request.moneda().isBlank() ? request.moneda() : "USD");
        producto.setTerminosComerciales(request.terminosComerciales());
        producto.setEstado(EstadoProducto.ACTIVO);
        producto.setEsRecomendado(false);
        producto.setEsPromocionado(false);
        producto.setTieneOferta(false);
        producto.setFechaPublicacion(ahora);
        producto.setFechaActualizacion(ahora);

        reemplazarEspecificaciones(producto, request.especificaciones());
        reemplazarImagenes(producto, request.imagenes());

        categoria.setTotalProductos((categoria.getTotalProductos() != null ? categoria.getTotalProductos() : 0) + 1);
        categoriaRepository.save(categoria);

        return CrearProductoResponseDTO.from(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public ActualizarProductoResponseDTO actualizarProducto(String correoAutenticado, Long productoId, ActualizarProductoRequestDTO request) {
        Producto producto = proveedorContextHelper.obtenerProductoDeProveedor(correoAutenticado, productoId);

        if (request.categoriaId() != null && !request.categoriaId().isBlank()) {
            var nuevaCategoria = categoriaRepository.findById(request.categoriaId())
                    .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada: " + request.categoriaId()));
            producto.setCategoria(nuevaCategoria);
        }

        aplicarCamposActualizables(producto, request);
        if (request.especificaciones() != null) {
            reemplazarEspecificaciones(producto, request.especificaciones());
        }
        if (request.imagenes() != null) {
            reemplazarImagenes(producto, request.imagenes());
        }

        producto.setFechaActualizacion(Instant.now());
        return ActualizarProductoResponseDTO.from(productoRepository.save(producto));
    }

    @Override
    @Transactional
    public CambioEstadoResponseDTO cambiarEstadoPublicacion(String correoAutenticado, Long productoId, CambiarEstadoProductoDTO request) {
        Producto producto = proveedorContextHelper.obtenerProductoDeProveedor(correoAutenticado, productoId);
        EstadoProducto estadoAnterior = producto.getEstado();
        EstadoProducto nuevoEstado = request.estado();

        producto.setEstado(nuevoEstado);
        producto.setFechaActualizacion(Instant.now());
        productoRepository.save(producto);

        return new CambioEstadoResponseDTO(
                producto.getId(),
                producto.getUuid(),
                estadoAnterior.name(),
                nuevoEstado.name(),
                ProductoEstadoHelper.construirMensajeCambioEstado(nuevoEstado),
                producto.getFechaActualizacion()
        );
    }

    @Override
    @Transactional
    public void eliminarMiProducto(String correoAutenticado, Long productoId) {
        Producto producto = proveedorContextHelper.obtenerProductoDeProveedor(correoAutenticado, productoId);
        Instant ahora = Instant.now();
        producto.setEstado(EstadoProducto.ELIMINADO_LOGICO);
        producto.setFechaEliminacion(ahora);
        producto.setFechaActualizacion(ahora);
        productoRepository.save(producto);
    }

    private void aplicarCamposActualizables(Producto producto, ActualizarProductoRequestDTO request) {
        if (request.titulo() != null) producto.setTitulo(request.titulo());
        if (request.descripcion() != null) producto.setDescripcion(request.descripcion());
        if (request.modeloComercial() != null) producto.setModeloComercial(request.modeloComercial());
        if (request.tipoFormato() != null) producto.setTipoFormato(request.tipoFormato());
        if (request.unidadesPorPaquete() != null) producto.setUnidadesPorPaquete(request.unidadesPorPaquete());
        if (request.pedidoMinimo() != null) producto.setPedidoMinimo(request.pedidoMinimo());
        if (request.precioUnitarioRef() != null) producto.setPrecioUnitarioRef(request.precioUnitarioRef());
        if (request.precioTotalRef() != null) producto.setPrecioTotalRef(request.precioTotalRef());
        if (request.moneda() != null && !request.moneda().isBlank()) producto.setMoneda(request.moneda());
        if (request.terminosComerciales() != null) producto.setTerminosComerciales(request.terminosComerciales());
    }

    private void reemplazarEspecificaciones(Producto producto, List<CrearProductoRequestDTO.EspecificacionItemDTO> items) {
        producto.getEspecificaciones().clear();
        if (items != null && !items.isEmpty()) {
            items.forEach(dto -> producto.getEspecificaciones()
                    .add(new ProductoEspecificacion(producto, dto.clave(), dto.valor())));
        }
    }

    private void reemplazarImagenes(Producto producto, List<CrearProductoRequestDTO.ImagenItemDTO> items) {
        producto.getImagenes().clear();
        if (items != null && !items.isEmpty()) {
            short ordenFallback = 1;
            for (var imgDto : items) {
                short orden = imgDto.orden() != null ? imgDto.orden() : ordenFallback++;
                producto.getImagenes().add(new ImagenProducto(producto, imgDto.urlImagen(), orden));
            }
        }
    }
}
