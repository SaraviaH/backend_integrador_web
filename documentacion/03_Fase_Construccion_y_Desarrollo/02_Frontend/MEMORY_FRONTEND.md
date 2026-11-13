# MEMORY_FRONTEND.md — Bitácora y Estado Activo del Agente Frontend

> **Área Técnica:** Frontend (Angular 18 Standalone + Signals)  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Responsable:** Agente Frontend  
> **Última Actualización:** 2026-11-13

---

## 1. Estado Actual de Ejecución

* **Sprint Activo:** Ninguno (En espera de `Sprint-G01` de Setup).
* **Pantallas Construidas:** 0 / 27 MVP certificadas.
* **Modo de Conexión:** Mock Server Prism (`http://localhost:4010`).
* **Pruebas de Componentes / E2E:** 0 passing.

---

## 2. Registro de Sprints Frontend

| Sprint | Rama GitFlow | Estado | Pantallas Verificadas | Estado 4 Vistas |
| :--- | :--- | :---: | :---: | :---: |
| `Sprint-F01_Setup_UI_y_Auth` | `feature/frontend-shell-auth` | `PENDIENTE` | 0 / 5 (`P-01`, `P-02`, `P-03`, `P-06`, `P-07`) | PENDIENTE |
| `Sprint-F02_Catalogo_y_Detalle` | `feature/frontend-catalog-detail` | `BLOQUEADO` | 0 / 2 (`P-04`, `P-05`) | PENDIENTE |
| `Sprint-F03_Carrito_Reactivo` | `feature/frontend-reactive-cart` | `BLOQUEADO` | 0 / 1 (`P-09`) | PENDIENTE |
| `Sprint-F04_Checkout_y_Facturacion` | `feature/frontend-checkout-invoice` | `BLOQUEADO` | 0 / 6 (`P-10` a `P-15`) | PENDIENTE |
| `Sprint-F05_Paneles_Proveedor_y_Admin` | `feature/frontend-provider-panels` | `BLOQUEADO` | 0 / 13 (`P-16`..`P-26`, `P-36`, `P-37`) | PENDIENTE |
| `Sprint-F_Audit` (Gate 2) | `release/gate-2-frontend-ui` | `BLOQUEADO` | 0 / 27 | PENDIENTE |

---

## 3. Decisiones de Arquitectura y Patrones Aplicados
* **Gestión de Estado Reactivo:** Uso de Angular Signals (`signal`, `computed`) para el carrito (`CartService`), la sesión de usuario (`AuthService`) y los filtros de búsqueda (`CatalogService`).
* **Interceptores Funcionales:** `authInterceptor` inyecta automáticamente el token JWT Bearer si existe en `localStorage`.
* **Guards Funcionales:** `authGuard` y `roleGuard` protegen rutas como `/proveedor/**` o `/cuenta/**` evaluando el claim del JWT.
* **Componentes Standalone:** Cero módulos (`NgModule`). Cada componente importa explícitamente sus dependencias directas (`CommonModule`, `RouterLink`, etc.).
* **Fidelidad Visual B2B:** Uso de paleta corporativa neutra (Slate/Indigo), fuentes legibles y densidades de información compactas para mayoristas.

---

## 4. Registro de Bloqueos Técnicos
| Fecha | Descripción del Bloqueo | Impacto | Solución Propuesta | Estado |
| :--- | :--- | :--- | :--- | :---: |
| 2026-11-13 | Inicio de sprint dependiente de setup | Espera a que `Sprint-G01` configure el workspace | Iniciar inmediatamente tras `Sprint-G01` | EN CURSO |

---

## 5. Instrucciones para el Agente Frontend
1. Antes de iniciar un sprint, leer cuidadosamente su `SPEC.md` y los prompts de Stitch en `Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`.
2. Mantener levantado el servidor mock: `npm run mock:api` (puerto 4010).
3. Asegurar que cada componente implemente los 4 estados: Carga, Vacío, Datos y Error.
4. Validar contraste y accesibilidad con Lighthouse / axe-core.
5. Actualizar la tabla de la Sección 2 en este archivo al completar cada pantalla.
