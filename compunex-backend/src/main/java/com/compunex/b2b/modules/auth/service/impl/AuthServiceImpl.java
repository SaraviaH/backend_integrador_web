package com.compunex.b2b.modules.auth.service.impl;

import com.compunex.b2b.modules.auth.dto.request.LoginRequestDTO;
import com.compunex.b2b.modules.auth.dto.response.AuthResponseDTO;
import com.compunex.b2b.modules.auth.service.AuthService;
import com.compunex.b2b.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthServiceImpl(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
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
}
