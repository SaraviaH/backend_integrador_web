# MEMORY_BACKEND.md — Bitácora Local del Agente Backend

> **Propósito:** Registro técnico persistente para el agente y desarrolladores de backend. Mantiene el estado de las suites de prueba, cobertura de endpoints y deuda técnica local sin contaminar otras áreas.

---

## 📍 1. Estado del Backend

* **Rama Activa:** `feature/backend-...`
* **Última Actualización:** `YYYY-MM-DD HH:mm`
* **Tests Automatizados:** `[X de X en verde]` ✅
* **Linter / Análisis Estático:** `[0 errores, 0 advertencias]` ✅

---

## 📊 2. Cobertura de Endpoints de la API

| Endpoint | Método | Estado | Tests Asociados | Notas de Contrato |
| :--- | :---: | :---: | :--- | :--- |
| `/v1/salud` | `GET` | ✅ Verificado | `SaludControllerTest` | Responde 200 OK |
| `/v1/[recursos]` | `GET` | ⬜ Pendiente | `RecursosControllerTest` | Paginación requerida |
| `/v1/[recursos]` | `POST` | ⬜ Pendiente | `CrearRecursoTest` | Valida Idempotency-Key |

---

## ⚠️ 3. Deuda Técnica Local de Backend

| ID | Componente / Archivo | Descripción de la Deuda | Severidad | Plan de Mitigación |
| :---: | :--- | :--- | :---: | :--- |
| **DT-B01** | `[ServicioEjemplo.java]` | *[Falta optimizar consulta para evitar N+1]* | Media | Resolver en sprint de cierre de backend |

---

## ❓ 4. Dudas Técnicas de Backend

* [ ] `[DUDA-B01]`: *[Duda técnica sobre índices o concurrencia]*
