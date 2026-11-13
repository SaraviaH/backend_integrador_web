package com.compunex.b2b.modules.perfiles.service.impl;

import com.compunex.b2b.exception.DuplicateResourceException;
import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.perfiles.dto.request.ActivarProveedorRequestDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ActivarProveedorResponseDTO;
import com.compunex.b2b.modules.perfiles.dto.response.ProveedorPerfilResponseDTO;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.modules.perfiles.service.ProviderProfileService;
import com.compunex.b2b.security.JwtTokenProvider;
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
    private final JwtTokenProvider jwtTokenProvider;

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
    public ActivarProveedorResponseDTO activarProveedor(String correo, ActivarProveedorRequestDTO request) {
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
        if (request.getAnosMercado() != null && !request.getAnosMercado().isBlank()) {
            perfil.setAnosMercado(request.getAnosMercado());
        } else if (perfil.getAnosMercado() == null || perfil.getAnosMercado().isBlank()) {
            perfil.setAnosMercado("0 años");
        }
        perfil.setDescripcion(request.getDescripcion());
        perfil.setPoliticaComercial(request.getPoliticaComercial());
        perfil.setFechaActualizacion(Instant.now());

        perfil = perfilProveedorRepository.save(perfil);
        String nuevoToken = jwtTokenProvider.generarTokenConRol(usuario.getCorreo(), RolUsuario.PROVEEDOR.name());

        return new ActivarProveedorResponseDTO(
                perfil.getId(),
                RolUsuario.PROVEEDOR.name(),
                nuevoToken,
                "Bearer",
                86400L,
                "Perfil de proveedor activado exitosamente. Utiliza el nuevo token para gestionar tu catálogo."
        );
    }

    private ProveedorPerfilResponseDTO mapToResponse(Usuario usuario, PerfilProveedor perfil) {
        return ProveedorPerfilResponseDTO.builder()
                .proveedorId(perfil.getId())
                .usuarioId(usuario.getId())
                .identificacionFiscal(perfil.getIdentificacionFiscal())
                .razonSocial(perfil.getRazonSocial())
                .nombreComercial(perfil.getNombreComercial())
                .telefonoContacto(perfil.getTelefonoContacto())
                .correoContacto(usuario.getCorreo())
                .direccion(perfil.getDireccion())
                .ciudad(perfil.getCiudad())
                .anosMercado(perfil.getAnosMercado())
                .descripcion(perfil.getDescripcion())
                .politicaComercial(perfil.getPoliticaComercial())
                .calificacion(perfil.getCalificacion())
                .verificado(perfil.getVerificado())
                .destacado(perfil.getDestacado())
                .build();
    }
}
