package com.compunex.b2b.modules.auth.service.impl;

import com.compunex.b2b.config.audit.Auditable;
import com.compunex.b2b.exception.DuplicateResourceException;
import com.compunex.b2b.modules.auth.dto.request.RegistroEmpresaRequestDTO;
import com.compunex.b2b.modules.auth.dto.request.RegistroProveedorRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroEmpresaResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.RegistroProveedorResponseDTO;
import com.compunex.b2b.modules.auth.entity.EstadoUsuario;
import com.compunex.b2b.modules.auth.entity.RolUsuario;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.auth.service.RegistroCorporativoService;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementación del onboarding corporativo de cuentas B2B (proveedores y empresas compradoras).
 */
@Service
@RequiredArgsConstructor
public class RegistroCorporativoServiceImpl implements RegistroCorporativoService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final PerfilProveedorRepository perfilProveedorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public RegistroProveedorResponseDTO registrarProveedor(RegistroProveedorRequestDTO request) {
        if (usuarioRepository.existsByCorreo(request.correo())) {
            throw new IllegalArgumentException("El correo electrónico ya se encuentra registrado: " + request.correo());
        }
        if (perfilProveedorRepository.existsByIdentificacionFiscal(request.ruc())) {
            throw new IllegalArgumentException("El RUC ya se encuentra registrado en la plataforma: " + request.ruc());
        }

        Usuario usuario = crearYGuardarUsuario(
                request.nombre(), request.correo(), request.contrasena(), RolUsuario.PROVEEDOR);

        PerfilProveedor perfil = construirPerfilBase(
                usuario,
                request.ruc(),
                request.razonSocial(),
                request.nombreComercial(),
                request.telefonoContacto(),
                request.direccion(),
                request.ciudad()
        );
        perfil.setAnosMercado(valorO(request.anosMercado(), "1 año"));
        perfil.setDescripcion(request.descripcion());
        perfil = perfilProveedorRepository.save(perfil);

        String token = jwtTokenProvider.generarTokenConRol(usuario.getCorreo(), RolUsuario.PROVEEDOR.name());

        return new RegistroProveedorResponseDTO(
                usuario.getId(),
                perfil.getId(),
                usuario.getUuid(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getRol().name(),
                perfil.getIdentificacionFiscal(),
                perfil.getRazonSocial(),
                token,
                "Bearer",
                86400L,
                "Proveedor registrado exitosamente en la plataforma COMPUNEX."
        );
    }

    @Override
    @Transactional
    @Auditable(accion = "AUTH_REGISTER_COMPANY")
    public RegistroEmpresaResponseDTO registrarEmpresa(RegistroEmpresaRequestDTO request) {
        if (usuarioRepository.existsByCorreo(request.getCorreo())) {
            throw new DuplicateResourceException("El correo ya se encuentra registrado");
        }
        if (perfilProveedorRepository.existsByIdentificacionFiscal(request.getRuc())) {
            throw new DuplicateResourceException("El RUC ya se encuentra registrado");
        }

        String nombreUsuario = valorO(request.getNombre(), request.getRazonSocial());
        Usuario usuario = crearYGuardarUsuario(
                nombreUsuario, request.getCorreo(), request.getContrasena(), RolUsuario.CLIENTE);

        PerfilProveedor perfil = construirPerfilBase(
                usuario,
                request.getRuc(),
                request.getRazonSocial(),
                request.getNombreComercial(),
                valorO(request.getTelefono(), "Por confirmar"),
                valorO(request.getDireccionFiscal(), "Por confirmar"),
                valorO(request.getCiudad(), "Lima")
        );
        perfil = perfilProveedorRepository.save(perfil);

        String token = jwtTokenProvider.generarTokenConRol(usuario.getCorreo(), RolUsuario.CLIENTE.name());

        return new RegistroEmpresaResponseDTO(
                usuario.getId(),
                usuario.getCorreo(),
                usuario.getNombre(),
                usuario.getRol().name(),
                false,
                perfil.getIdentificacionFiscal(),
                perfil.getRazonSocial(),
                token,
                "Bearer",
                86400L,
                "Empresa compradora registrada exitosamente en la plataforma COMPUNEX."
        );
    }

    private Usuario crearYGuardarUsuario(String nombre, String correo, String contrasenaPlana, RolUsuario rol) {
        Usuario usuario = new Usuario(
                nombre,
                correo,
                passwordEncoder.encode(contrasenaPlana),
                rol,
                EstadoUsuario.ACTIVO
        );
        return usuarioRepository.save(usuario);
    }

    private PerfilProveedor construirPerfilBase(
            Usuario usuario,
            String ruc,
            String razonSocial,
            String nombreComercial,
            String telefono,
            String direccion,
            String ciudad) {
        PerfilProveedor perfil = new PerfilProveedor();
        perfil.setUsuario(usuario);
        perfil.setIdentificacionFiscal(ruc);
        perfil.setRazonSocial(razonSocial);
        perfil.setNombreComercial(valorO(nombreComercial, razonSocial));
        perfil.setTelefonoContacto(telefono);
        perfil.setDireccion(direccion);
        perfil.setCiudad(ciudad);
        perfil.setVerificado(false);
        perfil.setDestacado(false);
        return perfil;
    }

    private String valorO(String valor, String fallback) {
        return (valor != null && !valor.isBlank()) ? valor : fallback;
    }
}
