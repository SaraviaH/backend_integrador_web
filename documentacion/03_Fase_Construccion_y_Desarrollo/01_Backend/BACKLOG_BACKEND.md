# BACKLOG_BACKEND.md — Backlog Detallado del Track Backend (Spring Boot 3.5.16)

> **Área Técnica:** Backend  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Línea Base Real:** Spring Boot 3.5.16, Java 21, Spring Data JPA, Spring Security 6, JJWT 0.12.6, PostgreSQL 15+ (H2 modo PostgreSQL en tests), Springdoc OpenAPI 2.8.9  
> **Total Endpoints:** 24 endpoints Core + 1 endpoint de despacho (`PATCH /status`) + 2 endpoints Media (`Sprint-B09`) = **27 endpoints verificados**  
> **Total Tablas JPA:** 10 tablas relacionales (`usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`, `ordenes`, `subordenes_factura`, `orden_items`)  
> **Reglas de Negocio:** `RN-001` a `RN-008`  
> **Estado del Track:** **`COMPLETADO Y CERTIFICADO`** (`AUDITORIA_1.md` APROBADA + Refactor SRP Opción B en `03107f8`, `83/83` tests en verde)

---

## 1. Visión y Estrategia del Track Backend

El Track Backend construye, extiende y certifica la API REST de COMPUNEX B2B sobre `compunex-backend`:
1. **Auditoría, Perfiles y Blindaje Base (`Sprint-B01`):** Consolidación de los 14 endpoints iniciales, manejo uniforme de excepciones (`GlobalExceptionHandler`), perfiles `dev`/`prod` y `@PreAuthorize` administrativo.
2. **Construcción Modular de Endpoints Aditivos (`Sprint-B02` a `Sprint-B09`):** Auth corporativo, perfiles/activación, catálogo público facetado, persistencia e historial de órdenes Split Order, ventas/despacho de proveedor, auditoría AOP (`@Auditable` + `AuditAspect`) y carga/entrega multimedia (`multipart/form-data`).
3. **Atomicidad Transaccional:** Patrón **Split Order ACID** (`RN-005` a `RN-008`) con correlativos persistentes en BD (`PED-2026-%06d` y `SIM-F001-%08d`).
4. **Cierre con Quality Gate 1 y Refactor SRP:** Certificación en [`AUDITORIA_1.md`](.sprints/Sprint-B_Audit/AUDITORIA_1.md) (`45479f7`) y desacoplamiento Opción B por responsabilidad única (`03107f8`), manteniendo `83/83` pruebas en verde.

---

## 2. Mapa de Sprints de Backend (Completado)

| ID Sprint | Título / Alcance | Endpoints Cubiertos | Tablas Afectadas | Reglas de Negocio | Commit Ref | Estado |
| :--- | :--- | :---: | :--- | :--- | :---: | :---: |
| `Sprint-B01` | Arquitectura, Estructura, Perfiles `dev`/`prod` y 14 EPs Base | 1 a 14 | `usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto` | `RN-001`, `RN-003` | `2e84b9d` | `COMPLETADO` |
| `Sprint-B02` | Auth Aditivo, Empresa y Activación | 15, 16, 17 | `usuarios`, `perfiles_proveedor` | `RN-001`, `RN-002` | `3149165` | `COMPLETADO` |
| `Sprint-B03` | Catálogo Público B2B | 18, 19 | `productos`, `categorias`, `imagenes_producto`, `producto_especificaciones` | `RN-003`, `RN-004` | `2e576f7` | `COMPLETADO` |
| `Sprint-B04` | Persistencia Órdenes y Split Order | Persistencia DDL JPA | `ordenes`, `subordenes_factura`, `orden_items` | `RN-005`, `RN-006` | `59a9285` | `COMPLETADO` |
| `Sprint-B05` | Checkout Transaccional y Facturación | 20 | `ordenes`, `subordenes_factura`, `orden_items`, `productos` | `RN-005`, `RN-006`, `RN-007`, `RN-008` | `a8a8b03` | `COMPLETADO` |
| `Sprint-B06` | Historial Compras y Detalle Orden | 21, 22 | `ordenes`, `subordenes_factura`, `orden_items` | `RN-001`, `RN-006` | `6463c36` | `COMPLETADO` |
| `Sprint-B07` | Ventas Proveedor y Despacho | 23, 24 (+ 24b `PATCH /status`) | `subordenes_factura`, `orden_items`, `ordenes`, `usuarios` | `RN-001`, `RN-005` | `e91833a` | `COMPLETADO` |
| `Sprint-B08` | Auditoría AOP y Admin Moderación | 13, 14, `@Auditable` + `AuditAspect` | `productos`, `usuarios` | `RN-001`, `RN-003` | `1540ed0` | `COMPLETADO` |
| `Sprint-B09` | Carga y Entrega de Imágenes Media (`multipart/form-data`) | 28, 29 | Almacenamiento local (`uploads/`) | Validación MIME / 5 MB | `1511771` | `COMPLETADO` |
| `Sprint-B_Audit` | **Quality Gate 1: Certificación Backend + Contratos 1:1 + OpenAPI 2.8.9** | Todos (1–24 + 24b + 28–29) | 10 Tablas JPA | `RN-001` a `RN-008` | `45479f7` | `APROBADO` |
| `Refactor-SRP` | **Opción B SRP** (`catalogo`, `ordenes`, `auth`) sin cambio de contratos | Todos (sin cambio de API) | Sin cambio DDL | `RN-001` a `RN-008` | `03107f8` | `COMPLETADO` |

