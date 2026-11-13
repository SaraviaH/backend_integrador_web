package com.compunex.b2b.modules.catalogo.service;

import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.dto.request.CambiarEstadoProductoDTO;
import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.catalogo.service.impl.AdminProductoServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminProductoServiceTest {

    @Mock
    private ProductoRepository productoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private AdminProductoServiceImpl adminProductoService;

    @Test
    @DisplayName("Admin: Debe listar productos de todos los proveedores sin filtro")
    void debeListarProductosParaAdminSinFiltro() {
        when(productoRepository.findAllByEstadoNot(eq(EstadoProducto.ELIMINADO_LOGICO), any()))
                .thenReturn(org.springframework.data.domain.Page.empty());

        var pageable = org.springframework.data.domain.PageRequest.of(0, 10);
        var resultado = adminProductoService.listarProductosAdmin(null, pageable);

        assertNotNull(resultado);
        verify(productoRepository, times(1)).findAllByEstadoNot(EstadoProducto.ELIMINADO_LOGICO, pageable);
    }

    @Test
    @DisplayName("Admin: Debe listar productos con búsqueda por título")
    void debeListarProductosParaAdminConFiltro() {
        when(productoRepository.buscarTodosPorTitulo(eq(EstadoProducto.ELIMINADO_LOGICO), eq("RTX"), any()))
                .thenReturn(org.springframework.data.domain.Page.empty());

        var pageable = org.springframework.data.domain.PageRequest.of(0, 10);
        var resultado = adminProductoService.listarProductosAdmin("RTX", pageable);

        assertNotNull(resultado);
        verify(productoRepository, times(1)).buscarTodosPorTitulo(EstadoProducto.ELIMINADO_LOGICO, "RTX", pageable);
    }

    @Test
    @DisplayName("Admin: Debe cambiar estado de cualquier producto sin restricción de proveedor")
    void debeCambiarEstadoPublicacionAdminExitosamente() {
        var producto = new Producto();
        producto.setId(5L);
        producto.setUuid(UUID.randomUUID());
        producto.setEstado(EstadoProducto.ACTIVO);

        when(productoRepository.findById(5L)).thenReturn(Optional.of(producto));
        when(productoRepository.save(any(Producto.class))).thenAnswer(i -> i.getArgument(0));

        var req = new CambiarEstadoProductoDTO(EstadoProducto.OCULTO_POR_ADMIN);
        var resultado = adminProductoService.cambiarEstadoPublicacionAdmin(5L, req);

        assertNotNull(resultado);
        assertEquals(5L, resultado.id());
        assertEquals("ACTIVO", resultado.estadoAnterior());
        assertEquals("OCULTO_POR_ADMIN", resultado.nuevoEstado());
        assertEquals(EstadoProducto.OCULTO_POR_ADMIN, producto.getEstado());
        verify(productoRepository, times(1)).save(producto);
    }
}
