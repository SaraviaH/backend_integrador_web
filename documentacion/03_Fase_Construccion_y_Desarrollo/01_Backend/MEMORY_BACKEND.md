# MEMORY_BACKEND.md — Bitácora y Estado Activo del Agente Backend

> **Área Técnica:** Backend (Spring Boot 3.5.16 / Java 21 / PostgreSQL)  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Responsable:** Agente Backend  
> **Última Actualización:** 2026-11-13

---

## 1. Estado Actual de Ejecución

* **Sprint Activo:** **NINGUNO — Track Backend 100% Cerrado** (base lista en rama `integracion/e2e` desde `feat/backend-sprints` commit `03107f8`).
* **Endpoints Core Implementados y Certificados:** 24 endpoints (`Sprint-B01` a `Sprint-B08`) + `PATCH /api/v1/providers/me/sales/{subordenId}/status`.
* **Endpoints Adicionales Media:** 2 endpoints (`Sprint-B09`: `POST /api/v1/media/upload`, `GET /api/v1/media/files/{folder}/{filename}`).
* **Quality Gate 1 (`AUDITORIA_1.md`):** **`APROBADO PARA INTEGRACIÓN E2E`**.
* **Batería de Pruebas (`.\mvnw.cmd clean test`):** **`83/83` tests en verde** (`25` clases de test, `0` fallos, `0` errores, `0` omitidos).

---

## 2. Registro de Sprints Backend (B01–B09 + Gate 1 + Refactor SRP)

| Sprint | Rama / Commit | Estado | Endpoints Verificados | Test Suite |
| :--- | :--- | :---: | :---: | :---: |
| `Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend` | `feat/backend-sprints` (`2e84b9d`) | `COMPLETADO` | 14 / 14 | Verde |
| `Sprint-B02_Auth_Aditivo_Empresa_y_Activacion` | `feat/backend-sprints` (`3149165`) | `COMPLETADO` | 3 / 3 | Verde |
| `Sprint-B03_Catalogo_Publico_B2B` | `feat/backend-sprints` (`2e576f7`) | `COMPLETADO` | 2 / 2 | Verde |
| `Sprint-B04_Persistencia_Ordenes_y_Split_Order` | `feat/backend-sprints` (`59a9285`) | `COMPLETADO` | Persistencia 3 tablas JPA | Verde |
| `Sprint-B05_Checkout_Transaccional_y_Facturacion` | `feat/backend-sprints` (`a8a8b03`) | `COMPLETADO` | 1 / 1 | Verde |
| `Sprint-B06_Historial_Compras_y_Detalle_Orden` | `feat/backend-sprints` (`6463c36`) | `COMPLETADO` | 2 / 2 | Verde |
| `Sprint-B07_Ventas_Proveedor_y_Despacho` | `feat/backend-sprints` (`e91833a`) | `COMPLETADO` | 2 / 2 (+ `PATCH /status`) | Verde |
| `Sprint-B08_Auditoria_AOP_y_Admin_Moderacion` | `feat/backend-sprints` (`1540ed0`) | `COMPLETADO` | 2 / 2 + `AuditAspect` | Verde |
| `Sprint-B09_Carga_Imagenes_y_Media` | `feat/backend-sprints` (`1511771`) | `COMPLETADO` | 2 / 2 (`upload` + `files`) | Verde |
| `Sprint-B_Audit` (Gate 1) | `feat/backend-sprints` (`45479f7`) | `APROBADO` | 24 Core + 24b + Media | 83 / 83 passing |
| `Refactor Opción B (SRP)` | `feat/backend-sprints` (`03107f8`) -> `integracion/e2e` | `COMPLETADO` | Sin cambios de contrato | 83 / 83 passing |

---

## 3. Decisiones de Arquitectura y Patrones Aplicados

* **Segregación SRP en Servicios (Opción B — commit `03107f8`):**
  * `catalogo`: Se dividió el monolito `ProductoServiceImpl` en servicios dedicados por actor (`ProductoProveedorServiceImpl`, `ProductoPublicoServiceImpl`, `AdminProductoServiceImpl`) respaldados por `ProveedorContextHelper`, `ProductoEstadoHelper` y `ProductoPaginadoResponseDTO.from(...)`.
  * `ordenes`: `OrderServiceImpl` orquesta el flujo transaccional y delega validación de stock/auto-compra, correlativos y cálculos IGV 18% a `SplitOrderCalculator`, y el mapeo de respuestas a `OrderResponseMapper`.
  * `auth`: Se separó la gestión de sesión/credenciales (`AuthServiceImpl`) del onboarding corporativo de proveedores y empresas (`RegistroCorporativoServiceImpl`).
* **Correlativos Persistentes en BD (`45479f7`):** Reemplazados contadores en memoria por consultas `MAX(id)` en `OrdenRepository` y `SubordenFacturaRepository` generando códigos únicos `PED-2026-%06d` y `SIM-F001-%08d` compatibles con reinicios y PostgreSQL `ddl-auto=update`.
* **Aspecto Transversal de Auditoría:** `@Auditable` + `AuditAspect` registran `[AUDIT_LOG]` en `AuthServiceImpl.login`, `RegistroCorporativoServiceImpl.registrarEmpresa`, `OrderServiceImpl.procesarCheckout` y `AdminProductoServiceImpl.cambiarEstadoPublicacionAdmin`.
* **Multimedia Local (`Sprint-B09`):** `MediaController` + `LocalMediaStorageServiceImpl` gestionan subida multipart (`image/jpeg`, `image/png`, `image/webp` hasta `5MB`) con nombres `UUID` y entrega pública cacheada en `/api/v1/media/files/{folder}/{filename}`.
* **OpenAPI / Swagger UI:** Actualizado `springdoc-openapi-starter-webmvc-ui` a `2.8.9` para compatibilidad total con Spring Boot `3.5.16` (`/api-docs` y `/swagger-ui/index.html` verificados con `200 OK` contra PostgreSQL vivo).
