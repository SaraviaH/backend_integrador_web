# SPEC — Sprint-QA01: [Nombre del Sprint de Pruebas]

> **Área Técnica:** QA, Validación & Testing  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Objetivo:** [Describir en 1 o 2 frases qué flujos, contratos o atributos de calidad se validan en este sprint].  
> **Criterio de Cierre (DoD):** 100% de los escenarios probados, cero bugs críticos abiertos, y evidencias documentadas en `INFORME_EJECUCION_PRUEBAS.md`.

---

## 📋 1. Alcance de las Pruebas

* **Incluye:**
  * [Módulos, endpoints, flujos de usuario o componentes bajo prueba].
  * [Pruebas automatizadas de regresión y contratos].
  * [Pruebas manuales exploratorias en dispositivos reales].
* **NO incluye:**
  * [Módulos fuera de este sprint o funcionalidades no implementadas].

---

## 👥 2. Matriz de Tareas: Humano vs Agente de IA

> [!IMPORTANT]
> **Intervención Humana Obligatoria:** Este sprint exige la colaboración activa entre el agente de IA y el desarrollador/PO.

| Tipo de Tarea | Responsable | Tarea Concreta | Justificación / Herramienta |
| :---: | :---: | :--- | :--- |
| **🤖 Automatizada** | **Agente IA** | *[Generar / ejecutar suite de pruebas automatizadas]* | Playwright / Vitest / Jest / Pytest |
| **🤖 Automatizada** | **Agente IA** | *[Ejecutar escaneo de seguridad SAST y dependencias]* | `npm audit`, `pip-audit`, `gitleaks` |
| **🤖 Automatizada** | **Agente IA** | *[Fuzzing automático de schemas OpenAPI]* | `schemathesis` contra endpoints locales |
| **👤 Manual** | **Desarrollador** | *[Probar manualmente el endpoint en Postman/curl]* | Comprobar respuestas y validaciones reales |
| **👤 Manual** | **QA / PO** | *[Prueba de usabilidad en smartphone físico real]* | Validar ergonomía con el pulgar en red 4G |
| **👤 Manual** | **Product Owner** | *[Revisión exploratoria de negocio y aprobación]* | Validación soberana del criterio de aceptación |

---

## 🧪 3. Escenarios de Validación (Given-When-Then)

### E1 — [Nombre del Caso Principal de Prueba]
* **Dado** [el estado inicial del sistema en local o Staging]
* **Cuando** [se ejecuta la acción de prueba con datos válidos]
* **Entonces** [el resultado observable cumple estrictamente con el contrato y el requisito funcional].

### E2 — [Nombre del Caso de Límite o Error]
* **Dado** [un estado de error, datos inválidos o desconexión de red]
* **Cuando** [el usuario o script intenta la operación]
* **Entonces** [el sistema responde de forma controlada, sin caídas (crash) y con mensaje amigable].

---

## ✅ 4. Definition of Done (DoD) de este Sprint de QA

- [ ] Todas las tareas automatizadas ejecutadas y pasando al 100% en verde.
- [ ] Todas las tareas manuales completadas y verificadas por la persona asignada.
- [ ] Defectos detectados registrados en [`../../MEMORY_QA.md`](../../MEMORY_QA.md) y resueltos.
- [ ] Evidencias anexadas a [`../../INFORME_EJECUCION_PRUEBAS.md`](../../INFORME_EJECUCION_PRUEBAS.md).
- [ ] Visto bueno explícito del Product Owner / Tech Lead.
