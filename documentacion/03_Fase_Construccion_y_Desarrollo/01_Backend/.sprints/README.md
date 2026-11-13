# Sprints de Backend — Track 01 (Spring Boot 3.2.0)

> **Área:** Backend  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Objetivo:** Ejecutar la construcción modular de los 24 endpoints de COMPUNEX B2B, garantizando desacoplamiento, pruebas unitarias y cierre con Quality Gate 1 (`AUDITORIA_1.md`).

---

## 1. Organización del Track de Backend

Los sprints de backend se organizan por afinidad funcional y dominio para maximizar la cohesión y reducir el acoplamiento:
1. `Sprint-B01_Auth_y_Seguridad`: Autenticación, JWT, registro de empresas y perfiles de proveedor.
2. `Sprint-B02_Catalogo_y_Productos`: Categorías, catálogo público B2B, paginación, filtros y ficha detallada.
3. `Sprint-B03_Carrito_y_Split_Order`: Checkout transaccional atómico, división por proveedor y emisión de factura simulada.
4. `Sprint-B04_Panel_Proveedor_y_Despacho`: Gestión de catálogo propio del proveedor y panel de despacho de subórdenes.
5. `Sprint-B05_Auditoria_y_Admin`: Moderación de productos por administradores y logs de auditoría AOP.
6. `Sprint-B_Audit`: Hito de control obligatorio (Quality Gate 1) que audita los 24 endpoints antes de permitir la unión E2E.

---

## 2. Regla de Oro del Track Backend
* **Prohibido modificar contratos unilateralmente:** Si se requiere un cambio en la estructura de un DTO o ruta, debe solicitarse una revisión macro y actualizar `CONTRATOS_JSON.md` y `compunex-openapi.yaml`.
* **Prohibidos los mocks en Backend:** El backend interactúa con MySQL 8.0 real o base de datos de pruebas H2/Testcontainers durante los tests de integración; no simula la base de datos con mocks dentro del código productivo.
