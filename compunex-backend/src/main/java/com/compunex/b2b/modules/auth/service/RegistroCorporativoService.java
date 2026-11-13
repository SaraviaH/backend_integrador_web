package com.compunex.b2b.modules.auth.service;

import com.compunex.b2b.modules.auth.dto.request.RegistroEmpresaRequestDTO;
import com.compunex.b2b.modules.auth.dto.request.RegistroProveedorRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroEmpresaResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroProveedorResponseDTO;

/**
 * Servicio dedicado al alta corporativa de empresas compradoras y proveedores mayoristas.
 */
public interface RegistroCorporativoService {

    RegistroProveedorResponseDTO registrarProveedor(RegistroProveedorRequestDTO request);

    RegistroEmpresaResponseDTO registrarEmpresa(RegistroEmpresaRequestDTO request);
}
