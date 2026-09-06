package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.dto.response.CambioEstadoResponseDTO;
import com.compunex.b2b.modules.catalogo.dto.response.ProductoDetalleResponseDTO;
import com.compunex.b2b.modules.catalogo.entity.Categoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoCategoria;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.ImagenProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.entity.ProductoEspecificacion;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.service.impl.ProductoServiceImpl;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PerfilProveedorRepository perfilProveedorRepository;

    @Mock
    private ProductoRepository productoRepository;

    @InjectMocks
    private ProductoServiceImpl productoService;

    @Test
    @DisplayName("[2.6] debeEjecutarEliminacionLogicaSinBorrarRegistroFisico")
    void debeEjecutarEliminacionLogicaSinBorrarRegistroFisico() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);
        var perfil = new PerfilProveedor();
        perfil.setId(10L);
        var producto = new Producto();
        producto.setId(5L);
        producto.setEstado(EstadoProducto.ACTIVO);

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(5L, 10L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenAnswer(i -> i.getArgument(0));

        productoService.eliminarMiProducto(correo, 5L);

        assertEquals(EstadoProducto.ELIMINADO_LOGICO, producto.getEstado());
        assertNotNull(producto.getFechaEliminacion());
        verify(productoRepository, times(1)).save(producto);
        verify(productoRepository, never()).delete(any());
    }

    @Test
    @DisplayName("[2.6] debeLanzar404CuandoProductoNoEsDelProveedor")
    void debeLanzar404CuandoProductoNoEsDelProveedor() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);
        var perfil = new PerfilProveedor();
        perfil.setId(10L);

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(99L, 10L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> productoService.eliminarMiProducto(correo, 99L));
        verify(productoRepository, never()).delete(any());
    }

    @Test
    @DisplayName("[2.2] debeRetornarFichaTecnicaCompletaConEspecificacionesEImagenes")
    void debeRetornarFichaTecnicaCompletaConEspecificacionesEImagenes() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);

        var perfil = new PerfilProveedor();
        perfil.setId(10L);
        perfil.setRazonSocial("TechNova Mayorista S.A.C.");

        var categoria = new Categoria("ram", "Memorias RAM", null, null, EstadoCategoria.ACTIVA, 0);

        var producto = new Producto();
        producto.setId(5L);
        producto.setProveedor(perfil);
        producto.setCategoria(categoria);
        producto.setTitulo("Memoria RAM Kingston Fury Beast 16GB DDR5 5600MHz");
        producto.setEstado(EstadoProducto.ACTIVO);
        producto.setEspecificaciones(List.of(new ProductoEspecificacion(producto, "Capacidad", "16 GB")));
        producto.setImagenes(List.of(new ImagenProducto(producto, "https://img.compunex.com/products/ram.jpg", (short) 1)));

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(5L, 10L)).thenReturn(Optional.of(producto));

        ProductoDetalleResponseDTO resultado = productoService.obtenerFichaTecnica(correo, 5L);

        assertEquals(5L, resultado.id());
        assertEquals("Memoria RAM Kingston Fury Beast 16GB DDR5 5600MHz", resultado.titulo());
        assertEquals("TechNova Mayorista S.A.C.", resultado.proveedorRazonSocial());
        assertEquals(1, resultado.especificaciones().size());
        assertEquals("Capacidad", resultado.especificaciones().get(0).clave());
        assertEquals(1, resultado.imagenes().size());
        assertEquals("https://img.compunex.com/products/ram.jpg", resultado.imagenes().get(0).urlImagen());
    }

    @Test
    @DisplayName("[2.2] debeLanzar404CuandoProductoNoExisteAlConsultarFichaTecnica")
    void debeLanzar404CuandoProductoNoExisteAlConsultarFichaTecnica() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);
        var perfil = new PerfilProveedor();
        perfil.setId(10L);

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(99L, 10L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> productoService.obtenerFichaTecnica(correo, 99L));
    }

    @Test
    @DisplayName("[2.5] debeCambiarEstadoDePublicacionDelProducto")
    void debeCambiarEstadoDePublicacionDelProducto() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);
        var perfil = new PerfilProveedor();
        perfil.setId(10L);
        var producto = new Producto();
        producto.setId(5L);
        producto.setEstado(EstadoProducto.ACTIVO);

        var request = new CambiarEstadoProductoDTO(EstadoProducto.DESHABILITADO_POR_PROVEEDOR);

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(5L, 10L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenAnswer(i -> i.getArgument(0));

        CambioEstadoResponseDTO resultado = productoService.cambiarEstadoPublicacion(correo, 5L, request);

        assertEquals("ACTIVO", resultado.estadoAnterior());
        assertEquals("DESHABILITADO_POR_PROVEEDOR", resultado.nuevoEstado());
        assertEquals(EstadoProducto.DESHABILITADO_POR_PROVEEDOR, producto.getEstado());
        verify(productoRepository, times(1)).save(producto);
    }

    @Test
    @DisplayName("[2.5] debeLanzar404CuandoProductoNoEsDelProveedorAlCambiarEstado")
    void debeLanzar404CuandoProductoNoEsDelProveedorAlCambiarEstado() {
        String correo = "ventas.mayoristas@technova.com";
        var usuario = new Usuario("TechNova", correo, "hash", RolUsuario.PROVEEDOR, EstadoUsuario.ACTIVO);
        usuario.setId(1L);
        var perfil = new PerfilProveedor();
        perfil.setId(10L);
        var request = new CambiarEstadoProductoDTO(EstadoProducto.ACTIVO);

        when(usuarioRepository.findByCorreo(correo)).thenReturn(Optional.of(usuario));
        when(perfilProveedorRepository.findByUsuarioId(1L)).thenReturn(Optional.of(perfil));
        when(productoRepository.findByIdAndProveedorId(99L, 10L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class,
                () -> productoService.cambiarEstadoPublicacion(correo, 99L, request));
        verify(productoRepository, never()).save(any());
    }
}
