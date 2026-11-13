# MEMORY.md — Bitácora Viva del Sistema y Memoria Continua (COMPUNEX B2B)

> **Cambio de alcance:** La moderación administrativa de productos fue retirada por decisión del usuario. Las referencias técnicas existentes a `admin/products` o `motivo_moderacion` describen el diseño o implementación anterior y están pendientes de revisión; no son funciones objetivo vigentes.

> **Propósito:** Registro persistente del estado real del software, lecciones aprendidas, deuda técnica y decisiones operativas.  
> **Alcance del Proyecto:** Fases **01 a 04** del SDLC (hasta Pruebas y Validación Local).

---

## 📍 1. Estado Actual de Ejecución

* **Fase Activa del SDLC:** `Fase 02 documentada / Fase 03 en progreso (Back-end avanzado, pendiente cierre de perfiles/BD y Front-end)`
* **Rama Git Principal:** `main` (último merge PR #13 — `deb49c6`)
* **Última Actualización:** `2026-11-12 19:00`
* **Responsable / Equipo:** `Grupo 02 — Desarrollo Web Integrado (Sección 48942)`

---

## 📊 2. Matriz de Estado por Componente y Fase

| Componente / Entregable | Fase SDLC | Estado | Última Verificación | Evidencia / Notas |
| :--- | :---: | :---: | :---: | :--- |
| **Problema y Alcance (`README_RETO.md`)** | 01 | ✅ Verificado | `2026-11-12` | Problemática B2B, actores, módulos y límites definidos |
| **Catálogo de Requisitos (`RF`/`RNF`)** | 01 | ✅ Verificado | `2026-11-12` | `RF-001..RF-010` y `RNF-001..RNF-004` con sintaxis EARS |
| **Viabilidad, Riesgos y Priorización** | 01 | ✅ Verificado | `2026-11-12` | Matriz de riesgos y priorización MoSCoW completadas |
| **Modelo de Dominio (`DOMAIN.md`)** | 02 | ✅ Verificado | `2026-11-12` | 7 entidades reales, enums y reglas `RN-001..RN-006` |
| **Arquitectura del Sistema (`ARCHITECTURE.md`)** | 02 | ✅ Verificado | `2026-11-12` | Back-end en capas, Front-end Angular, BD ER, Seguridad JWT y APIs |
| **Stack Congelado (`TECH_STACK.md`)** | 02 | 🟡 En Progreso | `2026-11-12` | Java 21 + Spring Boot 3.5.16; pendiente confirmar PostgreSQL vs MySQL |
| **Contratos de API (`CONTRATOS_JSON.md`)** | 02 | ✅ Verificado | `2026-11-12` | 14 endpoints REST documentados (`Auth`, `Categories`, `Providers`, `Admin`) |
| **Auditoría de Coherencia (Fase 1 ↔ 2)** | 02 → 03 | ✅ Verificado | `2026-11-12` | Trazabilidad completa con observaciones abiertas registradas en DT |
| **Construcción Back-end (`compunex-backend`)** | 03 | 🟡 En Progreso | `2026-11-12` | 14 endpoints y 59 tests JUnit implementados; falta perfiles/env |
| **Construcción Front-end (Angular)** | 03 | ⬜ Pendiente | — | Proyecto Angular fuera de este workspace; pendiente de integración |
| **Validación y QA Local** | 04 | ⬜ Pendiente | — | Consolidación formal de evidencias JUnit, Postman y E2E |

*Convención de estados: ⬜ Pendiente · 🟡 En Progreso · ✅ Verificado / En Verde · 🛑 Bloqueado*

---

## 📝 3. Bitácora de Incrementos Registrados en Código

### [2026-11-12] Back-end Core — Módulos Auth, Perfiles y Catálogo (`compunex-backend`)
* **Commit de referencia:** `deb49c6` (Merge PR #13)
* **Avance implementado en código:**
  - `AuthController`: `POST /api/v1/auth/login`, `POST /api/v1/auth/register` (`/registro-proveedor`), `GET /api/v1/auth/me`, `PATCH /api/v1/auth/password`.
  - `CategoriaController`: `GET /api/v1/categories`, `GET /api/v1/categories/{id}`.
  - `ProductoProveedorController`: CRUD completo (`GET`, `GET /{id}`, `POST`, `PUT /{id}`, `PATCH /{id}/status`, `DELETE /{id}` lógico).
  - `AdminProductoController`: `GET /api/v1/admin/products`, `PATCH /api/v1/admin/products/{id}/status`.
  - Seguridad JWT (`JwtTokenProvider`, `JwtAuthenticationFilter`, `SecurityConfig`), `GlobalExceptionHandler` y 59 pruebas JUnit.

---

## ⚠️ 4. Deuda Técnica y Observaciones

| ID | Componente | Descripción de la Deuda | Severidad | Plan de Mitigación |
| :--- | :--- | :--- | :---: | :--- |
| **DT-01** | `application.properties` | Credenciales de BD y `jwt.secret` en texto plano sin perfiles `dev`/`prod`. | Alta | Externalizar con `${...}` y crear `application-dev.properties` / `application-prod.properties`. |
| **DT-02** | `pom.xml` / BD | Proyecto usa PostgreSQL; rúbrica ATF3 exige confirmar si se migra a MySQL con usuario ≠ `root`. | Alta | Confirmar criterio del docente y ajustar driver/dialecto si aplica. |
| **DT-03** | Front-end Angular | Proyecto Front-end no integrado en este repositorio; pendiente consumo real de APIs, interceptor y 404. | Alta | Integrar y validar en Fase 03/04 contra el Back-end local. |

---

## ❓ 5. Preguntas Abiertas para el Product Owner / Docente

* [ ] `[PREGUNTA-01]`: ¿Se mantiene PostgreSQL o es obligatorio migrar a MySQL con un usuario dedicado distinto de `root` para la entrega ATF3?
* [x] `[PREGUNTA-02]`: **Resuelto (`2026-11-12`):** Se adopta **Opción B (Full Back + BD)** con modelo *Split Order* (1 orden padre + N sub-órdenes/facturas simuladas por proveedor). Contratos JSON y esquema ER documentados en Fase 02 (`CONTRATOS_JSON.md` y `03_Base_de_Datos/ARCHITECTURE.md`) para implementar en Fase 03.
