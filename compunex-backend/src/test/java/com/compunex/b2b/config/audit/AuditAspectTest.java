package com.compunex.b2b.config.audit;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.system.CapturedOutput;
import org.springframework.boot.test.system.OutputCaptureExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(OutputCaptureExtension.class)
class AuditAspectTest {

    private final AuditAspect auditAspect = new AuditAspect();

    @AfterEach
    void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void auditarOperacion_exitosa_emiteAuditLogYEnmascaraContrasena(CapturedOutput output) throws Throwable {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("admin@compunex.com", null, List.of())
        );

        ProceedingJoinPoint pjp = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class);
        when(signature.toShortString()).thenReturn("AuthServiceImpl.login(..)");
        when(signature.getName()).thenReturn("login");
        when(pjp.getSignature()).thenReturn(signature);
        when(pjp.getArgs()).thenReturn(new Object[]{"LoginRequest[correo=admin@compunex.com, contrasena=MiClaveSecreta]"});
        when(pjp.proceed()).thenReturn("TOKEN_OK");

        Auditable auditable = mock(Auditable.class);
        when(auditable.accion()).thenReturn("AUTH_LOGIN");

        Object result = auditAspect.auditarOperacion(pjp, auditable);

        assertThat(result).isEqualTo("TOKEN_OK");
        assertThat(output.getOut())
                .contains("[AUDIT_LOG]")
                .contains("usuario=admin@compunex.com")
                .contains("accion=AUTH_LOGIN")
                .contains("resultado=OK")
                .contains("contrasena=***")
                .doesNotContain("MiClaveSecreta");
    }

    @Test
    void auditarOperacion_conExcepcion_registraErrorYPropagaExcepcion(CapturedOutput output) throws Throwable {
        ProceedingJoinPoint pjp = mock(ProceedingJoinPoint.class);
        Signature signature = mock(Signature.class);
        when(signature.toShortString()).thenReturn("OrderServiceImpl.procesarCheckout(..)");
        when(signature.getName()).thenReturn("procesarCheckout");
        when(pjp.getSignature()).thenReturn(signature);
        when(pjp.getArgs()).thenReturn(new Object[]{});
        when(pjp.proceed()).thenThrow(new IllegalStateException("Stock agotado"));

        Auditable auditable = mock(Auditable.class);
        when(auditable.accion()).thenReturn("ORDER_CHECKOUT_SPLIT");

        assertThatThrownBy(() -> auditAspect.auditarOperacion(pjp, auditable))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("Stock agotado");

        assertThat(output.getOut())
                .contains("[AUDIT_LOG]")
                .contains("usuario=ANONYMOUS")
                .contains("accion=ORDER_CHECKOUT_SPLIT")
                .contains("resultado=ERROR(IllegalStateException: Stock agotado)");
    }
}
