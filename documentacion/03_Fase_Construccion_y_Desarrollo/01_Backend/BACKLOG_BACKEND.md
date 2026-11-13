# BACKLOG_BACKEND.md — Backlog Detallado del Track Backend (Spring Boot 3.2.0)

> **Área Técnica:** Backend  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Línea Base:** Spring Boot 3.2.0, Java 17, Spring Data JPA, Spring Security 6.2, JJWT 0.11.5, MySQL 8.0  
> **Total Endpoints:** 24 endpoints (14 existentes auditados + 10 nuevos aditivos)  
> **Total Tablas:** 10 tablas relacionales (`MODELO_Y_DICCIONARIO_BD.md`)  
> **Reglas de Negocio:** `RN-001` a `RN-008`  
> **Total Sprints Backend:** 8 sprints técnicos + 1 Quality Gate (`Sprint-B_Audit`)

---

## 1. Visión y Estrategia del Track Backend

El Agente de Backend construye y extiende la API REST de COMPUNEX B2B partiendo de la base existente en `compunex-backend`:
1. **Auditoría y Refactor de la Base:** Se auditan y blindan los 14 endpoints existentes (`Sprint-B01`).
2. **Construcción Modular de Nuevos Endpoints:** Los 10 endpoints aditivos se desarrollan en sprints pequeños y enfocados (`Sprint-B02` a `Sprint-B08`).
3. **Atomicidad Transaccional:** Patrón **Split Order ACID** (`RN-005`) en `Sprint-B05`.
4. **Cierre con Quality Gate 1:** Ejecución de la colección completa de Postman certificando los 24 endpoints en `Sprint-B_Audit`.

---

## 2. Mapa de los 8 Sprints de Backend

| ID Sprint | Título / Alcance | Endpoints Cubiertos | Tablas Afectadas | Reglas de Negocio | Estado |
| :--- | :--- | :---: | :--- | :--- | :---: |
| `Sprint-B01` | Arquitectura, Estructura y Reglas Backend (14 EPs Base) | 1 a 6, 7 a 14 | `usuarios`, `perfiles_proveedor`, `categorias`, `productos` | `RN-001`, `RN-003` | `PENDIENTE` |
| `Sprint-B02` | Auth Aditivo, Empresa y Activación | 15, 16, 17 | `usuarios`, `perfiles_proveedor` | `RN-001`, `RN-002` | `BLOQUEADO` |
| `Sprint-B03` | Catálogo Público B2B | 18, 19 | `productos`, `categorias`, `imagenes_producto`, `producto_especificaciones` | `RN-003`, `RN-004` | `BLOQUEADO` |
| `Sprint-B04` | Persistencia Órdenes y Split Order | Persistencia DDL JPA | `ordenes`, `subordenes_factura`, `orden_items` | `RN-005`, `RN-006` | `BLOQUEADO` |
| `Sprint-B05` | Checkout Transaccional y Facturación | 20 | `ordenes`, `subordenes_factura`, `orden_items`, `productos` | `RN-005`, `RN-006`, `RN-007`, `RN-008` | `BLOQUEADO` |
| `Sprint-B06` | Historial Compras y Detalle Orden | 21, 22 | `ordenes`, `subordenes_factura`, `orden_items` | `RN-001`, `RN-006` | `BLOQUEADO` |
| `Sprint-B07` | Ventas Proveedor y Despacho | 23, 24 | `subordenes_factura`, `orden_items`, `usuarios` | `RN-001`, `RN-005` | `BLOQUEADO` |
| `Sprint-B08` | Auditoría AOP y Admin Moderación | 13, 14, AOP | `productos`, `usuarios` | `RN-001`, `RN-003` | `BLOQUEADO` |
| `Sprint-B_Audit` | **Quality Gate 1: Certificación Backend** | Todos (1 al 24) | 10 Tablas | `RN-001` a `RN-008` | `BLOQUEADO` |

---

