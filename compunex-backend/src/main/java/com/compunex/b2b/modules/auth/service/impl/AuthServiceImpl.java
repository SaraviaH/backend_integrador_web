package com.compunex.b2b.modules.auth.service.impl;

import com.compunex.b2b.modules.auth.dto.request.CambiarPasswordDTO;
import com.compunex.b2b.modules.auth.dto.request.LoginRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.AuthResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.CambioPasswordResponseDTO;
import com.compunex.b2b.modules.auth.dto.response.UsuarioSesionDTO;
import com.compunex.b2b.modules.auth.service.AuthService;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.auth.exception.ContrasenaActualIncorrectaException;
import com.compunex.b2b.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider,
                           UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        /*
         * =========================================================================
         * 🔴 REGISTRO HISTÓRICO - TDD FASE 1: RED (Fallo inicial obligatorio)
         * =========================================================================
         * En la Fase 1, este método lanzaba intencionalmente una excepción para
         * verificar que la prueba unitaria en AuthServiceTest fallara en rojo (Barra Roja):
         *
         * throw new UnsupportedOperationException("Fase 1 RED: Operación login no implementada aún");
         * =========================================================================
         */

        // 🟢 TDD FASE 2: GREEN - Implementación funcional que hace pasar la prueba en verde
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.correo(), request.contrasena())
        );

        String token = jwtTokenProvider.generarToken(authentication);

        return new AuthResponseDTO(token, "Bearer", 86400L);
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioSesionDTO obtenerSesion() {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        var usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
        return new UsuarioSesionDTO(usuario.getCorreo(), usuario.getNombre(), usuario.getRol().name(), true);
    }

    @Override
    @Transactional
    public CambioPasswordResponseDTO cambiarPassword(CambiarPasswordDTO request) {
        String correo = SecurityContextHolder.getContext().getAuthentication().getName();
        var usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
        if (!passwordEncoder.matches(request.contrasenaActual(), usuario.getHashContrasena())) {
            throw new ContrasenaActualIncorrectaException("La contraseña actual es incorrecta");
        }
        usuario.setHashContrasena(passwordEncoder.encode(request.nuevaContrasena()));
        usuario.setFechaActualizacion(Instant.now());
        usuarioRepository.save(usuario);
        return new CambioPasswordResponseDTO("Contraseña actualizada exitosamente", usuario.getFechaActualizacion());
    }
}
