# MEMORY.md — Bitácora Viva del Sistema y Memoria Continua (COMPUNEX B2B)

> **Cambio de alcance:** La moderación administrativa de productos fue retirada por decisión del usuario. Las referencias técnicas existentes a `admin/products` o `motivo_moderacion` describen el diseño o implementación anterior y están pendientes de revisión; no son funciones objetivo vigentes.

> **Propósito:** Registro persistente del estado real del software, lecciones aprendidas, deuda técnica y decisiones operativas.  
> **Alcance del Proyecto:** Fases **01 a 04** del SDLC (hasta Pruebas y Validación Local).

---

## 📍 1. Estado Actual de Ejecución

* **Fase Activa del SDLC:** `Fase 03 Completada e Integrada E2E (v1.0.0-mvp) — Lista para Fase 04 QA`
* **Rama Git Principal:** `integracion/e2e` (tag `v1.0.0-mvp`)
* **Última Actualización:** `2026-11-13 05:10`
* **Responsable / Equipo:** `Grupo 02 — Desarrollo Web Integrado (Sección 48942)`

---

## 📊 2. Matriz de Estado por Componente y Fase

| Componente / Entregable | Fase SDLC | Estado | Última Verificación | Evidencia / Notas |
| :--- | :---: | :---: | :---: | :--- |
| **Problema y Alcance (`README_RETO.md`)** | 01 | ✅ Verificado | `2026-11-12` | Problemática B2B, actores, módulos y límites definidos |
| **Catálogo de Requisitos (`RF`/`RNF`)** | 01 | ✅ Verificado | `2026-11-12` | `RF-001..RF-010` y `RNF-001..RNF-004` con sintaxis EARS |
| **Viabilidad, Riesgos y Priorización** | 01 | ✅ Verificado | `2026-11-12` | Matriz de riesgos y priorización MoSCoW completadas |
| **Modelo de Dominio (`DOMAIN.md`)** | 02 | ✅ Verificado | `2026-11-12` | 7 entidades reales, enums y reglas `RN-001..RN-008` |
| **Arquitectura del Sistema (`ARCHITECTURE.md`)** | 02 | ✅ Verificado | `2026-11-12` | Back-end en capas, Front-end Angular, BD ER, Seguridad JWT y APIs |
| **Stack Congelado (`TECH_STACK.md`)** | 02 | ✅ Verificado | `2026-11-13` | Java 21 + Spring Boot 3.5.16 + PostgreSQL 18 + Angular 18 Standalone |
| **Contratos de API (`CONTRATOS_JSON.md`)** | 02 | ✅ Verificado | `2026-11-13` | 24 endpoints REST Core + 2 endpoints Media (`Sprint-B09`) |
| **Auditoría de Coherencia (Fase 1 ↔ 2)** | 02 → 03 | ✅ Verificado | `2026-11-12` | Trazabilidad completa |
| **Construcción Back-end (`compunex-backend`)** | 03 | ✅ Verificado | `2026-11-13` | `AUDITORIA_1.md` APROBADO; refactor SRP (`03107f8`), `83/83` tests JUnit + Swagger `200 OK` |
| **Construcción Front-end (`compunex-frontend`)** | 03 | ✅ Verificado | `2026-11-13` | `AUDITORIA_2.md` APROBADO; 27 pantallas MVP, `ng build` (`0` errores) con `useMock: false` |
| **Integración E2E (`Sprint-G_Final`)** | 03 | ✅ Verificado | `2026-11-13` | 5 flujos E2E en vivo en Chromium + Spring Boot + PostgreSQL (`AUDITORIA_FINAL.md` APROBADO) |
| **Validación y QA Local** | 04 | 🟡 En Progreso | `2026-11-13` | Evidencias E2E de Fase 03 emitidas; pendiente consolidación documental formal de Fase 04 |

