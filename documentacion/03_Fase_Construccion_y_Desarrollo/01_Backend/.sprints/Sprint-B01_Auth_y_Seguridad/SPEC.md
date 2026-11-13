# Sprint-B01 — Auth, Perfiles y Seguridad JWT

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-auth-security` hacia `develop`  
> **Dependencias Previas:** `Sprint-G02_Base_de_Datos_DDL`

---

## 1. Objetivo del Sprint
Implementar el módulo completo de seguridad y autenticación sin estado (stateless) con Spring Security 6.2 y JJWT 0.11.5, cubriendo el inicio de sesión, registro de proveedores y empresas, consulta y modificación de perfil propio, y activación de perfiles comerciales B2B, dando soporte a los 7 endpoints de autenticación y perfiles con hashing seguro BCrypt.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 1: `POST /api/v1/auth/login`
  * Endpoint 2: `POST /api/v1/auth/register` (alias `/api/v1/auth/registro-proveedor`)
  * Endpoint 3: `GET /api/v1/auth/me`
  * Endpoint 4: `PATCH /api/v1/auth/password`
  * Endpoint 15: `POST /api/v1/auth/register-company`
  * Endpoint 16: `GET /api/v1/providers/me/profile`
  * Endpoint 17: `POST /api/v1/providers/me/activate`
* **Tablas de Base de Datos:** `usuarios`, `perfiles_proveedor` (1:1).
* **Reglas de Negocio:**
  * `RN-001`: Roles permitidos (`ADMIN`, `PROVEEDOR`, `CLIENTE`). Token JWT con expiración de 24 horas (86400 segundos).
  * `RN-002`: Validación de RUC (11 dígitos numéricos, obligatorio para proveedores/empresas). Razón Social obligatoria.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Infraestructura de Seguridad y Tokens
- [ ] Implementar `JwtTokenProvider.java`: Generación y validación de tokens JWT (HS256 con clave secreta >= 256 bits), extracción de username (correo) y rol.
- [ ] Implementar `JwtAuthenticationFilter.java`: Filtro OncePerRequestFilter que intercepta cabeceras `Authorization: Bearer ...`.
- [ ] Configurar `SecurityConfig.java`:
  * `SecurityFilterChain` con CSRF deshabilitado, sesión `SessionCreationPolicy.STATELESS`.
  * Rutas públicas: `/api/v1/auth/login`, `/api/v1/auth/register*`, `/api/v1/salud`, Swagger/OpenAPI.
  * Rutas autenticadas: `/api/v1/auth/me`, `/api/v1/auth/password`, etc.
  * Bean `PasswordEncoder`: `BCryptPasswordEncoder(10)`.

### 3.2. Entidades y Repositorios
- [ ] Entidad `Usuario.java`: Mapeo JPA de tabla `usuarios` (`id`, `uuid`, `nombre`, `correo`, `contrasenaHash`, `rol`, `estado`).
- [ ] Entidad `PerfilProveedor.java`: Mapeo JPA de tabla `perfiles_proveedor` (`identificacionFiscal`, `razonSocial`, `nombreComercial`, etc.).
- [ ] `UsuarioRepository.java`: Consultas `findByCorreo(String correo)`, `existsByCorreo(String correo)`.
- [ ] `PerfilProveedorRepository.java`: Consultas `findByIdentificacionFiscal(String ruc)`, `findByUsuarioId(Long usuarioId)`.

### 3.3. DTOs y Mappings
- [ ] DTOs de entrada: `LoginRequestDTO`, `RegistroProveedorRequestDTO`, `RegistroEmpresaRequestDTO`, `CambioContrasenaRequestDTO`, `ActivarProveedorRequestDTO` con validaciones `@NotBlank`, `@Email`, `@Size(min=11, max=11)`.
- [ ] DTOs de salida: `AuthResponseDTO`, `UsuarioPerfilResponseDTO`, `ProveedorPerfilResponseDTO`, `MensajeResponseDTO`.

### 3.4. Servicios y Controladores
- [ ] `AuthService.java` / `AuthServiceImpl.java`: Lógica de autenticación, verificación de contraseñas, registro transaccional `@Transactional`.
- [ ] `AuthController.java`: Endpoints 1, 2, 3, 4, 15.
- [ ] `ProviderProfileController.java`: Endpoints 16, 17.
- [ ] Manejo de excepciones: `BadCredentialsException` -> 401, `DuplicateResourceException` -> 409, `ValidationException` -> 400.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El login con credenciales correctas devuelve token JWT válido con formato Bearer y tiempo de expiración.
- [ ] El login con credenciales erróneas devuelve `401 Unauthorized` con mensaje `{ "mensaje": "Credenciales incorrectas" }`.
- [ ] El registro valida unicidad de correo y RUC; duplicados devuelven `409 Conflict`.
- [ ] `GET /api/v1/auth/me` devuelve el perfil del usuario autenticado a partir del token.
- [ ] Cero contraseñas en texto plano en la base de datos (100% hashes BCrypt).

---

## 5. Plan de Verificación y Comandos
```bash
# Ejecutar suite de pruebas unitarias y de integración para Auth
cd compunex-backend
mvn test -Dtest=AuthControllerTest,AuthServiceTest,SecurityIntegrationTest

# Prueba manual con curl
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "ventas.mayoristas@technova.com", "contrasena": "Password123!"}'
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-01` (Autenticación) | `RN-001` | 1, 3, 4 | `AuthController.java`, `JwtTokenProvider.java` |
| `RF-02` (Registro Proveedor) | `RN-001`, `RN-002` | 2, 15, 16, 17 | `AuthServiceImpl.java`, `ProviderProfileController.java` |
