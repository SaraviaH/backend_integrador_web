# Sprints de Frontend — Track 02 (Angular 18 Standalone)

> **Área:** Frontend  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Objetivo:** Ejecutar la construcción modular de las 27 pantallas MVP de COMPUNEX B2B de forma paralela y desacoplada del Backend, consumiendo Prism Mock Server y culminando con el Quality Gate 2 (`AUDITORIA_2.md`).

---

## 1. Organización del Track de Frontend

Los sprints de frontend se agrupan por flujos de experiencia de usuario (UX):
1. `Sprint-F01_Setup_UI_y_Auth`: Shell layout, navegación, login y registro de empresas (`P-01`, `P-02`, `P-03`, `P-06`, `P-07`).
2. `Sprint-F02_Catalogo_y_Detalle`: Catálogo B2B reactivo con signals, ficha técnica, galería y contacto (`P-04`, `P-05`).
3. `Sprint-F03_Carrito_Reactivo`: Carrito de compras B2B con signals, agrupación por proveedor y persistencia (`P-09`).
4. `Sprint-F04_Checkout_y_Facturacion`: Flujo de checkout paso a paso, visualización de Split Order y comprobantes simulados (`P-10` a `P-15`).
5. `Sprint-F05_Paneles_Proveedor_y_Admin`: Tableros privados de proveedor y administración, gestión de catálogo y ventas (`P-16` a `P-26`, `P-36`, `P-37`).
6. `Sprint-F_Audit`: Hito de control obligatorio (Quality Gate 2) que audita las 27 pantallas antes de autorizar la integración E2E.

---

## 2. Regla de Oro del Track Frontend
* **Contract-First y Trabajo con Mock Server:** El frontend no espera al backend. Desarrolla contra Prism Mock Server (`http://localhost:4010`) que sirve las respuestas de `compunex-openapi.yaml`.
* **Los 4 Estados Visuales son Innegociables:** Ninguna pantalla pasa la revisión si solo implementa el "camino feliz". Debe mostrar esqueleto de carga, vista vacía, vista con datos y vista de error con botón de reintento.
