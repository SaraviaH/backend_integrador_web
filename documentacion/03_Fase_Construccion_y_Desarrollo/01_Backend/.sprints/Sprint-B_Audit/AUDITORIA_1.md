# AUDITORIA_1 — Quality Gate 1: Certificación del Backend Core (24 Endpoints en 8 Sprints)

> **Área / Track:** Backend Track (Spring Boot 3.5.16 / Java 21)  
> **Auditor Responsable:** Agente Auditor de Backend & Coordinador Macro  
> **Fecha de Evaluación:** 2026-11-13  
> **Resultado del Gate:** APROBADO (24 / 24 endpoints Core verificados + Sprint-B09 Media integrado)

---

## 1. Alcance de la Auditoría
Evaluación exhaustiva de la API REST de COMPUNEX B2B previo a autorizar la integración E2E con el frontend Angular real. Comprende la verificación de los 24 endpoints construidos y refactorizados a lo largo de los 8 sprints de backend (`Sprint-B01` a `Sprint-B08`) más la extensión multimedia del `Sprint-B09`, la integridad del esquema JPA en PostgreSQL (`compunex_b2b`, verificado en vivo) y H2 modo PostgreSQL, la ejecución del motor Split-Order ACID, la alineación 1:1 con `CONTRATOS_JSON.md` y la conformidad de las 8 reglas de negocio.

---

## 2. Checklist de Validación Estricta

### 2.1. Compilación y Calidad de Código
- [x] Compilación limpia con Maven: `.\mvnw.cmd clean test` sin fallas (`83` pruebas ejecutadas, `0` fallos, `0` errores, `0` omitidas).
- [ ] Escaneo automatizado de vulnerabilidades OWASP sobre dependencias *(no ejecutado con scanner externo; compatibilidad verificada y actualizada `springdoc-openapi-starter-webmvc-ui` a `2.8.9`)*.
- [x] Manejo centralizado de excepciones con `GlobalExceptionHandler` uniforme.
- [x] Aspecto de auditoría AOP (`AuditAspect`) activo trazando transacciones críticas.
- [x] Arranque en vivo contra PostgreSQL (`localhost:5432`) y endpoints OpenAPI (`/api-docs`) y Swagger UI (`/swagger-ui/index.html`) respondiendo `200 OK`.

### 2.2. Cobertura de Endpoints por Sprint (24 / 24 + Sprint-B09)
- [x] **Sprint-B01 (Base Existente Refactorizada - 14 endpoints):**
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
- [x] **Sprint-B02 (Auth Aditivo - 3 endpoints):**
  * `POST /api/v1/auth/register-company` (15)
  * `GET /api/v1/providers/me/profile` (16)
  * `POST /api/v1/providers/me/activate` (17 - `201 Created` con emisión de nuevo JWT `PROVEEDOR`)
- [x] **Sprint-B03 (Catálogo Público B2B - 2 endpoints):**
  * `GET /api/v1/products` (18 - Paginado y facetado)
  * `GET /api/v1/products/{id}` (19 - Ficha detallada con objeto `proveedor`)
- [x] **Sprint-B04 (Persistencia de Órdenes):** Entidades JPA `ordenes`, `subordenes_factura`, `orden_items`.
- [x] **Sprint-B05 (Checkout Transaccional Split Order - 1 endpoint):**
  * `POST /api/v1/orders/checkout` (20 - Atomicidad ACID por proveedor y `datosFacturacion`)
- [x] **Sprint-B06 (Historial de Compras - 2 endpoints):**
  * `GET /api/v1/orders/me` (21)
  * `GET /api/v1/orders/me/{ordenId}` (22 - Facturas simuladas correlativas persistentes `SIM-F001-%08d` y código `PED-2026-%06d`)
- [x] **Sprint-B07 (Ventas y Despacho de Proveedor - 2 endpoints + status):**
  * `GET /api/v1/providers/me/sales` (23)
  * `GET /api/v1/providers/me/sales/{subordenId}` (24) y `PATCH /api/v1/providers/me/sales/{subordenId}/status`
- [x] **Sprint-B08 (Auditoría AOP y Moderación):** Interceptor y aspecto `AuditAspect` trazando eventos.
- [x] **Sprint-B09 (Multimedia Local - 3 endpoints adicionales verificados en `MediaControllerTest`):** `POST /api/v1/media/upload`, `GET /api/v1/media/{folder}/{filename}`, `DELETE /api/v1/media/{folder}/{filename}`.

