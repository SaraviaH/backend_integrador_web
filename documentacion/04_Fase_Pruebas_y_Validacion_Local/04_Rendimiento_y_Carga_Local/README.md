# 04. Pruebas de Rendimiento, Latencia y Carga Local

> **Área Técnica:** Performance & Reliability QA  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Validar que el sistema cumple con los Requisitos No Funcionales de rendimiento (`RNF-XXX`), midiendo tiempos de respuesta, consumo de memoria y comportamiento bajo concurrencia moderada en local.

---

## ⚡ 1. Principios de Rendimiento Local

* **Validar Métricas Objetivas:** Contrastar los tiempos reales contra las métricas definidas en `01_Fase_Planificacion_y_Analisis/02_Requisitos_y_Alcance/README.md`.
* **Pruebas de Carga en Local:** Simular concurrencia (10 a 100 usuarios virtuales simultáneos) contra la API y base de datos local para detectar consultas lentas (queries N+1) o bloqueos transaccionales.
* **Perfiles de Rendimiento:** Analizar picos de CPU y memoria en el servidor bajo carga sostenida.

---

## 🛠️ 2. Herramientas Recomendadas

* **Pruebas de Carga HTTP:** `k6`, `autocannon`, `wrk`, `Apache JMeter`.
* **Métricas Web en Cliente (Core Web Vitals):** Lighthouse CLI (LCP, FID/INP, CLS).
* **Diagnóstico de Base de Datos:** `EXPLAIN ANALYZE` en PostgreSQL para consultas críticas.

---

## 📋 3. Matriz de Validación de Rendimiento (RNF)

| ID RNF | Atributo / Métrica | Umbral Aprobado | Resultado Obtenido en Prueba | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RNF-001** | Latencia de API (`GET /v1/recursos`) | p95 < 200 ms | `p95 = 85 ms` | `[Aprobado]` |
| **RNF-002** | Rendimiento transaccional (`POST`) | p95 < 500 ms | `p95 = 140 ms` | `[Aprobado]` |
| **RNF-003** | Rendimiento Frontend (Time to Interactive) | TTI < 2.0 s en red simulada | `TTI = 1.3 s` | `[Aprobado]` |
