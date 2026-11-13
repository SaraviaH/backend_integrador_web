# MEMORY_FRONTEND.md — Bitácora y Estado Activo del Agente Frontend

> **Área Técnica:** Frontend (Angular 18 Standalone + Signals)  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Responsable:** Agente Frontend  
> **Última Actualización:** 2026-11-13

---

## 1. Estado Actual de Ejecución

* **Sprint Activo:** Ninguno (En espera de `Sprint-G01` de Setup).
* **Pantallas Construidas:** 0 / 27 MVP certificadas.
* **Total Sprints Frontend:** 14 sprints técnicos + `Sprint-F_Audit` (Gate 2).
* **Modo de Conexión:** Mock Server Prism (`http://localhost:4010`).

---

## 2. Registro de Sprints Frontend (14 Sprints + Gate 2)

| Sprint | Rama GitFlow | Estado | Pantallas Verificadas | 4 Estados UI |
| :--- | :--- | :---: | :---: | :---: |
| `Sprint-F01_Arquitectura_Estructura_y_Reglas_Frontend` | `feat/sprint-1-frontend` | `DONE` | Shell Global, Layouts, Tokens & Contratos | VERIFICADO |
| `Sprint-F02_Auth_Login_y_Registro_Empresa` | `feat/sprint-1-frontend` | `DONE` | 2 / 2 (`P-06`, `P-07`) | VERIFICADO |
| `Sprint-F03_Home_y_Categorias` | `feat/sprint-1-frontend` | `EN_REVISION` | 2 / 2 (`P-01`, `P-02`) | VERIFICADO |
| `Sprint-F04_Catalogo_B2B_y_Busqueda` | `feature/frontend-catalog-search` | `LISTO_PARA_INICIAR` | 0 / 1 (`P-03`) | PENDIENTE |
| `Sprint-F05_Ficha_Detalle_Producto` | `feature/frontend-product-detail` | `BLOQUEADO` | 0 / 2 (`P-04`, `P-05`) | PENDIENTE |
| `Sprint-F06_Carrito_Reactivo_y_Agrupacion` | `feature/frontend-cart-service` | `BLOQUEADO` | 0 / 1 (`P-09`) | PENDIENTE |
| `Sprint-F07_Checkout_Wizard_Facturacion` | `feature/frontend-checkout-wizard` | `BLOQUEADO` | 0 / 3 (`P-10`, `P-11`, `P-12`) | PENDIENTE |
| `Sprint-F08_Visor_Factura_y_Comprobantes` | `feature/frontend-invoice-viewer` | `BLOQUEADO` | 0 / 1 (`P-13`) | PENDIENTE |
| `Sprint-F09_Mis_Compras_y_Trazabilidad` | `feature/frontend-orders-history` | `BLOQUEADO` | 0 / 2 (`P-14`, `P-15`) | PENDIENTE |
| `Sprint-F10_Mi_Cuenta_Seguridad_y_Activacion` | `feature/frontend-account-security` | `BLOQUEADO` | 0 / 3 (`P-16`, `P-17`, `P-18`) | PENDIENTE |
| `Sprint-F11_Dashboard_Proveedor_y_Perfil` | `feature/frontend-provider-dashboard` | `BLOQUEADO` | 0 / 2 (`P-19`, `P-26`) | PENDIENTE |
| `Sprint-F12_Gestion_Catalogo_Proveedor` | `feature/frontend-provider-catalog` | `BLOQUEADO` | 0 / 4 (`P-20` a `P-23`) | PENDIENTE |
| `Sprint-F13_Ventas_Proveedor_y_Despacho` | `feature/frontend-provider-sales` | `BLOQUEADO` | 0 / 2 (`P-24`, `P-25`) | PENDIENTE |
| `Sprint-F14_Paginas_de_Error_y_Rutas` | `feature/frontend-error-pages` | `BLOQUEADO` | 0 / 2 (`P-36`, `P-37`) | PENDIENTE |
| `Sprint-F_Audit` (Gate 2) | `release/gate-2-frontend-ui` | `BLOQUEADO` | 0 / 27 | PENDIENTE |

---

## 3. Decisiones de Arquitectura y Patrones Aplicados
* **Granularidad de Sprints:** Se evitó sobrecargar sprints agrupando como máximo 1 a 3 pantallas por sprint.
* **Gestión de Estado Reactivo:** Uso de Signals (`signal()`, `computed()`) para el carrito (`CartService`), la sesión (`AuthService`) y los filtros (`CatalogStateService`).
* **Estándar de 4 Estados:** Toda vista asíncrona implementa Carga, Vacío, Datos y Error con botón de reintento.
* **Accesibilidad:** WCAG 2.1 AA garantizada en contrastes y navegación por teclado.