### 2.3. Verificación de Reglas de Negocio en Base de Datos
- [x] `RN-001`: Tokens inválidos o expirados retornan `401 Unauthorized` (y roles insuficientes `403 Forbidden`).
- [x] `RN-002`: Intento de registrar RUC o correo duplicado retorna `409 Conflict`.
- [x] `RN-003`: `DELETE` de producto mantiene el registro con `fecha_eliminacion` asignada (Soft Delete).
- [x] `RN-004`: Precios en `PEN` y validación de `stock_disponible` (con valor por defecto SQL `100`).
- [x] `RN-005` y `RN-006`: Checkout genera 1 orden (`PED-2026-%06d`) y N subórdenes con correlativo persistente en BD (`SIM-F001-%08d`) y desglose IGV 18%.
- [x] `RN-007`: Intento de auto-compra es rechazado con `400 Bad Request` (`AutoCompraException`).
- [x] `RN-008`: Recálculo de montos e IGV en backend verificado con precisión `BigDecimal` escala 2.

---

## 3. Matriz de Resultados de Ejecución

| Sprint Backend | Endpoints Involucrados | Aprobados | Fallidos | Estado Gate |
| :--- | :---: | :---: | :---: | :---: |
| `Sprint-B01` | 1 a 6, 7 a 14 | 14 | 0 | APROBADO |
| `Sprint-B02` | 15, 16, 17 | 3 | 0 | APROBADO |
| `Sprint-B03` | 18, 19 | 2 | 0 | APROBADO |
| `Sprint-B04` | Persistencia DDL JPA | - | 0 | APROBADO |
| `Sprint-B05` | 20 | 1 | 0 | APROBADO |
| `Sprint-B06` | 21, 22 | 2 | 0 | APROBADO |
| `Sprint-B07` | 23, 24 (+ status) | 2 | 0 | APROBADO |
| `Sprint-B08` | AOP Logging | - | 0 | APROBADO |
| **TOTAL** | **24 Endpoints Core** | **24** | **0** | **APROBADO** |

---

## 4. Hallazgos y Remediaciones Ejecutadas
1. **Alineación 1:1 con `CONTRATOS_JSON.md` (Endpoints 15–24):** Refactorizados DTOs y controladores para empatar exactamente los esquemas consumidos por el Frontend (`tienePerfilProveedor`, emisión de nuevo JWT y `201 Created` en `/providers/me/activate`, objeto `proveedor` y `stockDisponible` en catálogo público, estructura `datosFacturacion` / `facturasEmitidas` / `esSimulado` en checkout y detalle de orden, y `receptor` / `subtotalLinea` / `rucComprador` en ventas de proveedor).
2. **Correlativos persistentes en BD:** Reemplazados contadores `AtomicLong` en memoria de `OrderServiceImpl` por consultas `MAX(id)` en `OrdenRepository` y `SubordenFacturaRepository`, evitando colisiones de clave única tras reinicios.
3. **Compatibilidad PostgreSQL `ddl-auto=update`:** Definido `columnDefinition = "integer default 100"` en `Producto.stockDisponible`, valores por defecto en columnas nuevas de `Orden`/`SubordenFactura`, y respaldo no nulo en `register-company` para `telefonoContacto` y `direccion`.
4. **Incompatibilidad OpenAPI / Swagger con Spring Boot `3.5.16`:** Detectado HTTP `500` en `/api-docs` por `springdoc-openapi-starter-webmvc-ui:2.6.0`; actualizado a `2.8.9` y verificado con respuesta `200 OK` en `/api-docs` y `/swagger-ui/index.html` contra PostgreSQL vivo.

---

## 5. Veredicto Final y Autorización de Pase
* **Estado:** `APROBADO PARA INTEGRACIÓN E2E`
* **Evidencia de Cierre:** `.\mvnw.cmd clean test` ejecutado tras el último cambio con `83/83` pruebas en verde (H2 modo PostgreSQL) + verificación de arranque en vivo contra PostgreSQL `localhost:5432` (`CATEGORIES_COUNT=8`, `PRODUCTS_TOTAL=1`, `/api-docs` `200`, `/swagger-ui/index.html` `200`). Colección Postman disponible en `compunex-backend/docs/02_contratos_api/01_apis_por_rol/001-Apis-Formalizado-En-desarrollo/COMPUNEX_B2B_Coleccion_Postman.json`. Se habilita el pase a integración E2E (`Sprint-G_Final`).
