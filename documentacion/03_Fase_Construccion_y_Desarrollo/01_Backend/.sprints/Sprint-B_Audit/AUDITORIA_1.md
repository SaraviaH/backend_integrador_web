# AUDITORIA_1 — Quality Gate 1: Certificación del Backend Core (24 Endpoints)

> **Área / Track:** Backend Track (Spring Boot 3.2.0)  
> **Auditor Responsable:** Agente Auditor de Backend & Coordinador Macro  
> **Fecha de Evaluación:** Pendiente de Ejecución (Al culminar Sprint-B05)  
> **Resultado del Gate:** PENDIENTE (0 / 24 verificados)

---

## 1. Alcance de la Auditoría
Evaluación exhaustiva de la API REST de COMPUNEX B2B previo a autorizar la integración E2E con el frontend Angular real. Comprende la verificación de los 24 endpoints contra `CONTRATOS_JSON.md`, la integridad de las 10 tablas en MySQL 8.0, la ejecución del motor Split-Order ACID y la conformidad de las 8 reglas de negocio.

---

## 2. Checklist de Validación Estricta

### 2.1. Compilación y Calidad de Código
- [ ] Compilación limpia con Maven: `mvn clean test` sin fallas.
- [ ] Cero dependencias vulnerables reportadas.
- [ ] Manejo centralizado de excepciones con `@RestControllerAdvice` uniforme.
- [ ] Cero logs sensibles (no se imprimen contraseñas ni tokens en consola).

### 2.2. Cobertura de Endpoints (24 / 24)
- [ ] **Módulo Auth (7 endpoints):**
  * `POST /api/v1/auth/login` (200 OK con JWT, 401 si falla).
  * `POST /api/v1/auth/register` (201 Created con RUC validado).
  * `GET /api/v1/auth/me` (200 OK con perfil actual).
  * `PATCH /api/v1/auth/password` (200 OK actualiza hash BCrypt).
  * `POST /api/v1/auth/register-company` (201 Created).
  * `GET /api/v1/providers/me/profile` (200 OK).
  * `POST /api/v1/providers/me/activate` (200 OK).
- [ ] **Módulo Catálogo B2B (4 endpoints):**
  * `GET /api/v1/categories` (200 OK con subcategorías).
  * `GET /api/v1/categories/{id}` (200 OK / 404 Not Found).
  * `GET /api/v1/products` (200 OK paginado a 12 items).
  * `GET /api/v1/products/{id}` (200 OK con especificaciones e imágenes).
- [ ] **Módulo Pedidos y Split Order (3 endpoints):**
  * `POST /api/v1/orders/checkout` (201 Created, división atómica por proveedor).
  * `GET /api/v1/orders/me` (200 OK historial de compras).
  * `GET /api/v1/orders/me/{ordenId}` (200 OK con comprobantes simulados).
- [ ] **Módulo Proveedor y Despacho (8 endpoints):**
  * `GET /api/v1/providers/me/products` (200 OK solo catálogo propio).
  * `GET /api/v1/providers/me/products/{id}` (200 OK).
  * `POST /api/v1/providers/me/products` (201 Created).
  * `PUT /api/v1/providers/me/products/{id}` (200 OK).
  * `PATCH /api/v1/providers/me/products/{id}/status` (200 OK).
  * `DELETE /api/v1/providers/me/products/{id}` (200 OK con soft-delete verificado).
  * `GET /api/v1/providers/me/sales` (200 OK subórdenes asignadas).
  * `GET /api/v1/providers/me/sales/{subordenId}` (200 OK detalle de venta).
- [ ] **Módulo Administración (2 endpoints):**
  * `GET /api/v1/admin/products` (200 OK catálogo global).
  * `PATCH /api/v1/admin/products/{id}/status` (200 OK moderación).

### 2.3. Verificación de Reglas de Negocio en Base de Datos
- [ ] `RN-001`: Tokens inválidos o expirados retornan `401 Unauthorized`.
- [ ] `RN-002`: Intento de registrar RUC duplicado retorna `409 Conflict`.
- [ ] `RN-003`: `DELETE` de producto mantiene el registro en tabla con `fecha_eliminacion` asignada.
- [ ] `RN-005` y `RN-006`: Checkout genera 1 orden y N subórdenes con correlativo `F001-%08d` y desglose IGV 18%.
- [ ] `RN-007`: Intento de auto-compra es rechazado con `400 Bad Request`.
- [ ] `RN-008`: Recálculo de montos en backend es matemáticamente exacto.

---

## 3. Matriz de Resultados de Ejecución

| Módulo | Total Endpoints | Aprobados | Fallidos | Estado Gate |
| :--- | :---: | :---: | :---: | :---: |
| Autenticación y Perfiles | 7 | 0 | 0 | PENDIENTE |
| Catálogo y Productos Públicos | 4 | 0 | 0 | PENDIENTE |
| Pedidos y Split Order | 3 | 0 | 0 | PENDIENTE |
| Proveedores y Despacho | 8 | 0 | 0 | PENDIENTE |
| Administración y Auditoría | 2 | 0 | 0 | PENDIENTE |
| **TOTAL** | **24** | **0** | **0** | **PENDIENTE** |

---

## 4. Hallazgos y Bloqueos
* *Sin hallazgos registrados aún (auditoría pendiente de ejecución).*

---

## 5. Veredicto Final y Autorización de Pase
* **Estado:** `PENDIENTE DE EJECUCIÓN`
* **Criterio de Aprobación:** 24 endpoints verificados pasando exitosamente en la colección de Postman (`compunex_postman_collection.json`) y 0 fallas en tests de integración antes de habilitar el `Sprint-G_Final`.
