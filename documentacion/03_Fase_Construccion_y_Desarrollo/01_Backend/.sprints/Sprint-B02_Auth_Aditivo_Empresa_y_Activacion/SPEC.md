# Sprint-B02 — Endpoints Aditivos de Auth, Empresa y Activación

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`3149165`, actualizado en `45479f7` y refactorizado en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B01_Arquitectura_Estructura_y_Reglas_Backend`

---

## 1. Objetivo del Sprint
Implementar los 3 endpoints aditivos del módulo de autenticación y perfiles: registro directo de empresas compradoras (`POST /api/v1/auth/register-company`), consulta de perfil comercial del proveedor logueado (`GET /api/v1/providers/me/profile`), y activación de perfil comercial para clientes existentes que desean vender (`POST /api/v1/providers/me/activate`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 15: `POST /api/v1/auth/register-company` (Público)
  * Endpoint 16: `GET /api/v1/providers/me/profile` (Requiere `ROLE_PROVEEDOR`)
  * Endpoint 17: `POST /api/v1/providers/me/activate` (Requiere usuario autenticado)
* **Tablas de Base de Datos:** `usuarios`, `perfiles_proveedor`.
* **Reglas de Negocio:**
  * `RN-001`: Roles (`ADMIN`, `PROVEEDOR`, `CLIENTE`).
  * `RN-002`: Validación de RUC 11 dígitos numéricos, unicidad y Razón Social obligatoria.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Entrada y Salida
- [x] `RegistroEmpresaRequestDTO` y `RegistroEmpresaResponseDTO`: validación `@Pattern(regexp="^[0-9]{11}$")` para `ruc`, razón social, nombre comercial, ciudad, correo y contraseña.
- [x] `ActivarProveedorRequestDTO` y `ActivarProveedorResponseDTO`: datos fiscales/comerciales y emisión de nuevo token JWT `PROVEEDOR`.
- [x] `ProveedorPerfilResponseDTO`: información comercial pública y fiscal del proveedor autenticado.

### 3.2. Lógica de Servicio
- [x] En `RegistroCorporativoServiceImpl` (extraído desde `AuthServiceImpl` en refactor SRP): método `registrarEmpresa(RegistroEmpresaRequestDTO request)` anotado con `@Transactional` y `@Auditable(accion = "AUTH_REGISTER_COMPANY")`. Crea el `Usuario` con rol `CLIENTE` y persiste su perfil empresarial.
- [x] En `ProviderProfileServiceImpl`: método `activarProveedor(String correoUsuario, ActivarProveedorRequestDTO request)` actualiza el rol del usuario a `PROVEEDOR`, persiste `PerfilProveedor` asociado y emite nuevo JWT con rol `PROVEEDOR`.
- [x] Validación de unicidad de correo y RUC: `DuplicateResourceException` -> `409 Conflict` cuando existe duplicado.

### 3.3. Controladores y Pruebas
- [x] Agregado endpoint en `AuthController`: `POST /api/v1/auth/register-company`.
- [x] Creado `ProviderProfileController`: endpoints 16 (`GET /api/v1/providers/me/profile`) y 17 (`POST /api/v1/providers/me/activate` retornando `201 Created`).
- [x] Tests de integración y servicio: `CompanyRegistrationTest`, `ProviderProfileControllerTest`, `RegistroCorporativoServiceTest`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] El registro de empresa valida estrictamente el RUC de 11 dígitos y emite JWT con código `201 Created`.
- [x] La activación de un cliente a proveedor actualiza su rol de inmediato, emite nuevo JWT y devuelve el perfil comercial activo (`201 Created`).
- [x] Un RUC o correo duplicado en `register-company` / `activate` devuelve código `409 Conflict` con mensaje claro.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=ProviderProfileControllerTest,CompanyRegistrationTest,RegistroCorporativoServiceTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-01`, `RF-02` | `RN-001`, `RN-002` | 15, 16, 17 | `AuthController.java`, `RegistroCorporativoServiceImpl.java`, `ProviderProfileController.java`, `ProviderProfileServiceImpl.java` |
