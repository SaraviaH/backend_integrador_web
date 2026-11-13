# BACKLOG_BACKEND.md — Backlog Detallado del Track Backend (Spring Boot 3.2.0)

> **Área Técnica:** Backend  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Línea Base:** Spring Boot 3.2.0, Java 17, Spring Data JPA, Spring Security 6.2, JJWT 0.11.5, MySQL 8.0  
> **Total Endpoints:** 24 endpoints (14 existentes + 10 nuevos)  
> **Total Tablas:** 10 tablas relacionales (`MODELO_Y_DICCIONARIO_BD.md`)  
> **Reglas de Negocio:** `RN-001` a `RN-008`

---

## 1. Visión y Estrategia del Track Backend

El Agente de Backend es responsable de construir la API REST robusta, segura y transaccional que soporta el marketplace COMPUNEX B2B. Su desarrollo se realiza siguiendo la arquitectura en capas estricta (`Controller` -> `Service` -> `Repository` -> `Entity`/`DTO`), asegurando:
1. **Fidelidad al 100% de los Contratos:** Los payloads de solicitud y respuesta deben coincidir exactamente con `CONTRATOS_JSON.md` y `compunex-openapi.yaml`.
2. **Atomicidad Transaccional:** Uso de `@Transactional` en operaciones compuestas, con especial énfasis en el patrón **Split Order** (`RN-005`).
3. **Seguridad Stateless:** Autenticación JWT en cada endpoint no público, validando roles (`ADMIN`, `PROVEEDOR`, `CLIENTE`) mediante `@PreAuthorize`.
4. **Validación y Manejo Centralizado de Errores:** `@RestControllerAdvice` uniforme que traduce excepciones en códigos HTTP correctos (`400`, `401`, `403`, `404`, `409`, `422`).

---

## 2. Mapa de Sprints del Track Backend

| ID Sprint | Título | Endpoints Cubiertos | Tablas Afectadas | Reglas de Negocio | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `Sprint-B01` | Auth, Perfiles y Seguridad JWT | 1, 2, 3, 4, 15, 16, 17 | `usuarios`, `perfiles_proveedor` | `RN-001`, `RN-002` | `PENDIENTE` |
| `Sprint-B02` | Catálogo B2B y Productos Públicos | 5, 6, 18, 19 | `categorias`, `subcategorias`, `productos`, `imagenes_producto`, `producto_especificaciones` | `RN-003`, `RN-004` | `PENDIENTE` |
| `Sprint-B03` | Pedidos, Split Order y Facturación | 20, 21, 22 | `ordenes`, `subordenes_factura`, `orden_items`, `productos` | `RN-005`, `RN-006`, `RN-007`, `RN-008` | `PENDIENTE` |
| `Sprint-B04` | Gestión de Proveedor y Despacho | 7, 8, 9, 10, 11, 12, 23, 24 | `productos`, `subordenes_factura`, `perfiles_proveedor` | `RN-003`, `RN-004` | `PENDIENTE` |
| `Sprint-B05` | Administración, Moderación y Auditoría | 13, 14 | `productos`, `usuarios` | `RN-001` | `PENDIENTE` |
| `Sprint-B_Audit` | **Quality Gate 1: Certificación Backend** | Todos (1 al 24) | 10 Tablas | `RN-001` a `RN-008` | `BLOQUEADO` |

---

## 3. Matriz Exhaustiva de Endpoints vs Sprints

