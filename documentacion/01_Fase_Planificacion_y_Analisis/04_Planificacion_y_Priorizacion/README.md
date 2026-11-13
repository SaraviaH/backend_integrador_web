# Planificación y Priorización — COMPUNEX B2B

> **Fase del SDLC:** 01 · Planificación y Análisis de Requisitos  
> **Propósito:** Ordenar los requisitos funcionales y no funcionales mediante priorización dual (MoSCoW + puntaje 1-10) y definir el criterio de preparación (DoR) para la Fase 02.

---

## 📋 1. Matriz de Planificación por Etapas de Incremento

| Etapa del Incremento | Objetivo de la Iteración | IDs de Requisitos Asignados | Rango de Puntaje | Criterio de Salida |
| :---: | :--- | :---: | :---: | :--- |
| **Etapa 1 — Núcleo y Seguridad (Must Have)** | Autenticación JWT, registro de empresa/proveedor, categorías y catálogo público, listado y creación de productos. | `RF-001`, `RF-002`, `RF-004`, `RF-005`, `RF-007`, `RF-011`, `RNF-001`, `RNF-003` | **8 - 10 puntos** | Endpoints base operativos con seguridad por rol y pruebas JUnit en verde. |
| **Etapa 2 — Ciclo de Vida Completo y E-Commerce B2B (Should Have)** | Detalle técnico, actualización, cambio de estado, borrado lógico, sesión/clave, carrito multi-proveedor, checkout Split Order, historial y administración. | `RF-003`, `RF-006`, `RF-008`, `RF-009`, `RF-010`, `RF-012`, `RF-013`, `RF-014`, `RNF-002` | **6 - 9 puntos** | CRUD completo + flujo transaccional simulado + respuestas de error JSON consistentes. |
| **Etapa 3 — Experiencia Web Responsiva (Could/Should)** | Integración completa en Angular con UI responsiva, alertas amigables y página 404. | `RNF-002`, `RNF-004` | **5 - 7 puntos** | Flujo E2E funcional en escritorio y móvil (`375px`). |

---

## 🚦 2. Definición de Preparado (Definition of Ready - DoR para Fase 02)

- [x] El problema, actores y límites de alcance están documentados en [`../README_RETO.md`](../README_RETO.md).
- [x] Todos los requisitos tienen identificador único (`RF-001..RF-014`, `RNF-001..RNF-004`).
- [x] Los criterios de aceptación están definidos de forma verificable.
- [x] Los riesgos críticos (`RSK-01..RSK-04`) cuentan con estrategia de mitigación.
- [x] El alcance del incremento está acotado para avanzar a la Fase 02 (Diseño y Arquitectura).
