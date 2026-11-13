# Sprint-B01 — Auditoría y Refactor de la Base Backend Existente (14 Endpoints)

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-base-audit-refactor` hacia `develop`  
> **Dependencias Previas:** `Sprint-G02_Base_de_Datos_DDL`

---

## 1. Objetivo del Sprint
Auditar, verificar y refactorizar el código base existente en `compunex-backend` (que implementa 14 endpoints de autenticación, categorías, productos de proveedor y administración), garantizando que sus DTOs, códigos de estado HTTP y respuestas de error se alineen al 100% con `CONTRATOS_JSON.md`, y que la suite de pruebas unitarias/MockMvc compile y pase en limpio contra MySQL 8.0 local.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Código Base Existente en Repositorio:**
  * Módulo Auth: `AuthController.java`, `Usuario.java`, `UsuarioRepository.java`, `AuthServiceImpl.java`.
  * Módulo Catálogo: `CategoriaController.java`, `ProductoProveedorController.java`, `AdminProductoController.java`.
* **Contratos Existentes Auditados (`CONTRATOS_JSON.md`):**
  * Endpoints 1 a 4 (`/api/v1/auth/login`, `/register`, `/me`, `/password`)
  * Endpoints 5 y 6 (`/api/v1/categories`, `/{id}`)
  * Endpoints 7 a 12 (`/api/v1/providers/me/products/**`)
  * Endpoints 13 y 14 (`/api/v1/admin/products/**`)
* **Reglas de Negocio:**
  * `RN-001`: Autenticación JWT y Roles (`ADMIN`, `PROVEEDOR`, `CLIENTE`).
  * `RN-003`: Soft Delete en productos (`fecha_eliminacion`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Auditoría de DTOs y Mappings de Contratos
- [ ] Revisar `LoginRequestDTO` y `AuthResponseDTO` asegurando campos `{ "token", "tipoToken": "Bearer", "expiraEnSegundos": 86400 }`.
- [ ] Revisar `CategoriaResponseDTO` asegurando que incluya `totalProductos` y subcategorías anidadas.
- [ ] Revisar respuestas paginadas en `ProductoProveedorController`: estructura `{ "contenido", "pagina", "tamano", "totalElementos", "totalPaginas", "esUltima" }`.

### 3.2. Manejo Centralizado de Errores (`GlobalExceptionHandler.java`)
- [ ] Asegurar formato uniforme `ErrorResponseDTO` para 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict.
- [ ] Verificar que las contraseñas nunca aparezcan en logs ni en respuestas de error.

### 3.3. Suite de Pruebas Unitarias y MockMvc
- [ ] Correr `mvn test` sobre los 14 endpoints existentes.
- [ ] Corregir cualquier aserción desactualizada respecto a `CONTRATOS_JSON.md`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] `mvn clean test` ejecuta con 0 fallas sobre los controladores y servicios existentes.
- [ ] Los 14 endpoints responden exactamente según los esquemas de `CONTRATOS_JSON.md`.
- [ ] La base existente se encuentra lista para recibir los módulos aditivos sin roturas.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn clean test
# Probar login existente con curl
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "ventas.mayoristas@technova.com", "contrasena": "Password123!"}'
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Endpoints Auditados | Controladores Involucrados |
| :--- | :--- | :--- |
| `RF-01`, `RF-02`, `RF-03`, `RF-07`, `RF-09` | 1 a 6, 7 a 14 | `AuthController`, `CategoriaController`, `ProductoProveedorController`, `AdminProductoController` |