| # | Método | Ruta del Endpoint | Sprint | DTO Entrada | DTO Salida | Código HTTP |
| :-: | :--- | :--- | :-: | :--- | :--- | :-: |
| 1 | `POST` | `/api/v1/auth/login` | B01 | `LoginRequestDTO` | `AuthResponseDTO` | 200 |
| 2 | `POST` | `/api/v1/auth/register` | B01 | `RegistroProveedorRequestDTO` | `AuthResponseDTO` | 201 |
| 3 | `GET` | `/api/v1/auth/me` | B01 | — | `UsuarioPerfilResponseDTO` | 200 |
| 4 | `PATCH` | `/api/v1/auth/password` | B01 | `CambioContrasenaRequestDTO` | `MensajeResponseDTO` | 200 |
| 15 | `POST` | `/api/v1/auth/register-company` | B01 | `RegistroEmpresaRequestDTO` | `AuthResponseDTO` | 201 |
| 16 | `GET` | `/api/v1/providers/me/profile` | B01 | — | `ProveedorPerfilResponseDTO` | 200 |
| 17 | `POST` | `/api/v1/providers/me/activate` | B01 | `ActivarProveedorRequestDTO` | `ProveedorPerfilResponseDTO` | 200 |
| 5 | `GET` | `/api/v1/categories` | B02 | — | `List<CategoriaResponseDTO>` | 200 |
| 6 | `GET` | `/api/v1/categories/{id}` | B02 | — | `CategoriaDetalleResponseDTO` | 200 |
| 18 | `GET` | `/api/v1/products` | B02 | Params query (search, cat, page) | `PaginaResponseDTO<ProductoCardDTO>` | 200 |
| 19 | `GET` | `/api/v1/products/{id}` | B02 | — | `ProductoDetalleResponseDTO` | 200 |
| 20 | `POST` | `/api/v1/orders/checkout` | B03 | `CheckoutRequestDTO` | `CheckoutResponseDTO` | 201 |
| 21 | `GET` | `/api/v1/orders/me` | B03 | Params query (page, size) | `PaginaResponseDTO<OrdenResumenDTO>` | 200 |
| 22 | `GET` | `/api/v1/orders/me/{ordenId}` | B03 | — | `OrdenDetalleResponseDTO` | 200 |
| 7 | `GET` | `/api/v1/providers/me/products` | B04 | Params query | `PaginaResponseDTO<ProductoProveedorDTO>` | 200 |
| 8 | `GET` | `/api/v1/providers/me/products/{id}` | B04 | — | `ProductoEdicionDTO` | 200 |
| 9 | `POST` | `/api/v1/providers/me/products` | B04 | `CrearProductoRequestDTO` | `ProductoEdicionDTO` | 201 |
| 10 | `PUT` | `/api/v1/providers/me/products/{id}` | B04 | `ActualizarProductoRequestDTO` | `ProductoEdicionDTO` | 200 |
| 11 | `PATCH` | `/api/v1/providers/me/products/{id}/status` | B04 | `CambiarEstadoProductoDTO` | `MensajeResponseDTO` | 200 |
| 12 | `DELETE` | `/api/v1/providers/me/products/{id}` | B04 | — | `MensajeResponseDTO` (Soft Delete) | 200 |
| 23 | `GET` | `/api/v1/providers/me/sales` | B04 | Params query | `PaginaResponseDTO<SubordenResumenDTO>` | 200 |
| 24 | `GET` | `/api/v1/providers/me/sales/{subordenId}` | B04 | — | `SubordenDetalleProveedorDTO` | 200 |
| 13 | `GET` | `/api/v1/admin/products` | B05 | Params query | `PaginaResponseDTO<ProductoAdminDTO>` | 200 |
| 14 | `PATCH` | `/api/v1/admin/products/{id}/status` | B05 | `CambiarEstadoAdminDTO` | `MensajeResponseDTO` | 200 |

---

## 4. Definición de Hecho (Definition of Done) para el Track Backend
Para considerar un sprint de backend como completado:
1. El código compila limpiamente sin advertencias críticas (`mvn clean test`).
2. Todos los endpoints cuentan con pruebas de integración usando `@SpringBootTest` y `MockMvc`.
3. Los DTOs coinciden campo por campo y tipo por tipo con `CONTRATOS_JSON.md`.
4. El manejo de errores devuelve `ErrorResponseDTO` con estructura `{ "timestamp", "estado", "error", "mensaje", "ruta" }`.
5. La memoria de trabajo `MEMORY_BACKEND.md` se actualiza con la evidencia de ejecución.
