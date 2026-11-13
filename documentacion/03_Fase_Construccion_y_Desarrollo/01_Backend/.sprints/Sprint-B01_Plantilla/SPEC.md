# SPEC — Sprint-B01: [Nombre del Módulo Backend]

> **Ámbito:** Backend Especializado  
> **Rama Git:** `feature/backend-[nombre-tarea]`  
> **Objetivo:** Implementar la lógica de negocio, servicios puros y endpoints para el módulo acordado con tests TDD en verde.

---

## 📋 1. Alcance

* **Incluye:**
  * Implementación de entidades de dominio y reglas `RN-XXX`.
  * Servicios de aplicación y casos de uso con inyección de dependencias.
  * Controladores REST con validación estricta de esquemas OpenAPI.
* **NO incluye:**
  * Componentes de frontend ni pantallas.
  * Modificaciones en esquemas de base de datos fuera de las migraciones acordadas.

---

## 🔌 2. Contrato Afectado

* **Rutas:** `[POST /v1/[recurso], GET /v1/[recurso]/{id}]`
* **Códigos de respuesta:** `200 OK`, `201 Created`, `400 Bad Request`, `409 Conflict`.
* **Esquemas:** `[RecursoRequest, RecursoResponse, ErrorRFC9457]`

---

## 🧪 3. Escenarios TDD (Given-When-Then)

### E1 — Operación exitosa con datos válidos
* **Dado** una petición válida con `Idempotency-Key` y payload completo
* **Cuando** el controlador procesa la solicitud
* **Entonces** el servicio persiste el registro y devuelve `201 Created` con el ID asignado.

### E2 — Rechazo por violación de regla de negocio
* **Dado** una precondición que viola una invariante de `DOMAIN.md` (ej. auto-operación indebida)
* **Cuando** el cliente intenta ejecutar la acción
* **Entonces** el servicio puro lanza excepción y se retorna `409 Conflict` con código `ERR_REGLA_NEGOCIO_VIOLADA`.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Tests unitarios puros pasando en verde sin dependencias de base de datos.
- [ ] Tests de integración de controladores pasando en verde contra la base de datos local.
- [ ] Linter ejecutado en limpio (0 errores).
- [ ] `MEMORY_BACKEND.md` actualizado y commit realizado.
