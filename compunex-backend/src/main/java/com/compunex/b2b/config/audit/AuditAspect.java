package com.compunex.b2b.config.audit;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Arrays;
import java.util.stream.Collectors;

/**
 * Aspecto AOP transversal para auditoría estructurada de operaciones críticas ([AUDIT_LOG]).
 */
@Aspect
@Component
@Slf4j
public class AuditAspect {

    @Around("@annotation(auditable)")
    public Object auditarOperacion(ProceedingJoinPoint joinPoint, Auditable auditable) throws Throwable {
        Instant timestamp = Instant.now();
        long startNanos = System.nanoTime();
        String usuario = resolverUsuarioAutenticado();
        String ipOrigen = resolverIpOrigen();
        String metodo = joinPoint.getSignature().toShortString();
        String accion = auditable.accion().isBlank() ? joinPoint.getSignature().getName() : auditable.accion();
        String parametros = sanitizarParametros(joinPoint.getArgs());

        String resultado = "OK";
        try {
            Object retorno = joinPoint.proceed();
            return retorno;
        } catch (Throwable ex) {
            resultado = "ERROR(" + ex.getClass().getSimpleName() + ": " + ex.getMessage() + ")";
            throw ex;
        } finally {
            long duracionMs = (System.nanoTime() - startNanos) / 1_000_000L;
            log.info("[AUDIT_LOG] timestamp={} ip={} usuario={} accion={} metodo={} params={} resultado={} duracionMs={}",
                    timestamp, ipOrigen, usuario, accion, metodo, parametros, resultado, duracionMs);
        }
    }

    private String resolverUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return "ANONYMOUS";
        }
        return auth.getName();
    }

    private String resolverIpOrigen() {
        if (!(RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attrs)) {
            return "INTERNAL";
        }
        HttpServletRequest request = attrs.getRequest();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "UNKNOWN";
    }

    private String sanitizarParametros(Object[] args) {
        if (args == null || args.length == 0) {
            return "[]";
        }
        return Arrays.stream(args)
                .map(arg -> {
                    if (arg == null) {
                        return "null";
                    }
                    String str = String.valueOf(arg);
                    // Enmascarar posibles contraseñas o secretos en DTOs toString()
                    return str.replaceAll("(?i)(contrasena|password|secret|token)=([^,\\)\\]]+)", "$1=***");
                })
                .collect(Collectors.joining(", ", "[", "]"));
    }
}
