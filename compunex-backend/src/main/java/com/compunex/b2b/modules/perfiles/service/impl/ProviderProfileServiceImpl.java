package com.compunex.b2b.modules.perfiles.service.impl;

import com.compunex.b2b.exception.DuplicateResourceException;
import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.perfiles.dto.request.ActivarProveedorRequestDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ProveedorPerfilResponseDTO;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.modules.perfiles.service.ProviderProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

/**
 * Implementación del servicio de perfiles comerciales de proveedor.
 */
@Service
@RequiredArgsConstructor
public class ProviderProfileServiceImpl implements ProviderProfileService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;

    @Override
    @Transactional(readOnly = true)
    public ProveedorPerfilResponseDTO obtenerPerfilPorCorreo(String correo) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        PerfilProveedor perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Perfil de proveedor no encontrado"));

        return mapToResponse(usuario, perfil);
    }

    @Override
    @Transactional
    public ProveedorPerfilResponseDTO activarProveedor(String correo, ActivarProveedorRequestDTO request) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        perfilProveedorRepository.findByIdentificacionFiscal(request.getRuc())
                .ifPresent(existente -> {
                    if (!existente.getUsuario().getId().equals(usuario.getId())) {
                        throw new DuplicateResourceException("El RUC ya se encuentra registrado por otro proveedor");
                    }
                });

        usuario.setRol(RolUsuario.PROVEEDOR);
        usuarioRepository.save(usuario);

        PerfilProveedor perfil = perfilProveedorRepository.findByUsuarioId(usuario.getId())
                .orElseGet(PerfilProveedor::new);

        perfil.setUsuario(usuario);
        perfil.setIdentificacionFiscal(request.getRuc());
        perfil.setRazonSocial(request.getRazonSocial());
        perfil.setNombreComercial(request.getNombreComercial() != null && !request.getNombreComercial().isBlank()
                ? request.getNombreComercial()
                : request.getRazonSocial());
        perfil.setTelefonoContacto(request.getTelefonoContacto());
        perfil.setDireccion(request.getDireccion());
        perfil.setCiudad(request.getCiudad());
        perfil.setDescripcion(request.getDescripcion());
        perfil.setPoliticaComercial(request.getPoliticaComercial());
        perfil.setFechaActualizacion(Instant.now());

        perfil = perfilProveedorRepository.save(perfil);
        return mapToResponse(usuario, perfil);
    }

    private ProveedorPerfilResponseDTO mapToResponse(Usuario usuario, PerfilProveedor perfil) {
        return ProveedorPerfilResponseDTO.builder()
                .id(perfil.getId())
                .usuarioId(usuario.getId())
                .correo(usuario.getCorreo())
                .ruc(perfil.getIdentificacionFiscal())
                .razonSocial(perfil.getRazonSocial())
                .nombreComercial(perfil.getNombreComercial())
                .telefonoContacto(perfil.getTelefonoContacto())
                .direccion(perfil.getDireccion())
                .ciudad(perfil.getCiudad())
                .descripcion(perfil.getDescripcion())
                .politicaComercial(perfil.getPoliticaComercial())
                .calificacion(perfil.getCalificacion())
                .verificado(perfil.getVerificado())
                .destacado(perfil.getDestacado())
                .build();
    }
}
