package com.compunex.b2b.modules.perfiles.service;

import com.compunex.b2b.modules.perfiles.dto.request.ActivarProveedorRequestDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ProveedorPerfilResponseDTO;

/**
 * Contrato de servicio para la gestión del perfil comercial de proveedores.
 */
public interface ProviderProfileService {

    ProveedorPerfilResponseDTO obtenerPerfilPorCorreo(String correo);

    ProveedorPerfilResponseDTO activarProveedor(String correo, ActivarProveedorRequestDTO request);
}
