# SPEC_TEMPLATE.md — Plantilla Estándar para Especificación de Sprint

> **Uso:** Esta plantilla define la estructura formal y obligatoria para los archivos `SPEC.md` de cada sprint en COMPUNEX B2B.

---

# [ID_SPRINT] — [Título Descriptivo del Sprint]

> **Área Técnica:** [Backend / Frontend / General]  
> **Track:** [General / Backend Track / Frontend Track]  
> **Agente Responsable:** [Agente DevOps / Agente Backend / Agente Frontend / Coordinador]  
> **Estado:** [PENDIENTE / EN_PROGRESO / COMPLETADO / BLOQUEADO]  
> **Rama GitFlow:** `feature/[nombre-rama]` (o `chore/setup`, etc.) hacia `develop`  
> **Dependencias Previas:** [IDs de sprints o Gates necesarios]

---

## 1. Objetivo del Sprint
[Descripción de 1 o 2 párrafos del entregable concreto del sprint, su justificación y valor de negocio].

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos OpenAPI / JSON:** [Listado de endpoints con rutas y métodos]
* **Modelo de Base de Datos:** [Tablas afectadas o consultadas según MODELO_Y_DICCIONARIO_BD.md]
* **Reglas de Negocio:** [RN-001, RN-002, etc.]
* **Pantallas / Mockups (Frontend):** [P-XX según PROMPTS_GOOGLE_STITCH_TEMPLATE.md]

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. [Módulo o Tarea 1]
- [ ] Subtarea 1.1...
- [ ] Subtarea 1.2...

### 3.2. [Módulo o Tarea 2]
- [ ] Subtarea 2.1...
- [ ] Subtarea 2.2...

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] **Compilación limpia:** Cero errores de sintaxis o empaquetado (`mvn clean compile` o `ng build`).
- [ ] **Contratos respetados:** DTOs y payloads idénticos a `CONTRATOS_JSON.md`.
- [ ] **Reglas de negocio aplicadas:** Validaciones funcionales activas.
- [ ] **Pruebas automáticas / manuales:** Suite de pruebas pasando sin fallas.
- [ ] **Sin código muerto:** Código limpio, sin imports huérfanos ni `console.log`/`System.out.println`.

---

## 5. Plan de Verificación y Comandos
```bash
# Comandos específicos para verificar el entregable
mvn test -Dtest=NombreTest
# o en Frontend
npm test -- --watch=false
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoint / Pantalla | Componente / Servicio |
| :--- | :--- | :--- | :--- |
| `RF-XX` | `RN-YY` | `/api/v1/...` o `P-XX` | `Clase.java` o `component.ts` |
