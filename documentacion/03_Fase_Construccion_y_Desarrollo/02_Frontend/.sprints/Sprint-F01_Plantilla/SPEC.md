# SPEC — Sprint-F01: [Nombre de la Vista / Módulo Frontend]

> **Ámbito:** Frontend Especializado  
> **Rama Git:** `feature/frontend-[nombre-tarea]`  
> **Objetivo:** Implementar la interfaz visual, gestión de estado y navegación para la vista acordada, consumiendo el Mock Server local de OpenAPI con tests de componentes en verde.

---

## 📋 1. Alcance

* **Incluye:**
  * Componentes visuales organizados por Atomic Design (átomos, moléculas, organismos).
  * Conexión con el cliente API local apuntando al Mock Server (`localhost:8080`).
  * Gestión de los 4 estados de la vista: Cargando, Vacío, Error y Éxito.
  * Pruebas de renderizado y accesibilidad.
* **NO incluye:**
  * Conexión al backend de producción en la nube.
  * Modificaciones en contratos de API (el contrato es de solo lectura para el sprint).

---

## 🔌 2. Contrato Afectado

* **Rutas consumidas:** `[GET /v1/[recursos], POST /v1/[recursos]]`
* **Modelos TypeScript / Dart:** `[RecursoResponse, CrearRecursoRequest]`
* **Mock Server:** Servidor Prism respondiendo en puerto `8080`.

---

## 🧪 3. Escenarios TDD de UI (Given-When-Then)

### E1 — Renderizado satisfactorio con datos del Mock
* **Dado** el usuario que navega a la ruta `/recursos`
* **Cuando** la API Mock responde con HTTP 200 y una lista de 3 elementos
* **Entonces** la pantalla muestra las 3 tarjetas con sus títulos correspondientes y estado activo.

### E2 — Manejo visual de error de red
* **Dado** que la conexión con el servidor falla o devuelve HTTP 500
* **Cuando** la pantalla intenta cargar los datos
* **Entonces** se muestra la vista de error con mensaje legible y un botón de "Reintentar".

### E3 — Validación de formulario en cliente
* **Dado** un formulario con campos obligatorios vacíos
* **Cuando** el usuario presiona el botón de guardar
* **Entonces** los campos inválidos se resaltan en rojo con texto de ayuda y no se emite ninguna petición de red.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Tests de componentes y renderizado pasando en verde.
- [ ] Flujo verificado visualmente contra el servidor Prism Mock.
- [ ] Áreas táctiles cumplen con el estándar mínimo de 48x48 dp.
- [ ] Linter ejecutado en limpio (0 errores).
- [ ] `MEMORY_FRONTEND.md` actualizado y commit realizado.
