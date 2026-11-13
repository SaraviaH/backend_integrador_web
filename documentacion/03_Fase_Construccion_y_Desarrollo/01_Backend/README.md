# 01. Backend: Construcción y Desarrollo Local

> **Ámbito:** Especialidad Técnica · Backend  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Normas de ingeniería para el Agente de Backend: construcción de servicios puros de dominio, controladores HTTP, repositorios de persistencia y suites de pruebas TDD aisladas.  
> **Regla de Operación:** Toda la lógica de negocio se escribe desacoplada de frameworks y se prueba con tests unitarios locales rápidos.

---

## 🤖 Operación Autónoma del Agente de Backend

El agente asignado al backend opera en su propio espacio de trabajo para evitar bloqueos:
* **Rama de trabajo:** `feature/backend-<id-tarea>` (originada desde `develop`).
* **Bitácora local:** Toda deuda técnica, fallos de tests y decisiones de implementación se registran en [`MEMORY_BACKEND.md`](MEMORY_BACKEND.md).
* **Gestión de Sprints:** Cada tarea de backend se especifica en su propia subcarpeta dentro de [`.sprints/`](.sprints/).

---

## 🏛️ Principios de Construcción de Backend

### 1. Servicios Puros y Aislamiento de Dominio
* Las reglas de negocio (`RN-001..RN-NNN` de `DOMAIN.md`) residen en clases de servicio puras.
* No importan anotaciones web ni librerías de persistencia complejas; deben poder probarse con tests unitarios puros en memoria sin levantar servidores.

### 2. Controladores Enfocados en Transporte y Contratos
* Los controladores únicamente validan el payload de entrada, extraen la identidad del usuario y delegan en el caso de uso.
* Respetan al pie de la letra las rutas y esquemas de [`../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/openapi_template.yaml`](../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/openapi_template.yaml).
* Respuestas de error estructuradas con el estándar oficial **RFC 9457**.

### 3. Repositorios y Persistencia Local
* Acceso a base de datos mediante repositorios que implementan interfaces explícitas.
* Pruebas de integración contra la base de datos levantada en Docker local (PostgreSQL/SQLite) desde el `Sprint-G02`.
* Parámetros en consultas SQL siempre parametrizados para prevenir inyecciones.

### 4. Seguridad e Identidad
* La identidad del actor se obtiene exclusivamente del token o credencial de sesión validada, nunca de un campo `user_id` enviado libremente en el cuerpo de la petición.

---

## 🧪 El Ciclo TDD en Backend

```
1. ROJO:   Escribir el test en `tests/unit/` o `tests/integration/` para el escenario Given-When-Then del SPEC.
           Ejecutar el test runner y verificar que FALLA.
2. VERDE:  Escribir el código mínimo en el servicio/controlador para que el test pase.
3. REFACTOR: Limpiar código, eliminar duplicados y verificar que el 100% de la suite permanece en verde.
4. MANUAL:   Probar el endpoint en Postman o curl contra la BD local para comprobar el payload real.
```

---

## 🛑 Protocolo de Control Anti-Alucinación (El Humano en el Bucle)

El agente de backend **NUNCA** da por cerrado un sprint sin confrontar al desarrollador:
> 💬 *"¿Revisaste el código que generé? ¿Probaste el endpoint en **Postman** o **curl** con la base de datos local encendida? ¿Confirmas que los datos se guardan y devuelven correctamente conforme al contrato antes de hacer commit?"*

---

## 📁 Estructura del Área

* [`BACKLOG_BACKEND.md`](BACKLOG_BACKEND.md): Product Backlog autónomo con la matriz de sprints de backend y DoD técnico.
* [`MEMORY_BACKEND.md`](MEMORY_BACKEND.md): Bitácora técnica y registro de tests locales.
* [`.sprints/`](.sprints/): Carpeta de sprints de desarrollo de backend.
