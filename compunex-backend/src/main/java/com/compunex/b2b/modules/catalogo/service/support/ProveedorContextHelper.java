package com.compunex.b2b.modules.catalogo.service.support;

import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.catalogo.entity.Producto;
import com.compunex.b2b.modules.catalogo.repository.ProductoRepository;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

/**
 * Resuelve el perfil comercial y la propiedad de productos del proveedor autenticado.
 */
@Component
@RequiredArgsConstructor
public class ProveedorContextHelper {

    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;
    private final ProductoRepository productoRepository;

    public PerfilProveedor obtenerPerfilPorCorreo(String correoAutenticado) {
        var usuario = usuarioRepository.findByCorreo(correoAutenticado)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correoAutenticado));

        return perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new EntityNotFoundException(
                        "Perfil de proveedor no encontrado para el usuario: " + correoAutenticado));
    }

    public Producto obtenerProductoDeProveedor(String correoAutenticado, Long productoId) {
        PerfilProveedor perfil = obtenerPerfilPorCorreo(correoAutenticado);
        return productoRepository.findByIdAndProveedorId(productoId, perfil.getId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado: " + productoId));
    }
}