*Convención de estados: ⬜ Pendiente · 🟡 En Progreso · ✅ Verificado / En Verde · 🛑 Bloqueado*

---

## 📝 3. Bitácora de Incrementos Registrados en Código

### [2026-11-13] Integración E2E Final Front ↔ Back ↔ PostgreSQL (`Sprint-G_Final`, tag `v1.0.0-mvp`)
* **Rama:** `integracion/e2e` (merge previo `246293e`, base backend `b84f1bf`, navbar fix `f608c57`)
* **Cambios clave de integración:**
  - `JwtTokenProvider`: inclusión de claims `roles` y `tienePerfilProveedor` junto a `rol`.
  - `environment.ts`: `useMock: false`, `apiUrl: 'http://localhost:8080/api/v1'`, `version: '1.0.0-mvp'`.
  - Alineación 1:1 de contratos en servicios (`auth-api`, `catalog-api`, `order-api`, `provider-api`, `media-api`), normalización de roles (`role.guard.ts`, `auth-state.service.ts`), cálculo directo IGV `18%` (`cart-state.service.ts`), limpieza de fallbacks mock en producción e inputs completos en `activate-provider`, `provider-product-form` (categoría string) y `store-navbar`.
  - Validación E2E en vivo (Chrome Headless + Spring Boot + PostgreSQL `compunex_b2b`): 74 peticiones HTTP reales, 0 errores 500, 0 excepciones JS, generación de `PED-2026-000003` y subórdenes `SIM-F001-00000005` / `SIM-F001-00000006`, upload multipart PNG y transición de despacho hasta `ENTREGADO`.

### [2026-11-12] Back-end Core — Módulos Auth, Perfiles y Catálogo (`compunex-backend`)
* **Commit de referencia:** `deb49c6` (Merge PR #13) y `03107f8` (Refactor SRP)
* **Avance implementado en código:**
  - Auth corporativa (`login`, `register-company`, `me`, `password`), `ProviderProfileController`, `CategoriaController`, `ProductoPublicoController`, `ProductoProveedorController`, `OrderController` (Split Order), `ProviderSalesController`, `MediaController`, `AdminProductoController`, Seguridad JWT, `AuditAspect` y 83 pruebas JUnit.

---

## ⚠️ 4. Deuda Técnica y Observaciones

| ID | Componente | Descripción de la Deuda | Severidad | Plan de Mitigación |
| :--- | :--- | :--- | :---: | :--- |
| **DT-01** | `application.properties` | Credenciales de BD y `jwt.secret` locales en texto plano sin perfiles `dev`/`prod`. | Media | Externalizar con variables de entorno en despliegue productivo (Fase 05). |
| **DT-02** | `pom.xml` / BD | Sistema opera en PostgreSQL 18 (`compunex_b2b`) en lugar de MySQL XAMPP. | Baja | Mantener PostgreSQL salvo requerimiento expreso de migración del docente. |
| **DT-03** | `app.component.spec.ts` | Spec plantilla de Angular CLI (`Hello, compunex-frontend`) sin actualizar frente al Shell actual (`ng build` pasa limpio con `0` errores). | Baja | Actualizar `app.component.spec.ts` en Fase 04 QA si se exige suite Jasmine al 100%. |

---

## ❓ 5. Preguntas Abiertas para el Product Owner / Docente

* [ ] `[PREGUNTA-01]`: ¿Se mantiene PostgreSQL o es obligatorio migrar a MySQL con un usuario dedicado distinto de `root` para la entrega ATF3?
* [x] `[PREGUNTA-02]`: **Resuelto (`2026-11-12`):** Se adopta **Opción B (Full Back + BD)** con modelo *Split Order* (1 orden padre + N sub-órdenes/facturas simuladas por proveedor). Contratos JSON y esquema ER documentados en Fase 02 (`CONTRATOS_JSON.md` y `03_Base_de_Datos/ARCHITECTURE.md`) para implementar en Fase 03.
