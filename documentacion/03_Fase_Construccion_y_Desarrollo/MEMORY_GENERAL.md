# MEMORY_GENERAL.md — Plantilla: Bitácora Maestra del Sistema

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Bitácora transversal del sistema. Registra el estado real de la construcción, lecciones aprendidas globales, resultados de Quality Gates y decisiones arquitectónicas de alto nivel.  
> **Regla de Operación:** Se actualiza al cerrar cada hito mayor o sprint general, **nunca al final del proyecto**. Los detalles técnicos específicos de código viven en `MEMORY_BACKEND.md` o `MEMORY_FRONTEND.md`.

---

## 📍 1. Estado Macro del Sistema

* **Fase Activa:** Fase 03 · Construcción y Desarrollo Local
* **Última Actualización:** `YYYY-MM-DD HH:mm`
* **Hito Global Actual:** `[Fase 1: Cimientos BD | Fase 2: Construcción Paralela | Fase 3: Integración E2E]`

---

## 📊 2. Matriz de Estado por Subsistema

| Subsistema | Estado General | Cobertura / Pruebas | Contrato API | Última Verificación |
| :--- | :---: | :---: | :---: | :---: |
| **Base de Datos / DDL** | ⬜ Pendiente | `[X tablas migradas]` | 100% Alineado | — |
| **Backend / API** | ⬜ Pendiente | `[X/X tests en verde]` | `[X/12 endpoints]` | — |
| **Frontend / UI** | ⬜ Pendiente | `[X/X tests de widgets]` | 100% Mockeado | — |
| **Integración E2E** | ⬜ Pendiente | `[0 crashes en ensayos]` | Enlace Real | — |

---

## 🚦 3. Registro de Quality Gates (Auditorías de Hito)

| Hito Auditado | Fecha | Semáforo Final | Rojos Resueltos | Deuda Ámbar Asumida | Dictamen |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Auditoría 1: Backend Core** | `YYYY-MM-DD` | 🟢 / 🟡 / 🔴 | *[Lista de correcciones]* | *[Deuda técnica anotada]* | `[Aprobado para continuar]` |
| **Auditoría 2: Frontend Base** | `YYYY-MM-DD` | 🟢 / 🟡 / 🔴 | *[Lista de correcciones]* | *[Deuda técnica anotada]* | `[Aprobado para continuar]` |
| **Auditoría Final: Cierre E2E**| `YYYY-MM-DD` | 🟢 / 🟡 / 🔴 | *[Lista de correcciones]* | *[Deuda técnica anotada]* | `[Aprobado para Fase 04/05]` |

---

## ⚠️ 4. Deuda Técnica Transversal (No Bloqueante)

|     ID     | Subsistema Afectado | Descripción de la Deuda                  | Severidad | Plan de Mitigación               |
| :--------: | :------------------ | :--------------------------------------- | :-------: | :------------------------------- |
| **DT-G01** | *[General]*         | *[Ej. Automatizar script de seed local]* |   Baja    | Resolver antes del release final |
|            |                     |                                          |           |                                  |

---

## ❓ 5. Preguntas Abiertas Transversales para el Product Owner

* [ ] `[PREGUNTA-G01]`: *[Duda transversal de producto o límites de alcance que afecta a más de un subsistema]*
