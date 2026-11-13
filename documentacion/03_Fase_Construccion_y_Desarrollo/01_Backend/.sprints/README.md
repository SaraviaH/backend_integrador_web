# Sprints de Backend — Track 01 (Spring Boot 3.5.16 / Java 21)

> **Área:** Backend  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Estado General:** `COMPLETADO Y APROBADO` (`AUDITORIA_1.md` + Refactor SRP `03107f8`, `83/83` tests en verde)  
> **Objetivo:** Ejecutar la construcción modular de los 24 endpoints Core de COMPUNEX B2B más la extensión multimedia (`Sprint-B09`), organizando el trabajo en 9 sprints técnicos granulares, desacoplamiento SRP, pruebas automatizadas y cierre con Quality Gate 1 (`AUDITORIA_1.md`).

---

## 1. Organización de los 9 Sprints de Backend + Quality Gate 1

Partiendo de los 14 endpoints base en `compunex-backend`, el track de backend se ejecutó en 9 sprints técnicos más su certificación formal:

1. [`Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend`](Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend/SPEC.md) — **`COMPLETADO`**: Consolidación de arquitectura monolítica modular por capas y dominios, reglas SOLID, patrones GoF, perfiles `dev`/`prod` y auditoría de los 14 endpoints base.
2. [`Sprint-B02_Auth_Aditivo_Empresa_y_Activacion`](Sprint-B02_Auth_Aditivo_Empresa_y_Activacion/SPEC.md) — **`COMPLETADO`**: Endpoints aditivos 15, 16 y 17 para registro de empresas compradoras, consulta de perfil y activación comercial de proveedor.
3. [`Sprint-B03_Catalogo_Publico_B2B`](Sprint-B03_Catalogo_Publico_B2B/SPEC.md) — **`COMPLETADO`**: Endpoints públicos 18 y 19 con paginación JPA `Specification`, filtros facetados y exclusión de soft-delete.
4. [`Sprint-B04_Persistencia_Ordenes_y_Split_Order`](Sprint-B04_Persistencia_Ordenes_y_Split_Order/SPEC.md) — **`COMPLETADO`**: Entidades JPA y repositorios para `ordenes`, `subordenes_factura` y `orden_items`.
5. [`Sprint-B05_Checkout_Transaccional_y_Facturacion`](Sprint-B05_Checkout_Transaccional_y_Facturacion/SPEC.md) — **`COMPLETADO`**: Endpoint `POST /api/v1/orders/checkout` (20) con Split Order ACID, correlativos persistentes en BD, IGV 18% (`RN-008`) y bloqueo de auto-compra (`RN-007`).
6. [`Sprint-B06_Historial_Compras_y_Detalle_Orden`](Sprint-B06_Historial_Compras_y_Detalle_Orden/SPEC.md) — **`COMPLETADO`**: Endpoints 21 y 22 para historial del comprador y detalle de comprobantes simulados `SIM-F001-%08d`.
7. [`Sprint-B07_Ventas_Proveedor_y_Despacho`](Sprint-B07_Ventas_Proveedor_y_Despacho/SPEC.md) — **`COMPLETADO`**: Endpoints 23, 24 y `PATCH /api/v1/providers/me/sales/{subordenId}/status` para subórdenes recibidas y transiciones logísticas.
8. [`Sprint-B08_Auditoria_AOP_y_Admin_Moderacion`](Sprint-B08_Auditoria_AOP_y_Admin_Moderacion/SPEC.md) — **`COMPLETADO`**: Moderación administrativa protegida por `ROLE_ADMIN` y auditoría transversal `@Auditable` + `AuditAspect`.
9. [`Sprint-B09_Carga_Imagenes_y_Media`](Sprint-B09_Carga_Imagenes_y_Media/SPEC.md) — **`COMPLETADO`**: Endpoints `POST /api/v1/media/upload` (28) y `GET /api/v1/media/files/{folder}/{filename}` (29) para subida y entrega pública de imágenes.
10. [`Sprint-B_Audit`](Sprint-B_Audit/AUDITORIA_1.md) — **`APROBADO`**: **Quality Gate 1** con alineación 1:1 con `CONTRATOS_JSON.md`, arranque verificado en PostgreSQL (`200 OK` en `/api-docs` y `/swagger-ui/index.html`) y `83/83` pruebas en verde tras el refactor SRP (`03107f8`).
