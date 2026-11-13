package com.compunex.b2b.modules.auth.service;

import com.compunex.b2b.modules.auth.dto.request.RegistroProveedorRequestDTO;
import com.compunex.b2b.modules.auth.entity.Usuario;
import com.compunex.b2b.modules.auth.repository.UsuarioRepository;
import com.compunex.b2b.modules.auth.service.impl.RegistroCorporativoServiceImpl;
import com.compunex.b2b.modules.perfiles.entity.PerfilProveedor;
import com.compunex.b2b.modules.perfiles.repository.PerfilProveedorRepository;
import com.compunex.b2b.security.JwtTokenProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RegistroCorporativoServiceTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private PerfilProveedorRepository perfilProveedorRepository;

    @InjectMocks
    private RegistroCorporativoServiceImpl registroCorporativoService;

    @Test
    @DisplayName("[0.4] debeRegistrarProveedorExitosamenteConPerfilYToken")
    void debeRegistrarProveedorExitosamenteConPerfilYToken() {
        var request = new RegistroProveedorRequestDTO(
                "Juan Carlos Rivera",
                "contacto@innovapc.com",
                "InnovaPass2026!",
                "20712345678",
                "Innova PC Mayoristas S.A.C.",
                "Innova PC Wholesale",
                "+51 987 111 222",
                "Lima",
                "Av. Garcilaso de la Vega 1348, Int. 201",
                "5 años",
                "Especialistas en componentes informáticos."
        );

        when(usuarioRepository.existsByCorreo("contacto@innovapc.com")).thenReturn(false);
        when(perfilProveedorRepository.existsByIdentificacionFiscal("20712345678")).thenReturn(false);
        when(passwordEncoder.encode("InnovaPass2026!")).thenReturn("hashPasswordBcrypt");

        when(usuarioRepository.save(any(Usuario.class)))
                .thenAnswer(inv -> {
                    Usuario u = inv.getArgument(0);
                    u.setId(2L);
                    return u;
                });

        when(perfilProveedorRepository.save(any(PerfilProveedor.class)))
                .thenAnswer(inv -> {
                    PerfilProveedor p = inv.getArgument(0);
                    p.setId(5L);
                    return p;
                });

        when(jwtTokenProvider.generarTokenConRol("contacto@innovapc.com", "PROVEEDOR"))
                .thenReturn("mocked.jwt.token.provider");

        var response = registroCorporativoService.registrarProveedor(request);

        assertNotNull(response);
        assertEquals(2L, response.usuarioId());
        assertEquals(5L, response.proveedorId());
        assertEquals("contacto@innovapc.com", response.correo());
        assertEquals("PROVEEDOR", response.rol());
        assertEquals("20712345678", response.ruc());
        assertEquals("Innova PC Mayoristas S.A.C.", response.razonSocial());
        assertEquals("mocked.jwt.token.provider", response.token());
        assertEquals("Bearer", response.tipoToken());
        assertEquals(86400L, response.expiraEnSegundos());
        assertNotNull(response.mensaje());

        verify(usuarioRepository, times(1)).save(any());
        verify(perfilProveedorRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("[0.4] debeRechazarRegistroCuandoCorreoYaExiste")
    void debeRechazarRegistroCuandoCorreoYaExiste() {
        var request = new RegistroProveedorRequestDTO(
                "Juan Carlos", "ventas.mayoristas@technova.com", "Password123!",
                "20712345678", "Tech S.A.C.", "Tech", "+51 987 111 222", "Lima", "Av 123", "2 años", "Desc");

        when(usuarioRepository.existsByCorreo("ventas.mayoristas@technova.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> registroCorporativoService.registrarProveedor(request));
        verify(usuarioRepository, never()).save(any());
        verify(perfilProveedorRepository, never()).save(any());
    }

    @Test
    @DisplayName("[0.4] debeRechazarRegistroCuandoRucYaExiste")
    void debeRechazarRegistroCuandoRucYaExiste() {
        var request = new RegistroProveedorRequestDTO(
                "Juan Carlos", "nuevo@empresa.com", "Password123!",
                "20608945612", "Tech S.A.C.", "Tech", "+51 987 111 222", "Lima", "Av 123", "2 años", "Desc");

        when(usuarioRepository.existsByCorreo("nuevo@empresa.com")).thenReturn(false);
        when(perfilProveedorRepository.existsByIdentificacionFiscal("20608945612")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> registroCorporativoService.registrarProveedor(request));
        verify(usuarioRepository, never()).save(any());
        verify(perfilProveedorRepository, never()).save(any());
    }
}
