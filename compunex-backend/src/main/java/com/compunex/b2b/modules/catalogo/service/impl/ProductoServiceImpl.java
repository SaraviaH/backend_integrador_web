package com.compunex.b2b.modules.catalogo.service.impl;

import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoPaginadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoResumenResponseDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.service.ProductoService;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@Transactional(readOnly = true)
public class ProductoServiceImpl implements ProductoService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;
    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(UsuarioRepository usuarioRepository,
                               PerfilProveedorRepository perfilProveedorRepository,
                               ProductoRepository productoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilProveedorRepository = perfilProveedorRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    public ProductoPaginadoResponseDTO listarMisProductos(String correoAutenticado, Pageable pageable) {
        var usuario = usuarioRepository.findByCorreo(correoAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correoAutenticado));

        var perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException("Perfil de proveedor no encontrado para el usuario: " + correoAutenticado));

        Page<Producto> pagina = productoRepository.findAllByProveedorIdAndEstadoNot(
                perfil.getId(),
                EstadoProducto.ELIMINADO_LOGICO,
                pageable
        );

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

    @Override
    public ProductoDetalleResponseDTO obtenerFichaTecnica(String correoAutenticado, Long productoId) {
        var usuario = usuarioRepository.findByCorreo(correoAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correoAutenticado));

        var perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException("Perfil de proveedor no encontrado para el usuario: " + correoAutenticado));

        var producto = productoRepository.findByIdAndProveedorId(productoId, perfil.getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + productoId));

        return ProductoDetalleResponseDTO.from(producto);
    }

    @Override
    @Transactional
    public CambioEstadoResponseDTO cambiarEstadoPublicacion(String correoAutenticado, Long productoId,
                                                             CambiarEstadoProductoDTO request) {
        var usuario = usuarioRepository.findByCorreo(correoAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correoAutenticado));

        var perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException("Perfil de proveedor no encontrado para el usuario: " + correoAutenticado));

        var producto = productoRepository.findByIdAndProveedorId(productoId, perfil.getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + productoId));

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
                construirMensajeCambioEstado(nuevoEstado),
                producto.getFechaActualizacion()
        );
    }

    private String construirMensajeCambioEstado(EstadoProducto nuevoEstado) {
        return switch (nuevoEstado) {
            case ACTIVO -> "El producto ha sido activado nuevamente en el catálogo mayorista";
            case DESHABILITADO_POR_PROVEEDOR -> "El producto ha sido deshabilitado del catálogo mayorista temporalmente";
            case OCULTO_POR_ADMIN -> "El producto ha sido ocultado por un administrador del sistema";
            case ELIMINADO_LOGICO -> "El producto ha sido eliminado del catálogo";
        };
    }

    @Override
    @Transactional
    public void eliminarMiProducto(String correoAutenticado, Long productoId) {
        var usuario = usuarioRepository.findByCorreo(correoAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correoAutenticado));

        var perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException("Perfil de proveedor no encontrado para el usuario: " + correoAutenticado));

        var producto = productoRepository.findByIdAndProveedorId(productoId, perfil.getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + productoId));

        producto.setEstado(EstadoProducto.ELIMINADO_LOGICO);
        producto.setFechaEliminacion(java.time.Instant.now());
        producto.setFechaActualizacion(java.time.Instant.now());
        productoRepository.save(producto);
    }
}
