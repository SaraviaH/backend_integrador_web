# MEMORY_GENERAL.md — Estado Activo y Registro de Coordinación Macro (Fase 03)

> **Área:** Transversal / Coordinador Macro  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Propósito:** Registro dinámico del estado de ejecución de la Fase 03, control de Quality Gates, sincronización entre agentes de Backend y Frontend, y bitácora de bloqueos e integraciones.  
> **Estructura:** 3 Sprints Generales + 8 Sprints Backend (+ Gate 1) + 14 Sprints Frontend (+ Gate 2) + Integración Final.

---

## 1. Estado Global de la Fase 03

* **Estado de Fase:** `EN_PLANIFICACION_INICIAL` (Gate 0 Superado — Backlog Formalizado y Granular)
* **Modo de Trabajo:** Multi-Agente Desacoplado (Contract-First)
* **Línea Base Congelada:**
  * Contratos JSON: 24 endpoints (`CONTRATOS_JSON.md` + `compunex-openapi.yaml`)
  * Modelo de Datos: 10 tablas MySQL (`MODELO_Y_DICCIONARIO_BD.md`)
  * Pantallas Frontend: 27 pantallas MVP (`PROMPTS_GOOGLE_STITCH_TEMPLATE.md`)
  * Reglas de Negocio: 8 reglas (`RN-001` a `RN-008` en `DOMAIN.md`)

---

## 2. Tablero de Control de Sprints y Quality Gates

| Track | ID Sprint | Título / Alcance | Agente Responsable | Dependencia | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Transversal** | `Sprint-G01` | Setup y Entorno Base | Agente DevOps | Ninguna | `PENDIENTE` |
| **Transversal** | `Sprint-G02` | Base de Datos DDL (10 Tablas + Seeds) | Agente DBA | `Sprint-G01` | `PENDIENTE` |
| **Backend** | `Sprint-B01` | Auditoría Base Existente (14 EPs) | Agente Backend | `Sprint-G02` | `BLOQUEADO` |
| **Backend** | `Sprint-B02` | Auth Aditivo Empresa y Activación (15, 16, 17) | Agente Backend | `Sprint-B01` | `BLOQUEADO` |
| **Backend** | `Sprint-B03` | Catálogo Público B2B (18, 19) | Agente Backend | `Sprint-B02` | `BLOQUEADO` |
| **Backend** | `Sprint-B04` | Persistencia Órdenes y Split Order (DDL JPA) | Agente Backend | `Sprint-B03` | `BLOQUEADO` |
| **Backend** | `Sprint-B05` | Checkout Split Order ACID (20) | Agente Backend | `Sprint-B04` | `BLOQUEADO` |
| **Backend** | `Sprint-B06` | Historial Compras y Facturas (21, 22) | Agente Backend | `Sprint-B05` | `BLOQUEADO` |
| **Backend** | `Sprint-B07` | Ventas Proveedor y Despacho (23, 24) | Agente Backend | `Sprint-B06` | `BLOQUEADO` |
| **Backend** | `Sprint-B08` | Auditoría AOP y Admin Moderación (13, 14, AOP) | Agente Backend | `Sprint-B07` | `BLOQUEADO` |
| **Backend** | `Sprint-B_Audit` | **Gate 1: Certificación Backend (24 EPs)** | Agente Auditor Backend | `Sprint-B08` | `BLOQUEADO` |
| **Frontend** | `Sprint-F01` | Setup UI, Design Tokens y Shell | Agente Frontend | `Sprint-G01` (vía Mock) | `BLOQUEADO` |
| **Frontend** | `Sprint-F02` | Auth, Login y Registro Empresa (`P-06`, `P-07`) | Agente Frontend | `Sprint-F01` | `BLOQUEADO` |
| **Frontend** | `Sprint-F03` | Portal de Inicio y Categorías (`P-01`, `P-02`) | Agente Frontend | `Sprint-F01` | `BLOQUEADO` |
| **Frontend** | `Sprint-F04` | Catálogo B2B y Búsqueda (`P-03`) | Agente Frontend | `Sprint-F03` | `BLOQUEADO` |
| **Frontend** | `Sprint-F05` | Ficha Detalle y Contacto (`P-04`, `P-05`) | Agente Frontend | `Sprint-F04` | `BLOQUEADO` |
| **Frontend** | `Sprint-F06` | Carrito Reactivo y Agrupación (`P-09`) | Agente Frontend | `Sprint-F05` | `BLOQUEADO` |
| **Frontend** | `Sprint-F07` | Checkout Wizard 3 Pasos (`P-10`, `P-11`, `P-12`) | Agente Frontend | `Sprint-F06` | `BLOQUEADO` |
| **Frontend** | `Sprint-F08` | Visor de Factura Simulada (`P-13`) | Agente Frontend | `Sprint-F07` | `BLOQUEADO` |
| **Frontend** | `Sprint-F09` | Mis Compras y Detalle (`P-14`, `P-15`) | Agente Frontend | `Sprint-F08` | `BLOQUEADO` |
| **Frontend** | `Sprint-F10` | Mi Cuenta, Seguridad y Activación (`P-16`, `P-17`, `P-18`) | Agente Frontend | `Sprint-F09` | `BLOQUEADO` |
| **Frontend** | `Sprint-F11` | Dashboard Proveedor y Perfil (`P-19`, `P-26`) | Agente Frontend | `Sprint-F10` | `BLOQUEADO` |
| **Frontend** | `Sprint-F12` | CRUD de Catálogo del Proveedor (`P-20` a `P-23`) | Agente Frontend | `Sprint-F11` | `BLOQUEADO` |
| **Frontend** | `Sprint-F13` | Ventas Recibidas y Despacho (`P-24`, `P-25`) | Agente Frontend | `Sprint-F12` | `BLOQUEADO` |
| **Frontend** | `Sprint-F14` | Páginas de Error y Rutas (`P-36`, `P-37`) | Agente Frontend | `Sprint-F13` | `BLOQUEADO` |
| **Frontend** | `Sprint-F_Audit` | **Gate 2: Certificación Frontend (27 Pantallas)** | Agente Auditor Frontend | `Sprint-F14` | `BLOQUEADO` |
| **Transversal** | `Sprint-G_Final` | Integración E2E (Front Real + Back Real) | Coordinador Macro | `Gate 1` + `Gate 2` | `BLOQUEADO` |
| **Transversal** | `AUDITORIA_FINAL` | **Certificación Definitiva de Fase 03** | PO & Coordinador | `Sprint-G_Final` | `BLOQUEADO` |

---

## 3. Registro de Bloqueos y Decisiones Macro

| Fecha | Origen | Descripción del Bloqueo / Decisión | Acción Tomada | Resuelto Por | Estado |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 2026-11-13 | Granularidad | Sprints previos sobrecargaban demasiadas pantallas en un solo sprint | Re-dimensionamiento granular: 14 sprints de frontend (1-3 pantallas c/u) y 8 sprints de backend | PO / Usuario | `RESUELTO` |
| 2026-11-13 | Base Existente | Reconocimiento de los 14 endpoints ya construidos en `compunex-backend` | Creación de `Sprint-B01` enfocado en auditar y alinear la base existente | PO / Arquitecto | `RESUELTO` |
| 2026-11-13 | Desacoplamiento | Frontend desarrollará contra Prism Mock Server sobre OpenAPI | Desacoplamiento total; Frontend avanza en paralelo sin esperar a Backend | Arquitecto | `RESUELTO` |
