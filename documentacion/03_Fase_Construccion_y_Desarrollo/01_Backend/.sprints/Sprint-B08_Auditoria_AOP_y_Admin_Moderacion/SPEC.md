# Sprint-B08 — Moderación Administrativa y Auditoría Transversal AOP

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-admin-audit-aop` hacia `develop`  
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

### 3.1. Moderación en `AdminProductoController.java`
- [ ] Endpoint `GET /api/v1/admin/products`: Lista paginada que expone productos de todos los proveedores, incluyendo datos fiscales de la empresa responsable y su estado administrativo.
- [ ] Endpoint `PATCH /api/v1/admin/products/{id}/status`: Actualiza el estado (`ACTIVO`, `INACTIVO`, `BLOQUEADO`) y registra el usuario administrador que realizó el cambio en `eliminado_por` / `modificado_por`.

### 3.2. Aspecto de Auditoría Transversal (`AuditAspect.java`)
- [ ] Crear anotación personalizada `@Auditable(accion = "...")`.
- [ ] Implementar `@Aspect` en paquete `config.audit`:
  * Intercepta métodos anotados con `@Auditable` (ej. login, checkout, moderación de producto).
  * Extrae timestamp, IP de origen, usuario autenticado, método ejecutado, parámetros y resultado.
  * Emite log estructurado con prefijo `[AUDIT_LOG]`.

### 3.3. Pruebas de Seguridad y Auditoría
- [ ] Tests que verifiquen que usuarios sin rol `ADMIN` reciben `403 Forbidden` al invocar `/api/v1/admin/**`.
- [ ] Tests unitarios que verifiquen la ejecución del aspecto ante llamadas anotadas.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Rutas de administración bloqueadas al 100% para roles no autorizados.
- [ ] La moderación de productos se refleja en la base de datos de inmediato.
- [ ] El aspecto de auditoría registra las acciones en consola sin añadir latencia perceptible.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=AdminProductControllerTest,AuditAspectTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-09` | `RN-001`, `RN-003` | 13, 14 | `AdminProductoController.java`, `AuditAspect.java` |
