# Sprint-B02 — Endpoints Aditivos de Auth, Empresa y Activación

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-auth-additive` hacia `develop`  
> **Dependencias Previas:** `Sprint-B01_Audit_y_Refactor_Base_Existente`

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
- [ ] `RegistroEmpresaRequestDTO`: campos `ruc` (`@Pattern(regexp="^[0-9]{11}$")`), `razonSocial`, `nombreComercial`, `direccionFiscal`, `telefono`, `correo`, `contrasena`.
- [ ] `ActivarProveedorRequestDTO`: campos fiscales para la activación.
- [ ] `ProveedorPerfilResponseDTO`: información comercial pública y fiscal.

### 3.2. Lógica de Servicio
- [ ] En `AuthServiceImpl`: método `registrarEmpresa(RegistroEmpresaRequestDTO dto)` anotado con `@Transactional`. Crea el `Usuario` con rol `CLIENTE` y persiste su perfil empresarial.
- [ ] En `ProviderProfileServiceImpl`: método `activarProveedor(Long usuarioId, ActivarProveedorRequestDTO dto)`. Actualiza el rol del usuario a `PROVEEDOR` y persiste `PerfilProveedor` asociado.
- [ ] Validación de unicidad de RUC: lanzar `DuplicateResourceException` -> 409 Conflict si el RUC ya existe.

### 3.3. Controladores y Pruebas
- [ ] Agregar endpoint en `AuthController`: `POST /api/v1/auth/register-company`.
- [ ] Crear `ProviderProfileController`: endpoints 16 y 17.
- [ ] Tests de integración con `@SpringBootTest` y `MockMvc`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El registro de empresa valida estrictamente el RUC de 11 dígitos y emite JWT con código 201 Created.
- [ ] La activación de un cliente a proveedor actualiza su rol de inmediato y devuelve el perfil comercial activo.
- [ ] Un RUC duplicado devuelve código `409 Conflict` con mensaje claro.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=ProviderProfileControllerTest,CompanyRegistrationTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-01`, `RF-02` | `RN-001`, `RN-002` | 15, 16, 17 | `AuthController.java`, `ProviderProfileController.java` |
