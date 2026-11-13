# SPEC — Plantilla: Especificación Técnica de Incremento (SDD)

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Ámbito:** Cualquier sprint (General, Backend o Frontend)  
> **Propósito:** Actuar como el **contrato ejecutable** entre el Product Owner y el Development Team/Agente IA para el sprint activo.  
> **Regla de Oro:** **Cero líneas de código sin un SPEC aprobado.** El agente no implementa nada que no esté explícitamente contenido en esta especificación.

---

## 🎯 1. Objetivo del Sprint

*[Describir en una o dos frases claras qué capacidad funcional o técnica quedará demostrable al cerrar este sprint]*
> **Ejemplo:** *"Al cerrar este sprint, un usuario puede autenticarse y registrar un nuevo recurso en su almacenamiento local, con sincronización diferida y validación de invariantes probada en verde."*

---

## 📋 2. Alcance del Incremento

* **Requisitos Funcionales Incluidos:** `[RF-001, RF-002]` *(Referencias a Fase 01)*
* **Requisitos No Funcionales / Atributos:** `[RNF-001 (Operatividad local), RNF-002 (Latencia < 1.5s)]`
* **Lo que queda EXPLÍCITAMENTE FUERA de este Sprint:**  
  * *[Funcionalidad o detalle que NO se construirá ahora para evitar Scope Creep]*
  * *[No construir componentes adicionales aunque el archivo esté abierto]*

---

## 🔌 3. Contratos y Entidades Afectadas

* **Rutas de API tocadas:** `[POST /v1/recursos, GET /v1/recursos/{id}]` *(Ver `openapi_template.yaml`)*
* **Entidades y Schemas:** `[RecursoRequest, RecursoResponse]` *(Ver `CONTRATOS_JSON.md`)*
* **Tablas de Base de Datos / Migración:** `[Tabla 'recursos' en migración V1__init.sql]`
* **Reglas de Negocio a Proteger:** `[RN-001, RN-002]` *(Ver `DOMAIN.md`)*

---

## 👥 4. División de Responsabilidades: Manual vs Agente IA

| Tipo de Tarea | Responsable | Tarea Concreta | Por qué tiene esa asignación |
| :---: | :---: | :--- | :--- |
| **Manual** | **Product Owner / Equipo** | *[Aprobar catálogo de categorías fijas o textos clave]* | Es decisión de producto y negocio, no un detalle técnico. |
| **Manual** | **Product Owner / Equipo** | *[Configurar secretos locales en archivo `.env`]* | Seguridad: la IA no debe manipular credenciales privadas. |
| **Automatizada** | **Agente IA (Desarrollo)** | *[Implementar servicio puro con TDD Rojo → Verde]* | Ejecución técnica contra escenarios del SPEC. |
| **Automatizada** | **Agente IA (Desarrollo)** | *[Implementar endpoints y controladores según OpenAPI]*| Codificación estricta del contrato. |

---

## 🧪 5. Escenarios de Comportamiento (Sintaxis Gherkin Given-When-Then)

*(Estos escenarios son la base directa para los tests unitarios y de integración de TDD)*

### E1 — [Nombre del Caso Principal / Happy Path]
* **Dado** *[el estado inicial o precondición válida del sistema]*
* **Cuando** *[el usuario o cliente ejecuta la acción X con datos válidos]*
* **Entonces** *[el sistema responde con éxito 200/201, persiste los datos y emite el evento esperado]*

### E2 — [Nombre del Caso de Validación / Datos Inválidos]
* **Dado** *[un payload o petición con campos obligatorios ausentes o formato incorrecto]*
* **Cuando** *[el cliente envía la solicitud al endpoint]*
* **Entonces** *[el sistema rechaza con HTTP 400 y devuelve el error estándar RFC 9457 indicando el campo erróneo]*

### E3 — [Nombre de la Regla de Negocio / Invariante RN-XXX]
* **Dado** *[un usuario que intenta violar una regla de negocio de `DOMAIN.md` (ej. registro duplicado)]*
* **Cuando** *[intenta persistir o ejecutar la acción]*
* **Entonces** *[el servicio de dominio lanza excepción de negocio y la API devuelve HTTP 409 Conflict]*

---

## ✅ 6. Definition of Done (DoD) del Sprint

Para dar por cerrado el sprint y autorizar el merge a `develop`:

- [ ] **1. Tests TDD:** Todos los escenarios `E1` a `EN` tienen su test automatizado y pasan al 100% en verde.
- [ ] **2. Cero Regresiones:** Toda la suite de pruebas del proyecto pasa en local sin fallos.
- [ ] **3. Nomenclatura Estricta:** Nombres de variables, clases, campos y tablas coinciden exactamente con `DOMAIN.md`.
- [ ] **4. Contrato de API:** Payloads JSON cumplen al pie de la letra con `CONTRATOS_JSON.md` y `openapi_template.yaml`.
- [ ] **5. Análisis Estático:** Linter y analizador estático en 0 errores y 0 advertencias.
- [ ] **6. Bitácora Actualizada:** `MEMORY.md` del área actualizado con decisiones y lecciones aprendidas.
- [ ] **7. Verificación Humana Obligatoria (Anti-Alucinación):** El programador revisó el código línea por línea, probó manualmente el endpoint en Postman/curl (si es backend) o probó la UI con clics reales (si es frontend), y validó buenas prácticas antes de confirmar.
- [ ] **8. Commit Limpio:** Commit realizado en la rama `feature/*` describiendo el cambio sin menciones a herramientas de IA.
