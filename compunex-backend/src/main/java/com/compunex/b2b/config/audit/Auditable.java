package com.compunex.b2b.config.audit;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Marca un método de negocio crítico para ser auditado transversalmente por {@link AuditAspect}.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {

    /**
     * Identificador legible de la acción de negocio auditada (ej. AUTH_LOGIN, ORDER_CHECKOUT_SPLIT).
     */
    String accion() default "";
}
