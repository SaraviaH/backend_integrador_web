# AUDITORIA_1 — Quality Gate 1: Certificación del Backend Core (24 Endpoints en 8 Sprints)

> **Área / Track:** Backend Track (Spring Boot 3.2.0)  
> **Auditor Responsable:** Agente Auditor de Backend & Coordinador Macro  
> **Fecha de Evaluación:** Pendiente de Ejecución (Al culminar Sprint-B08)  
> **Resultado del Gate:** PENDIENTE (0 / 24 verificados)

---

## 1. Alcance de la Auditoría
Evaluación exhaustiva de la API REST de COMPUNEX B2B previo a autorizar la integración E2E con el frontend Angular real. Comprende la verificación de los 24 endpoints construidos y refactorizados a lo largo de los 8 sprints de backend (`Sprint-B01` a `Sprint-B08`), la integridad de las 10 tablas en MySQL 8.0, la ejecución del motor Split-Order ACID y la conformidad de las 8 reglas de negocio.

---

## 2. Checklist de Validación Estricta

### 2.1. Compilación y Calidad de Código
- [ ] Compilación limpia con Maven: `mvn clean test` sin fallas.
- [ ] Cero dependencias vulnerables reportadas.
- [ ] Manejo centralizado de excepciones con `GlobalExceptionHandler` uniforme.
- [ ] Aspecto de auditoría AOP activo trazando transacciones críticas.

### 2.2. Cobertura de Endpoints por Sprint (24 / 24)
- [ ] **Sprint-B01 (Base Existente Refactorizada - 14 endpoints):**
  * `POST /api/v1/auth/login` (1)
  * `POST /api/v1/auth/register` (2)
  * `GET /api/v1/auth/me` (3)
  * `PATCH /api/v1/auth/password` (4)
  * `GET /api/v1/categories` (5)
  * `GET /api/v1/categories/{id}` (6)
  * `GET /api/v1/providers/me/products` (7)
  * `GET /api/v1/providers/me/products/{id}` (8)
  * `POST /api/v1/providers/me/products` (9)
  * `PUT /api/v1/providers/me/products/{id}` (10)
  * `PATCH /api/v1/providers/me/products/{id}/status` (11)
  * `DELETE /api/v1/providers/me/products/{id}` (12 - Soft Delete)
  * `GET /api/v1/admin/products` (13)
  * `PATCH /api/v1/admin/products/{id}/status` (14)
- [ ] **Sprint-B02 (Auth Aditivo - 3 endpoints):**
  * `POST /api/v1/auth/register-company` (15)
  * `GET /api/v1/providers/me/profile` (16)
  * `POST /api/v1/providers/me/activate` (17)
- [ ] **Sprint-B03 (Catálogo Público B2B - 2 endpoints):**
  * `GET /api/v1/products` (18 - Paginado y facetado)
  * `GET /api/v1/products/{id}` (19 - Ficha detallada)
- [ ] **Sprint-B04 (Persistencia de Órdenes):** Entidades JPA `ordenes`, `subordenes_factura`, `orden_items`.
- [ ] **Sprint-B05 (Checkout Transaccional Split Order - 1 endpoint):**
  * `POST /api/v1/orders/checkout` (20 - Atomicidad ACID por proveedor)
- [ ] **Sprint-B06 (Historial de Compras - 2 endpoints):**
  * `GET /api/v1/orders/me` (21)
  * `GET /api/v1/orders/me/{ordenId}` (22 - Facturas simuladas correlativas `F001-XXXXX`)
- [ ] **Sprint-B07 (Ventas y Despacho de Proveedor - 2 endpoints):**
  * `GET /api/v1/providers/me/sales` (23)
  * `GET /api/v1/providers/me/sales/{subordenId}` (24)
- [ ] **Sprint-B08 (Auditoría AOP y Moderación):** Interceptor y aspect trazando eventos.

### 2.3. Verificación de Reglas de Negocio en Base de Datos
- [ ] `RN-001`: Tokens inválidos o expirados retornan `401 Unauthorized`.
- [ ] `RN-002`: Intento de registrar RUC duplicado retorna `409 Conflict`.
- [ ] `RN-003`: `DELETE` de producto mantiene el registro con `fecha_eliminacion` asignada (Soft Delete).
- [ ] `RN-004`: Precios en PEN y stock mayor a cero validados.
- [ ] `RN-005` y `RN-006`: Checkout genera 1 orden y N subórdenes con correlativo `F001-%08d` y desglose IGV 18%.
- [ ] `RN-007`: Intento de auto-compra es rechazado con `400 Bad Request`.
- [ ] `RN-008`: Recálculo de montos en backend es matemáticamente exacto.

---

## 3. Matriz de Resultados de Ejecución

| Sprint Backend | Endpoints Involucrados | Aprobados | Fallidos | Estado Gate |
| :--- | :---: | :---: | :---: | :---: |
| `Sprint-B01` | 1 a 6, 7 a 14 | 0 | 0 | PENDIENTE |
| `Sprint-B02` | 15, 16, 17 | 0 | 0 | PENDIENTE |
| `Sprint-B03` | 18, 19 | 0 | 0 | PENDIENTE |
| `Sprint-B04` | Persistencia DDL JPA | 0 | 0 | PENDIENTE |
| `Sprint-B05` | 20 | 0 | 0 | PENDIENTE |
| `Sprint-B06` | 21, 22 | 0 | 0 | PENDIENTE |
| `Sprint-B07` | 23, 24 | 0 | 0 | PENDIENTE |
| `Sprint-B08` | AOP Logging | 0 | 0 | PENDIENTE |
| **TOTAL** | **24 Endpoints** | **0** | **0** | **PENDIENTE** |

---

## 4. Hallazgos y Bloqueos
* *Sin hallazgos registrados aún (auditoría pendiente de ejecución).*

---

## 5. Veredicto Final y Autorización de Pase
* **Estado:** `PENDIENTE DE EJECUCIÓN`
* **Criterio de Aprobación:** 24 endpoints verificados pasando exitosamente en la colección de Postman (`compunex_postman_collection.json`) y 0 fallas en tests de integración antes de habilitar el `Sprint-G_Final`.
