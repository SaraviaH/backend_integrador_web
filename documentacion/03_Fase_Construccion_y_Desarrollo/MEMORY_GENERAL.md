# MEMORY_GENERAL.md — Bitácora Maestra del Sistema (COMPUNEX B2B)

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Bitácora transversal del sistema. Registra el estado real de la construcción, lecciones aprendidas globales, resultados de Quality Gates y decisiones arquitectónicas de alto nivel.  
> **Regla de Operación:** Se actualiza al cerrar cada hito mayor o sprint general. Los detalles específicos residen en `MEMORY_BACKEND.md` y `MEMORY_FRONTEND.md`.

---

## 📍 1. Estado Macro del Sistema

* **Fase Activa:** Fase 03 · Construcción y Desarrollo Local
* **Última Actualización:** `2026-11-13 00:38`
* **Hito Global Actual:** Preparación de Sprints Generales y Desacoplamiento (Backend / Frontend).

---

## 📊 2. Matriz de Estado por Subsistema

| Subsistema | Estado General | Cobertura / Pruebas | Contrato API | Última Verificación |
| :--- | :---: | :---: | :---: | :---: |
| **Base de Datos / DDL** | 🟡 En Progreso | 7 tablas implementadas en JPA / 3 tablas diseñadas para Fase 03 | 100% Alineado con `CONTRATOS_JSON.md` | `2026-11-12` |
| **Backend / API (`compunex-backend`)** | 🟡 En Progreso | 59 tests JUnit pasando en verde (`BUILD SUCCESS`) | 14 existentes / 10 por implementar (Total 24) | `2026-11-12` |
| **Frontend / UI (`compunex-frontend`)** | ⬜ Pendiente | Arquitectura Angular por capas definida + 9 pantallas Stitch exportadas | Mapeado 1:1 con DTOs de transporte | — |
| **Integración E2E** | ⬜ Pendiente | Pendiente de integración entre Angular y Spring Boot | Enlace Local (`localhost:8080`) | — |

---

## 🚦 3. Registro de Quality Gates (Auditorías de Hito)

| Hito Auditado | Fecha | Semáforo Final | Rojos Resueltos | Deuda Ámbar Asumida | Dictamen |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Auditoría Fase 01 ↔ 02** | `2026-11-13` | 🟢 Verde | Mapeo de 14 RF, 4 RNF, 24 Endpoints y 10 Tablas | `DT-01` (Perfiles/Secretos) y `DT-02` (Motor BD) | **Aprobado para Fase 03** |
| **Auditoría 1: Backend Core** | Pendiente | — | — | — | Pendiente de cierre Sprint-B01..B03 |
| **Auditoría 2: Frontend Base** | Pendiente | — | — | — | Pendiente de cierre Sprint-F01..F03 |
| **Auditoría Final: Cierre E2E**| Pendiente | — | — | — | Pendiente previo a empaquetado final |

---

## ⚠️ 4. Deuda Técnica Transversal (Seguimiento Activo)

| ID | Subsistema Afectado | Descripción de la Deuda | Severidad | Plan de Mitigación |
| :---: | :--- | :--- | :---: | :--- |
| **DT-G01** | Backend Config | Credenciales de base de datos y `jwt.secret` en texto plano en `application.properties`. | Alta | Resolver en `Sprint-G01` / `Sprint-B01` separando `application-dev.properties` y `application-prod.properties` con `${...}`. |
| **DT-G02** | Persistencia BD | Motor configurado es PostgreSQL; rúbrica de curso menciona MySQL con usuario ≠ `root`. | Alta | Resolver en `Sprint-G02` confirmando driver/dialecto y validando tests contra motor real. |
| **DT-G03** | Frontend Setup | Creación inicial de workspace Angular con estructura `kebab-case` y estilos SASS/Tailwind. | Media | Resolver en `Sprint-G01` / `Sprint-F01`. |
