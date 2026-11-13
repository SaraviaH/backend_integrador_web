package com.compunex.b2b.modules.catalogo.service.support;

import com.compunex.b2b.modules.catalogo.entity.EstadoProducto;

/**
 * Utilidad compartida para mensajes uniformes en transiciones de estado de productos.
 */
public final class ProductoEstadoHelper {

    private ProductoEstadoHelper() {
    }

    public static String construirMensajeCambioEstado(EstadoProducto nuevoEstado) {
        return switch (nuevoEstado) {
            case ACTIVO -> "El producto ha sido activado nuevamente en el catálogo mayorista";
            case DESHABILITADO_POR_PROVEEDOR -> "El producto ha sido deshabilitado del catálogo mayorista temporalmente";
            case OCULTO_POR_ADMIN -> "El producto ha sido ocultado por un administrador del sistema";
            case ELIMINADO_LOGICO -> "El producto ha sido eliminado del catálogo";
        };
    }
}
