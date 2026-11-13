# Sprint-B05 — Administración, Moderación y Auditoría

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-admin-moderation` hacia `develop`  
> **Dependencias Previas:** `Sprint-B04_Panel_Proveedor_y_Despacho`

---

## 1. Objetivo del Sprint
Implementar los servicios y endpoints exclusivos para administradores del sistema (`ROLE_ADMIN`), permitiendo la supervisión global de productos de todos los proveedores, la moderación y cambio de estados administrativos (`ACTIVO`, `INACTIVO`, `BLOQUEADO`), y un mecanismo transversal de auditoría (AOP / Interceptor) para trazar eventos críticos de seguridad y transacciones.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 13: `GET /api/v1/admin/products?search=&page=0&size=10`
  * Endpoint 14: `PATCH /api/v1/admin/products/{id}/status`
* **Tablas de Base de Datos:** `productos`, `usuarios`, `perfiles_proveedor`.
* **Reglas de Negocio:**
  * `RN-001`: Acceso estricto restringido al rol `ROLE_ADMIN`.
  * `RN-003`: Capacidad del administrador de suspender productos sin eliminarlos.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Endpoints de Moderación de Productos
- [ ] `GET /api/v1/admin/products`: Consulta global con filtros por nombre, proveedor, estado y paginación. A diferencia del catálogo público, incluye productos inactivos y datos fiscales del proveedor responsable.
- [ ] `PATCH /api/v1/admin/products/{id}/status`: Modificación del estado del producto por parte del administrador (motivo de moderación opcional).

### 3.2. Aspecto de Auditoría Transversal (AOP)
- [ ] Implementar `@Aspect` `AuditAspect.java` en paquete `config.audit`:
  * Intercepta métodos anotados con `@Auditable` (ej. login, checkout, cambio de estado de producto).
  * Registra en log estructurado (o tabla de auditoría): fecha/hora, usuario, dirección IP, acción ejecutada, entidad afectada y resultado.

### 3.3. Configuración de Seguridad para el Panel Admin
- [ ] Configurar en `SecurityConfig.java`:
  ```java
  .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
  ```
- [ ] Verificar que peticiones de usuarios `CLIENTE` o `PROVEEDOR` a `/api/v1/admin/**` reciban inmediatamente `403 Forbidden`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Solo usuarios con rol `ADMIN` pueden consultar y moderar productos globales.
- [ ] Intentos de acceso sin rol `ADMIN` son rechazados con `403 Forbidden`.
- [ ] La moderación de estado actualiza la entidad en base de datos de inmediato.
- [ ] Los eventos de moderación quedan registrados en los logs del servidor con formato trazable.

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas automatizadas de administración
cd compunex-backend
mvn test -Dtest=AdminProductControllerTest,SecurityRoleTest

# Prueba con curl
curl -X PATCH http://localhost:8080/api/v1/admin/products/1/status \
  -H "Authorization: Bearer <token_admin>" \
  -H "Content-Type: application/json" \
  -d '{"estado": "BLOQUEADO", "motivo": "Incumplimiento de ficha técnica"}'
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-09` (Moderación Admin) | `RN-001`, `RN-003` | 13, 14 | `AdminProductController.java`, `AuditAspect.java` |
