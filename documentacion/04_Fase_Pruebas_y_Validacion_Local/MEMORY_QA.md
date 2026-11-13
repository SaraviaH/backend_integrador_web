# MEMORY_QA.md — Bitácora Viva de Pruebas y Defectos

> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Registro continuo del estado real de las pruebas, suites automatizadas, defectos encontrados, regresiones resueltas y lecciones aprendidas de calidad.  
> **Regla de Operación:** Se actualiza al culminar cada sprint de QA. Cero bugs críticos abiertos al finalizar la fase.

---

## 📍 1. Estado Actual de la Validación

* **Sprint Activo de QA:** `[Sprint-QA01 | Sprint-QA02 | Sprint-QA03 | Ninguno]`
* **Estado de la Suite Local:** `[✅ Verde | 🟡 En Ejecución | 🔴 Fallos Detectados]`
* **Estado del Entorno de Staging:** `[Desplegado en Railway/Supabase | Pendiente]`
* **Última Actualización:** `YYYY-MM-DD HH:mm`
* **Responsable:** `[QA Lead / Product Owner]`

---

## 🐛 2. Registro de Defectos y Hallazgos (Bug Tracker Local)

| ID Bug | Sprint Origen | Componente | Descripción del Fallo | Severidad | Responsable Corrección | Estado | Solución Verificada |
| :--- | :---: | :--- | :--- | :---: | :--- | :---: | :--- |
| **BUG-QA01** | `Sprint-QA01` | Backend / API | `Error 500 al enviar payload vacío en vez de 400 RFC 9457` | Media | `Backend Lead` | `[Resuelto]` | Validación de DTO agregada |
| **BUG-QA02** | `Sprint-QA02` | Frontend / UI | `Botón principal con contraste 3.8:1 en lugar de 4.5:1` | Media | `Frontend Lead` | `[Resuelto]` | Token de color ajustado |
| **BUG-QA03** | `Sprint-QA05` | Staging / Red | `Desfase de scroll en smartphone con ancho < 360px` | Baja | `Frontend Lead` | `[Resuelto]` | Flexbox ajustado |

*Severidades: 🔴 Bloqueante / Crítica · 🟠 Alta · 🟡 Media · 🟢 Baja*

---

## 📝 3. Bitácora de Sprints de QA Completados

### [YYYY-MM-DD] Sprint-QA0X: [Nombre del Sprint de Pruebas]
* **Entregables validados:**
  - [x] Suite automatizada ejecutada al 100%.
  - [x] Comprobación manual realizada por el desarrollador/PO.
  - [x] Evidencias archivadas en `INFORME_EJECUCION_PRUEBAS.md`.
* **Observaciones:** Resumen breve de la estabilidad del incremento.
