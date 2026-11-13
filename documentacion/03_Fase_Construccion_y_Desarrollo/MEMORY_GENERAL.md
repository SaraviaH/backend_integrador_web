# MEMORY_GENERAL.md — Estado Activo y Registro de Coordinación Macro (Fase 03)

> **Área:** Transversal / Coordinador Macro  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Propósito:** Registro dinámico del estado de ejecución de la Fase 03, control de Quality Gates, sincronización entre agentes de Backend y Frontend, y bitácora de bloqueos e integraciones.

---

## 1. Estado Global de la Fase 03

* **Estado de Fase:** `EN_PLANIFICACION_INICIAL` (Gate 0 Superado — Backlog Formalizado)
* **Modo de Trabajo:** Multi-Agente Desacoplado (Contract-First)
* **Línea Base Congelada:**
  * Contratos JSON: 24 endpoints (`CONTRATOS_JSON.md` + `compunex-openapi.yaml`)
  * Modelo de Datos: 10 tablas MySQL (`MODELO_Y_DICCIONARIO_BD.md`)
  * Pantallas Frontend: 27 pantallas MVP (`PROMPTS_GOOGLE_STITCH_TEMPLATE.md`)
  * Reglas de Negocio: 8 reglas (`RN-001` a `RN-008` en `DOMAIN.md`)

---

## 2. Tablero de Control de Sprints y Quality Gates

| Track | ID Sprint | Título / Alcance | Agente Responsable | Dependencia | Estado | Quality Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Transversal** | `Sprint-G01` | Setup y Entorno (Spring + Angular + MySQL) | Agente DevOps / Setup | Ninguna | `PENDIENTE` | Gate Inicial (Healthcheck 200) |
| **Transversal** | `Sprint-G02` | Base de Datos DDL (10 Tablas + Seeds) | Agente Datos / DBA | `Sprint-G01` | `PENDIENTE` | Gate DDL (10 tablas verificadas) |
| **Backend** | `Sprint-B01` | Auth y Seguridad (Endpoints 1..4, 15..17) | Agente Backend | `Sprint-G02` | `BLOQUEADO` | — |
| **Backend** | `Sprint-B02` | Catálogo B2B (Endpoints 5..6, 18..19) | Agente Backend | `Sprint-B01` | `BLOQUEADO` | — |
| **Backend** | `Sprint-B03` | Carrito y Split-Order (Endpoints 20..22) | Agente Backend | `Sprint-B02` | `BLOQUEADO` | — |
| **Backend** | `Sprint-B04` | Panel Proveedor y Despacho (Endpoints 7..12, 23..24) | Agente Backend | `Sprint-B03` | `BLOQUEADO` | — |
| **Backend** | `Sprint-B05` | Auditoría y Admin (Endpoints 13..14) | Agente Backend | `Sprint-B04` | `BLOQUEADO` | — |
| **Backend** | `Sprint-B_Audit` | Quality Gate 1: Backend Core Completo | Agente Auditor Backend | `Sprint-B05` | `BLOQUEADO` | **Gate 1 (24/24 passing)** |
| **Frontend** | `Sprint-F01` | Setup UI, Core Shell y Auth (P-01..P-03, P-06..P-07) | Agente Frontend | `Sprint-G01` (vía Mock) | `BLOQUEADO` | — |
| **Frontend** | `Sprint-F02` | Catálogo B2B y Detalle (P-04..P-05) | Agente Frontend | `Sprint-F01` | `BLOQUEADO` | — |
| **Frontend** | `Sprint-F03` | Carrito Reactivo y Proveedores (P-09) | Agente Frontend | `Sprint-F02` | `BLOQUEADO` | — |
| **Frontend** | `Sprint-F04` | Checkout, Split Order y Factura (P-10..P-15) | Agente Frontend | `Sprint-F03` | `BLOQUEADO` | — |
| **Frontend** | `Sprint-F05` | Paneles Proveedor y Perfiles (P-16..P-26, P-36..P-37) | Agente Frontend | `Sprint-F04` | `BLOQUEADO` | — |
| **Frontend** | `Sprint-F_Audit` | Quality Gate 2: Frontend UI Completo | Agente Auditor Frontend | `Sprint-F05` | `BLOQUEADO` | **Gate 2 (27/27 screens)** |
| **Transversal** | `Sprint-G_Final` | Integración E2E (Front Real + Back Real) | Coordinador Macro | `Gate 1` + `Gate 2` | `BLOQUEADO` | **Gate Final (Entrega)** |

---

## 3. Registro de Bloqueos y Decisiones Macro

| Fecha | Origen | Descripción del Bloqueo / Decisión | Acción Tomada | Resuelto Por | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-11-13 | Arquitectura | División en tracks paralelos Backend vs Frontend para trabajo multi-agente | Creación de `.sprints_generales/`, `01_Backend/.sprints/`, `02_Frontend/.sprints/` | PO / Arquitecto | `RESUELTO` |
| 2026-11-13 | Integración | Frontend desarrollará contra Prism Mock Server sobre `compunex-openapi.yaml` | Desacoplamiento total; Frontend no espera a que Backend termine sus sprints | Arquitecto | `RESUELTO` |

---

## 4. Instrucciones para Agentes al Actualizar este Archivo
1. Al iniciar un Sprint, cambiar su estado de `PENDIENTE` a `EN_PROGRESO` en la tabla.
2. Al culminar un Sprint, verificar que su `SPEC.md` tenga todos los criterios DoD cumplidos y marcar `COMPLETADO`.
3. Si un agente encuentra una divergencia con los contratos o modelo de BD, registrar el bloqueo en la Sección 3 inmediatamente antes de modificar cualquier especificación.
