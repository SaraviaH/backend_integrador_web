# 01. Pruebas de Aceptación y Escenarios E2E

> **Área Técnica:** Calidad de Producto & BDD  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Validar que los recorridos completos de usuario cumplen con los Requisitos Funcionales (`RF-XXX`) aprobados en la Fase 01, simulando la interacción de punta a punta desde la interfaz hasta la persistencia.

---

## 🎯 1. Principios de Pruebas E2E

* **Enfocadas en Valor de Negocio:** No prueban detalles de implementación interna; prueban lo que el usuario ve y experimenta.
* **Flujos Críticos Primero (Criterio 80/20):** Automatizar primero los recorridos vitales que no pueden fallar (ej. Registro, Búsqueda, Creación de recurso, Transacción principal).
* **Entorno Reproducible:** Deben poder correr en local mediante headless browsers (Playwright, Cypress, Puppeteer) o herramientas móviles (Maestro, Appium).

---

## 📋 2. Matriz de Cobertura E2E vs Requisitos Funcionales

| ID Requisito | Nombre del Flujo | Herramienta E2E | Archivo de Prueba | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **RF-001** | *[Flujo de Onboarding y Registro]* | Playwright / Cypress | `tests/e2e/auth.spec.ts` | `[Aprobado / Pendiente]` |
| **RF-002** | *[Flujo de Consulta y Filtrado]* | Playwright / Cypress | `tests/e2e/catalog.spec.ts` | `[Aprobado / Pendiente]` |
| **RF-003** | *[Flujo de Transacción Principal]* | Playwright / Cypress | `tests/e2e/transaction.spec.ts` | `[Aprobado / Pendiente]` |

---

## 🧪 3. Plantilla de Escenario E2E (Sintaxis Gherkin)

```gherkin
Característica: [Nombre del Flujo Principal]
  Como [Rol de Usuario]
  Quiero [Acción que realiza en la interfaz]
  Para [Beneficio de negocio esperado]

  Escenario: Flujo exitoso de punta a punta
    Dado que el usuario navega a la página principal
    Cuando completa el formulario con datos válidos
    Y hace clic en el botón de confirmación
    Entonces la interfaz muestra el mensaje de confirmación
    Y el registro aparece visible en la lista de elementos
```
