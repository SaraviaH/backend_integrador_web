package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
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
}