---

## 3. Matriz Exhaustiva de Endpoints Implementados

| # | Método | Ruta del Endpoint | Sprint | DTO Entrada | DTO Salida | Código HTTP |
| :-: | :--- | :--- | :-: | :--- | :--- | :-: |
| 1 | `POST` | `/api/v1/auth/login` | B01 | `LoginRequestDTO` | `AuthResponseDTO` | 200 |
| 2 | `POST` | `/api/v1/auth/register` | B01 | `RegistroProveedorRequestDTO` | `RegistroProveedorResponseDTO` | 201 |
| 3 | `GET` | `/api/v1/auth/me` | B01 | — | `UsuarioSesionDTO` | 200 |
| 4 | `PATCH` | `/api/v1/auth/password` | B01 | `CambiarPasswordDTO` | `CambioPasswordResponseDTO` | 200 |
| 5 | `GET` | `/api/v1/categories` | B01 | — | `List<CategoriaResponseDTO>` | 200 |
| 6 | `GET` | `/api/v1/categories/{id}` | B01 | — | `CategoriaDetalleResponseDTO` | 200 |
| 7 | `GET` | `/api/v1/providers/me/products` | B01 | Params query (`search`, `page`, `size`) | `ProductoPaginadoResponseDTO` | 200 |
| 8 | `GET` | `/api/v1/providers/me/products/{id}` | B01 | — | `ProductoDetalleResponseDTO` | 200 |
| 9 | `POST` | `/api/v1/providers/me/products` | B01 | `CrearProductoRequestDTO` | `CrearProductoResponseDTO` | 201 |
| 10 | `PUT` | `/api/v1/providers/me/products/{id}` | B01 | `ActualizarProductoRequestDTO` | `ActualizarProductoResponseDTO` | 200 |
| 11 | `PATCH` | `/api/v1/providers/me/products/{id}/status` | B01 | `CambiarEstadoProductoDTO` | `CambioEstadoResponseDTO` | 200 |
| 12 | `DELETE` | `/api/v1/providers/me/products/{id}` | B01 | — | `204 No Content` (Soft Delete) | 204 |
| 13 | `GET` | `/api/v1/admin/products` | B08 | Params query (`search`, `page`, `size`) | `ProductoPaginadoResponseDTO` | 200 |
| 14 | `PATCH` | `/api/v1/admin/products/{id}/status` | B08 | `CambiarEstadoProductoDTO` | `CambioEstadoResponseDTO` | 200 |
| 15 | `POST` | `/api/v1/auth/register-company` | B02 | `RegistroEmpresaRequestDTO` | `RegistroEmpresaResponseDTO` | 201 |
| 16 | `GET` | `/api/v1/providers/me/profile` | B02 | — | `ProveedorPerfilResponseDTO` | 200 |
| 17 | `POST` | `/api/v1/providers/me/activate` | B02 | `ActivarProveedorRequestDTO` | `ActivarProveedorResponseDTO` | 201 |
| 18 | `GET` | `/api/v1/products` | B03 | Params query (`search`, `categoryId`, `page`, `size`) | `ProductoPublicoPaginadoResponseDTO` | 200 |
| 19 | `GET` | `/api/v1/products/{id}` | B03 | — | `ProductoPublicoDetalleDTO` | 200 |
| 20 | `POST` | `/api/v1/orders/checkout` | B05 | `CheckoutRequestDTO` | `CheckoutResponseDTO` | 201 |
| 21 | `GET` | `/api/v1/orders/me` | B06 | Params query (`page`, `size`) | `OrdenPaginadaResponseDTO` | 200 |
| 22 | `GET` | `/api/v1/orders/me/{ordenId}` | B06 | — | `CheckoutResponseDTO` | 200 |
| 23 | `GET` | `/api/v1/providers/me/sales` | B07 | Params query (`page`, `size`) | `VentaPaginadaResponseDTO` | 200 |
| 24 | `GET` | `/api/v1/providers/me/sales/{subordenId}` | B07 | — | `SubordenDetalleProveedorDTO` | 200 |
| 24b | `PATCH` | `/api/v1/providers/me/sales/{subordenId}/status` | B07 | `CambiarEstadoDespachoDTO` | `SubordenDetalleProveedorDTO` | 200 |
| 28 | `POST` | `/api/v1/media/upload` | B09 | `MultipartFile` (`file`) + `folder` | `MediaUploadResponseDTO` | 201 |
| 29 | `GET` | `/api/v1/media/files/{folder}/{filename}` | B09 | — | `Resource` (imagen pública) | 200 |