## 3. Matriz Exhaustiva de Endpoints vs Sprints

| # | Método | Ruta del Endpoint | Sprint | DTO Entrada | DTO Salida | Código HTTP |
| :-: | :--- | :--- | :-: | :--- | :--- | :-: |
| 1 | `POST` | `/api/v1/auth/login` | B01 | `LoginRequestDTO` | `AuthResponseDTO` | 200 |
| 2 | `POST` | `/api/v1/auth/register` | B01 | `RegistroProveedorRequestDTO` | `AuthResponseDTO` | 201 |
| 3 | `GET` | `/api/v1/auth/me` | B01 | — | `UsuarioPerfilResponseDTO` | 200 |
| 4 | `PATCH` | `/api/v1/auth/password` | B01 | `CambioContrasenaRequestDTO` | `MensajeResponseDTO` | 200 |
| 5 | `GET` | `/api/v1/categories` | B01 | — | `List<CategoriaResponseDTO>` | 200 |
| 6 | `GET` | `/api/v1/categories/{id}` | B01 | — | `CategoriaDetalleResponseDTO` | 200 |
| 7 | `GET` | `/api/v1/providers/me/products` | B01 | Params query | `PaginaResponseDTO<ProductoProveedorDTO>` | 200 |
| 8 | `GET` | `/api/v1/providers/me/products/{id}` | B01 | — | `ProductoEdicionDTO` | 200 |
| 9 | `POST` | `/api/v1/providers/me/products` | B01 | `CrearProductoRequestDTO` | `ProductoEdicionDTO` | 201 |
| 10 | `PUT` | `/api/v1/providers/me/products/{id}` | B01 | `ActualizarProductoRequestDTO` | `ProductoEdicionDTO` | 200 |
| 11 | `PATCH` | `/api/v1/providers/me/products/{id}/status` | B01 | `CambiarEstadoProductoDTO` | `MensajeResponseDTO` | 200 |
| 12 | `DELETE` | `/api/v1/providers/me/products/{id}` | B01 | — | `MensajeResponseDTO` (Soft Delete) | 200 |
| 13 | `GET` | `/api/v1/admin/products` | B08 | Params query | `PaginaResponseDTO<ProductoAdminDTO>` | 200 |
| 14 | `PATCH` | `/api/v1/admin/products/{id}/status` | B08 | `CambiarEstadoAdminDTO` | `MensajeResponseDTO` | 200 |
| 15 | `POST` | `/api/v1/auth/register-company` | B02 | `RegistroEmpresaRequestDTO` | `AuthResponseDTO` | 201 |
| 16 | `GET` | `/api/v1/providers/me/profile` | B02 | — | `ProveedorPerfilResponseDTO` | 200 |
| 17 | `POST` | `/api/v1/providers/me/activate` | B02 | `ActivarProveedorRequestDTO` | `ProveedorPerfilResponseDTO` | 200 |
| 18 | `GET` | `/api/v1/products` | B03 | Params query (search, cat, page) | `PaginaResponseDTO<ProductoCardDTO>` | 200 |
| 19 | `GET` | `/api/v1/products/{id}` | B03 | — | `ProductoDetalleResponseDTO` | 200 |
| 20 | `POST` | `/api/v1/orders/checkout` | B05 | `CheckoutRequestDTO` | `CheckoutResponseDTO` | 201 |
| 21 | `GET` | `/api/v1/orders/me` | B06 | Params query (page, size) | `PaginaResponseDTO<OrdenResumenDTO>` | 200 |
| 22 | `GET` | `/api/v1/orders/me/{ordenId}` | B06 | — | `OrdenDetalleResponseDTO` | 200 |
| 23 | `GET` | `/api/v1/providers/me/sales` | B07 | Params query | `PaginaResponseDTO<SubordenResumenDTO>` | 200 |
| 24 | `GET` | `/api/v1/providers/me/sales/{subordenId}` | B07 | — | `SubordenDetalleProveedorDTO` | 200 |
