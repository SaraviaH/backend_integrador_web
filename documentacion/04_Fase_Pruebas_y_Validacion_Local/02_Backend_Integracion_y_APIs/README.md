# 02. Pruebas de Backend, Integración y Contratos de API

> **Área Técnica:** Backend QA & API Testing  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Validar el comportamiento conjunto de controladores, servicios de aplicación, repositorios de persistencia y cumplimiento estricto de contratos OpenAPI.

---

## 🏛️ 1. Principios de Integración en Backend

* **Base de Datos Real Local:** Prohibido probar repositorios con mocks que no respeten el motor SQL; las pruebas de integración corren contra la instancia Docker local (PostgreSQL / SQLite).
* **Validación de Schemas OpenAPI:** Toda respuesta debe cumplir con las definiciones de `openapi_template.yaml` (tipos de datos, nulabilidad y códigos HTTP).
* **Verificación del Estándar RFC 9457:** Los errores 4xx y 5xx deben devolver payloads estructurados con `type`, `title`, `status` y `detail`.
* **Idempotencia Comprobada:** Verificar que enviar 2 veces la misma petición con cabecera `Idempotency-Key` no duplica registros en la base de datos.

---

## 🛠️ 2. Herramientas Recomendadas para Validación de APIs

* **Pruebas Automatizadas de Integración:** Supertest (Node.js), WebTestClient (Spring), TestClient / HTTPX (Python FastAPI).
* **Fuzzing y Validación de Schemas OpenAPI:** `schemathesis` (ejecuta cientos de peticiones automáticas contra el contrato OpenAPI buscando inconsistencias).
* **Colecciones Ejecutables de Testing:** Postman CLI / Newman, Thunder Client CLI, o scripts curl reproducibles.

---

## 📋 3. Matriz de Validación de Endpoints

| Endpoint | Método | Caso de Prueba | Entrada | Salida Esperada | Estado |
| :--- | :---: | :--- | :--- | :---: | :---: |
| `/v1/salud` | `GET` | Verificación de vida de API | Ninguna | `200 OK {"estado": "saludable"}` | `[Aprobado]` |
| `/v1/auth/login` | `POST` | Credenciales correctas | Credenciales válidas | `200 OK + JWT válido` | `[Aprobado]` |
| `/v1/auth/login` | `POST` | Contraseña errónea | Payload con clave inválida | `401 Unauthorized (RFC 9457)` | `[Aprobado]` |
| `/v1/[recursos]` | `POST` | Idempotencia comprobada | Mismo UUID en `Idempotency-Key`| `201` en primer llamado, `200/201` en segundo sin duplicar | `[Aprobado]` |
