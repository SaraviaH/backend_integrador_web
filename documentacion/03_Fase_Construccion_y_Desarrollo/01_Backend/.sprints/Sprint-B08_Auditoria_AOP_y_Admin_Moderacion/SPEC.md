# Sprint-B08 — Moderación Administrativa y Auditoría Transversal AOP

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`1540ed0`, segregado en `AdminProductoService` en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B07_Ventas_Proveedor_y_Despacho`

---

## 1. Objetivo del Sprint
Completar las capacidades de moderación y supervisión global del sistema para administradores (`ROLE_ADMIN`), permitiendo el filtrado de productos de todos los proveedores y la suspensión administrativa de ítems (`GET` y `PATCH` `/api/v1/admin/products/**`), e implementando un componente transversal de auditoría basado en Programación Orientada a Aspectos (`@Aspect` `AuditAspect`) para registrar trazas estructuradas de operaciones críticas.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 13: `GET /api/v1/admin/products?search=&page=0&size=10`
  * Endpoint 14: `PATCH /api/v1/admin/products/{id}/status`
* **Tablas de Base de Datos:** `productos`, `usuarios`, `perfiles_proveedor`.
* **Reglas de Negocio:**
  * `RN-001`: Acceso estricto restringido al rol `ROLE_ADMIN`.
  * `RN-003`: Moderación de estado sin eliminación física.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Moderación en `AdminProductoController.java` y `AdminProductoServiceImpl.java`
- [x] Endpoint `GET /api/v1/admin/products`: Lista paginada global que expone productos de todos los proveedores con búsqueda opcional (`ProductoPaginadoResponseDTO`).
- [x] Endpoint `PATCH /api/v1/admin/products/{id}/status`: Actualiza el estado de publicación mediante `AdminProductoServiceImpl.cambiarEstadoPublicacionAdmin`, anotado con `@Transactional` y `@Auditable(accion = "ADMIN_PRODUCT_MODERATION")`.

### 3.2. Aspecto de Auditoría Transversal (`AuditAspect.java`)
- [x] Creada anotación personalizada `@Auditable(accion = "...")`.
- [x] Implementado `@Aspect` en `com.compunex.b2b.config.audit`:
  * Intercepta métodos anotados con `@Auditable` (`AUTH_LOGIN`, `AUTH_REGISTER_COMPANY`, `ORDER_CHECKOUT_SPLIT`, `ADMIN_PRODUCT_MODERATION`).
  * Extrae timestamp, IP de origen, usuario autenticado, método ejecutado, parámetros, resultado y duración en milisegundos.
  * Emite log estructurado con prefijo `[AUDIT_LOG]`.

### 3.3. Pruebas de Seguridad y Auditoría
- [x] Tests en `AdminProductControllerTest`, `AdminProductoControllerTest`, `AdminProductoServiceTest` y `SecurityAuthorizationTest` verificando `403 Forbidden` para roles distintos de `ADMIN`.
- [x] Tests unitarios en `AuditAspectTest` validando ejecución en éxito y error.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] Rutas de administración bloqueadas al 100% para roles no autorizados.
- [x] La moderación de productos se refleja en la base de datos de inmediato.
- [x] El aspecto de auditoría registra las acciones estructuradas `[AUDIT_LOG]` en consola.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=AdminProductControllerTest,AdminProductoControllerTest,AdminProductoServiceTest,AuditAspectTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-09` | `RN-001`, `RN-003` | 13, 14 | `AdminProductoController.java`, `AdminProductoServiceImpl.java`, `AuditAspect.java`, `Auditable.java` |
