# AUDITORIA_HITO_TEMPLATE.md — Plantilla: Quality Gate de Hito de Construcción

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Plantilla neutral para ejecutar auditorías de hito técnico (Quality Gates) al cerrar un subsistema (Backend Core, Frontend Base o Integración Final) antes de permitir el inicio de la siguiente etapa.  
> **Regla de Oro:** **Cero rojos abiertos.** Ningún hito se da por cerrado si existen hallazgos críticos de semáforo rojo sin resolver.

---

## 📋 1. Metadatos del Hito Auditado

* **Hito / Subsistema:** `[Backend Completo | Frontend Base | Integración E2E Final]`
* **Fecha de Auditoría:** `YYYY-MM-DD`
* **Rama de Inspección:** `[develop o feature/nombre-hito]`
* **Auditor / Responsable:** `[Tech Lead / Agente Revisor / PO]`
* **Veredicto General:** `[APROBADO (0 Rojos) | OBSERVADO CON BLOQUEOS]`

---

## 🔴 2. Rojos (Hallazgos Críticos Bloqueantes)

*Los rojos representan fallos que rompen contratos, producen errores 500 no controlados, violan invariantes de negocio o introducen features fantasma. **Deben corregirse inmediatamente con commits dedicados.***

| # | Hallazgo Técnico | Por qué es Rojo (Impacto / Severidad) | Corrección Aplicada | Commit de Arreglo |
| :-: | :--- | :--- | :--- | :--- |
| **R1** | *[Descripción del fallo técnico]* | *[Ej. Un tipo erróneo devolvía HTTP 500 y bloqueaba la cola de reintentos]* | *[Manejo adecuado de excepción devolviendo RFC 9457]* | `[hash_commit]` |
| **R2** | *[Incoherencia con el contrato]* | *[Ej. Campo ausente en la respuesta JSON respecto a OpenAPI]* | *[Alineación exacta del DTO con el contrato]* | `[hash_commit]` |

---

## 🟡 3. Ámbar (Deuda Técnica Tolerable - No Bloqueante)

*Los ámbares son observaciones menores, optimizaciones o advertencias de linter que no impiden el funcionamiento del sistema en este hito. **Pasan formalmente a la tabla de Deuda Técnica en `MEMORY.md`.***

| # | Observación | Riesgo Asociado | Plan de Mitigación / En qué Sprint se Resuelve |
| :-: | :--- | :--- | :--- |
| **A1** | *[Ej. Falta paginación incremental en endpoint X]* | Posible lentitud con volumen masivo de datos | Resolver en Sprint de optimización previo a release |
| **A2** | *[Ej. Advertencia de estilo en linter]* | Mantenibilidad de código | Limpiar en sprint de pulido final |

---

## 🟢 4. Verde (Evidencia Demostrable y Objetiva)

*Comprobaciones objetivas que demuestran que el software funciona con hechos y no con suposiciones:*

| Eje de Calidad | Criterio de Aprobación | Resultado Obtenido | Evidencia Verificada |
| :--- | :--- | :---: | :--- |
| **Suite de Tests Automatizada** | 100% de tests en verde | `[X de X tests]` ✅ | Comando CLI ejecutado sin fallos ni omisiones |
| **Análisis Estático (Linter)** | 0 errores, 0 advertencias | 0 issues ✅ | Linter ejecutado en limpio |
| **Cumplimiento de Contratos** | 100% alineado con OpenAPI | Conforme ✅ | Inspección de rutas y esquemas JSON |
| **Aislamiento de Dominio** | Dominio sin frameworks | Conforme ✅ | Cero imports de infraestructura en capas puras |
| **¿Corre de punta a punta hoy?** | **Demostrable con datos nuevos** | **SÍ ✅** | Flujo completo probado en local con una entrada nueva |

---

## ✍️ 5. Dictamen y Decisiones del Product Owner

1. **Autorización de Pase:** ¿Se autoriza dar por cerrado este hito e iniciar la siguiente etapa?  
   `[SÍ / NO]`
2. **Deuda Técnica Asumida:** El PO revisa los ámbares y ratifica que quedan registrados en `MEMORY.md`.
3. **Firma / Aprobación:** `[Product Owner / Tech Lead - Fecha]`
