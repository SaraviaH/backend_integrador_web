# Sprints de Backend — Track 01 (Spring Boot 3.2.0)

> **Área:** Backend  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Objetivo:** Ejecutar la construcción modular de los 24 endpoints de COMPUNEX B2B organizados en 8 sprints técnicos granulares, garantizando desacoplamiento, pruebas unitarias y cierre con Quality Gate 1 (`AUDITORIA_1.md`).

---

## 1. Organización de los 8 Sprints de Backend

Reconociendo que `compunex-backend` ya cuenta con una base funcional de 14 endpoints, el track de backend se estructura en 8 sprints granulares:

1. [`Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend`](Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend/SPEC.md): Estructuración formal de la arquitectura monolítica modular por capas y dominios, reglas SOLID, patrones GoF, scaffolding de paquetes y auditoría/refactor de los 14 endpoints existentes (`AuthController`, `CategoriaController`, `ProductoProveedorController`, `AdminProductoController`) alineándolos a `CONTRATOS_JSON.md`.
2. [`Sprint-B02_Auth_Aditivo_Empresa_y_Activacion`](Sprint-B02_Auth_Aditivo_Empresa_y_Activacion/SPEC.md): Endpoints aditivos de autenticación (15, 16, 17) para registro de empresas compradoras y activación de rol de proveedor.
3. [`Sprint-B03_Catalogo_Publico_B2B`](Sprint-B03_Catalogo_Publico_B2B/SPEC.md): Endpoints aditivos de catálogo público (18, 19) con paginación optimizada, filtros facetados y exclusión de soft-delete.
4. [`Sprint-B04_Persistencia_Ordenes_y_Split_Order`](Sprint-B04_Persistencia_Ordenes_y_Split_Order/SPEC.md): Entidades JPA y repositorios para las 3 tablas relacionales de pedidos (`ordenes`, `subordenes_factura`, `orden_items`).
5. [`Sprint-B05_Checkout_Transaccional_y_Facturacion`](Sprint-B05_Checkout_Transaccional_y_Facturacion/SPEC.md): Endpoint `POST /api/v1/orders/checkout` (20) con Split Order ACID, recálculo de montos (RN-008) y no auto-compra (RN-007).
6. [`Sprint-B06_Historial_Compras_y_Detalle_Orden`](Sprint-B06_Historial_Compras_y_Detalle_Orden/SPEC.md): Endpoints 21 y 22 para trazabilidad de compras y comprobantes simulados correlativos `F001-XXXXX`.
7. [`Sprint-B07_Ventas_Proveedor_y_Despacho`](Sprint-B07_Ventas_Proveedor_y_Despacho/SPEC.md): Endpoints 23 y 24 para gestión de subórdenes asignadas al proveedor y transición de estados logísticos.
8. [`Sprint-B08_Auditoria_AOP_y_Admin_Moderacion`](Sprint-B08_Auditoria_AOP_y_Admin_Moderacion/SPEC.md): Moderación administrativa de productos y aspecto de auditoría transversal `@Aspect` `AuditAspect`.
9. [`Sprint-B_Audit`](Sprint-B_Audit/AUDITORIA_1.md): **Quality Gate 1** con certificación formal de los 24 endpoints pasando en Postman con 0 rojos.
