# INFORME_EJECUCION_PRUEBAS.md — Bitácora de Evidencias de QA

> **Proyecto:** `[Nombre del Proyecto]`  
> **Versión / Incremento:** `[v1.0.0-rc1 / Sprints 1 a 3]`  
> **Fecha de Ejecución:** `[AAAA-MM-DD HH:mm]`  
> **Ejecutado por:** `[Nombre del Evaluador / Agente QA]`  
> **Rama Evaluada:** `[develop | feature/*]`

---

## 📊 1. Resumen Ejecutivo de la Corrida

| Tipo de Prueba | Total Ejecutadas | Pasadas (Verde) | Fallidas (Rojo) | Omitidas | Tasa de Éxito (%) | Tiempo de Ejecución |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Unitarias (Backend)** | `[NN]` | `[NN]` | `[0]` | `[0]` | `100%` | `[X.Xs]` |
| **Unitarias (Frontend)** | `[NN]` | `[NN]` | `[0]` | `[0]` | `100%` | `[X.Xs]` |
| **Integración / APIs** | `[NN]` | `[NN]` | `[0]` | `[0]` | `100%` | `[X.Xs]` |
| **E2E / Aceptación** | `[NN]` | `[NN]` | `[0]` | `[0]` | `100%` | `[X.Xs]` |
| **Validación Staging** | `[NN]` | `[NN]` | `[0]` | `[0]` | `100%` | `[Manual]` |
| **TOTAL** | **[NN]** | **[NN]** | **[0]** | **[0]** | **100%** | **[Total]** |

---

## 📸 2. Evidencias de Ejecución Automatizada

### 2.1 Salida del Test Runner (Terminal Local)
```text
[Pegar la salida real del comando de pruebas: ej. pytest, vitest, npm test, flutter test]
PASS tests/unit/services/auth_service.test.ts
PASS tests/unit/services/orders_service.test.ts
PASS tests/integration/api/auth_controller.test.ts
Test Suites: 8 passed, 8 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        3.421 s
Ran all test suites.
```

### 2.2 Análisis de Cobertura de Código
* **Líneas (Statements):** `[XX.X%]`
* **Ramas (Branches):** `[XX.X%]`
* **Funciones:** `[XX.X%]`

---

## 📱 3. Evidencias de Pruebas en Staging (Pre-Producción)

| Flujo Probado | Dispositivo / Red | Comportamiento Observado | Estado |
| :--- | :--- | :--- | :---: |
| **Flujo 1: Registro y Login** | Smartphone real con 4G móvil | Registro exitoso, token emitido y sesión persistida en la nube. | ✅ Aprobado |
| **Flujo 2: Catálogo y Carrito** | Navegador móvil Chrome | Carga de productos en < 1.5s, imágenes visibles sin errores CORS. | ✅ Aprobado |
| **Flujo 3: Simulación de Pago** | Smartphone real con WiFi | Webhook de pasarela procesado correctamente en Railway. | ✅ Aprobado |
| **Flujo 4: Pérdida de Conexión** | Dispositivo en Modo Avión | UI notifica "Modo sin conexión" sin cierres inesperados (crash). | ✅ Aprobado |

---

## 🐛 4. Registro de Defectos Detectados y Resolución

| ID Bug | Módulo | Descripción del Fallo | Severidad | Estado | Solución Aplicada |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **BUG-01** | `Frontend` | Desfase de botón en pantallas con ancho < 360px | Baja | Resuelto | Ajuste de margen y padding flexible en CSS |
| **BUG-02** | `Backend` | Error 500 en lugar de 400 al enviar email sin arroba | Media | Resuelto | Agregado validador estricto con RFC 9457 |

---

## ⚖️ 5. Veredicto del Evaluador de QA

* [x] **Apto para Merge a Pre-Producción (`develop`):** Todos los tests locales en verde y flujos verificados.
* [ ] **Apto para Despliegue en Producción (`main`):** Requiere firma de [`AUDITORIA_CALIDAD_FASE4_A_FASE5.md`](AUDITORIA_CALIDAD_FASE4_A_FASE5.md).
