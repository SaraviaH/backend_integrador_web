package com.compunex.b2b.modules.catalogo.service.impl;

import com.compunex.b2b.config.audit.Auditable;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.service.AdminProductoService;
import com.compunex.b2b.modules.catalogo.service.support.ProductoEstadoHelper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementación de moderación administrativa global sobre productos.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProductoServiceImpl implements AdminProductoService {

    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public ProductoPaginadoResponseDTO listarProductosAdmin(String search, Pageable pageable) {
        Page<Producto> pagina = (search != null && !search.trim().isEmpty())
                ? productoRepository.buscarTodosPorTitulo(EstadoProducto.ELIMINADO_LOGICO, search.trim(), pageable)
                : productoRepository.findAllByEstadoNot(EstadoProducto.ELIMINADO_LOGICO, pageable);

        return ProductoPaginadoResponseDTO.from(pagina);
    }

    @Override
    @Transactional
    @Auditable(accion = "ADMIN_PRODUCT_MODERATION")
    public CambioEstadoResponseDTO cambiarEstadoPublicacionAdmin(Long productoId, CambiarEstadoProductoDTO request) {
        var producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + productoId));

        EstadoProducto estadoAnterior = producto.getEstado();
        EstadoProducto nuevoEstado = request.estado();
        Instant ahora = Instant.now();

        producto.setEstado(nuevoEstado);
        producto.setFechaActualizacion(ahora);
        registrarTrazabilidadModeracion(producto, nuevoEstado, ahora);
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

    private void registrarTrazabilidadModeracion(Producto producto, EstadoProducto nuevoEstado, Instant ahora) {
        if (nuevoEstado == EstadoProducto.OCULTO_POR_ADMIN || nuevoEstado == EstadoProducto.ELIMINADO_LOGICO) {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                usuarioRepository.findByCorreo(auth.getName())
                        .ifPresent(admin -> producto.setEliminadoPor(admin.getId()));
            }
            if (nuevoEstado == EstadoProducto.ELIMINADO_LOGICO && producto.getFechaEliminacion() == null) {
                producto.setFechaEliminacion(ahora);
            }
        } else if (nuevoEstado == EstadoProducto.ACTIVO) {
            producto.setEliminadoPor(null);
            producto.setFechaEliminacion(null);
        }
    }
}
