# ARCHITECTURE.md — Arquitectura de Integración, APIs y Comunicación (COMPUNEX B2B)

> **Área Técnica:** Integración y APIs  
> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Estado:** Auditado frente a las 27 pantallas MVP (`P-01` a `P-37`) — **24 Endpoints (14 existentes + 10 nuevos)**

---

## 🏛️ 1. Definición de la Arquitectura de Integración

* **Estilo de API:** RESTful JSON sobre HTTP con documentación viva OpenAPI 3 (`springdoc-openapi-starter-webmvc-ui 2.6.0`).
* **Rutas de Documentación Local:**
  - Swagger UI: `http://localhost:8080/swagger-ui.html`
  - OpenAPI JSON: `http://localhost:8080/api-docs`
* **Estrategia de Versionado:** Por URI (`/api/v1/...`).
* **Manejo Global de Errores:** Centralizado en `GlobalExceptionHandler` (`@RestControllerAdvice`), devolviendo payloads JSON estructurados:
  - `EntityNotFoundException` → `404 Not Found` (`{"mensaje": "..."}`)
  - `BadCredentialsException` / `UsernameNotFoundException` → `401 Unauthorized` (`{"mensaje": "Credenciales incorrectas"}`)
  - `MethodArgumentNotValidException` → `400 Bad Request` (mapa `campo -> mensaje`)
  - `ContrasenaActualIncorrectaException` / `IllegalArgumentException` → `400 Bad Request` (`{"mensaje": "..."}`)

---

## 🗺️ 2. Inventario Completo de Endpoints (24 Endpoints)

### A. Endpoints Ya Implementados en `compunex-backend` (14)

| # | Módulo | Método | Endpoint | Acceso | Pantallas Vinculadas |
| :---: | :--- | :---: | :--- | :---: | :---: |
| 1 | Auth | `POST` | `/api/v1/auth/login` | Público | `P-06` |
| 2 | Auth | `POST` | `/api/v1/auth/register` *(alias: `/registro-proveedor`)* | Público | `P-07` *(registro directo proveedor)* |
| 3 | Auth | `GET` | `/api/v1/auth/me` | Autenticado | `P-16` |
| 4 | Auth | `PATCH` | `/api/v1/auth/password` | Autenticado | `P-17` |
| 5 | Categorías | `GET` | `/api/v1/categories` | Público | `P-01`, `P-02` |
| 6 | Categorías | `GET` | `/api/v1/categories/{id}` | Público | `P-02` |
| 7 | Productos | `GET` | `/api/v1/providers/me/products` | `ROLE_PROVEEDOR` | `P-19`, `P-20` |
| 8 | Productos | `GET` | `/api/v1/providers/me/products/{id}` | `ROLE_PROVEEDOR` | `P-22`, `P-23` |
| 9 | Productos | `POST` | `/api/v1/providers/me/products` | `ROLE_PROVEEDOR` | `P-21` |
| 10 | Productos | `PUT` | `/api/v1/providers/me/products/{id}` | `ROLE_PROVEEDOR` | `P-23` |
| 11 | Productos | `PATCH` | `/api/v1/providers/me/products/{id}/status` | `ROLE_PROVEEDOR` | `P-20` |
| 12 | Productos | `DELETE` | `/api/v1/providers/me/products/{id}` | `ROLE_PROVEEDOR` | `P-20` |
| 13 | Admin | `GET` | `/api/v1/admin/products` | `ROLE_ADMIN` | Panel Admin |
| 14 | Admin | `PATCH` | `/api/v1/admin/products/{id}/status` | `ROLE_ADMIN` | Panel Admin |

### B. Endpoints Nuevos Diseñados por Auditoría de Pantallas (10 — Por Implementar en Fase 03)

| # | Módulo | Método | Endpoint | Acceso | Pantallas Vinculadas |
| :---: | :--- | :---: | :--- | :---: | :---: |
| 15 | Auth / Empresa | `POST` | `/api/v1/auth/register-company` | Público | `P-07` |
| 16 | Perfiles | `GET` | `/api/v1/providers/me/profile` | `ROLE_PROVEEDOR` | `P-26` |
| 17 | Perfiles | `POST` | `/api/v1/providers/me/activate` | Autenticado | `P-18` |
| 18 | Catálogo Público | `GET` | `/api/v1/products` | Público | `P-01`, `P-03` |
| 19 | Catálogo Público | `GET` | `/api/v1/products/{id}` | Público | `P-04`, `P-05` |
| 20 | Órdenes / Checkout | `POST` | `/api/v1/orders/checkout` | Autenticado | `P-10`, `P-11`, `P-12`, `P-13` |
| 21 | Órdenes / Compras | `GET` | `/api/v1/orders/me` | Autenticado | `P-14` |
| 22 | Órdenes / Compras | `GET` | `/api/v1/orders/me/{ordenId}` | Autenticado | `P-13`, `P-15` |
| 23 | Ventas Proveedor | `GET` | `/api/v1/providers/me/sales` | `ROLE_PROVEEDOR` | `P-24` |
| 24 | Ventas Proveedor | `GET` | `/api/v1/providers/me/sales/{subordenId}` | `ROLE_PROVEEDOR` | `P-25` |

*Para el contrato completo de entrada (Request) y salida (Response) de cada uno de los 24 endpoints, consultar [`CONTRATOS_JSON.md`](CONTRATOS_JSON.md).*
