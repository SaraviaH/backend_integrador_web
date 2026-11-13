# Sprint-B01 — Arquitectura Monolítica Modular, Estructura de Paquetes, Patrones GoF y Reglas SOLID

> **Área Técnica:** Backend (Spring Boot 3.5.16 / Java 21)  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`2e84b9d`, refinado por SRP en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-G02_Base_de_Datos_DDL`  
> **Fuente de Verdad Obligatoria:** [`02_Fase_Diseno_y_Arquitectura/01_Backend/ARCHITECTURE.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/01_Backend/ARCHITECTURE.md)

---

## 1. Objetivo del Sprint
Consolidar y blindar la arquitectura de software del backend en `compunex-backend` bajo el patrón **Monolito Modular por Capas y Dominios de Negocio**, estableciendo las reglas formales de uso de arquitectura, los principios **SOLID**, los patrones de diseño **GoF** (Repository, Builder, Strategy, Filter/Interceptor, Facade), la estructura canónica de paquetes en `com.compunex.b2b`, y ejecutando la auditoría y refactorización técnica de los 14 endpoints existentes para asegurar su cumplimiento estricto con `CONTRATOS_JSON.md` antes de construir los módulos aditivos.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Arquitectura de Backend:** [`02_Fase_Diseno_y_Arquitectura/01_Backend/ARCHITECTURE.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/01_Backend/ARCHITECTURE.md)
* **Contratos Completos:** [`02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md)
* **Diccionario de Datos:** [`02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md)
* **Código Base Existente:** `compunex-backend/src/main/java/com/compunex/b2b`

---

## 3. Definición de Reglas Claras de Arquitectura y Buenas Prácticas

### 3.1. Capas y Flujo Unidireccional de Dependencias
```text
[HTTP Request] ──> [JwtAuthenticationFilter] ──> [SecurityConfig]
                         │
                         ▼
                  [Controller]  <──> [GlobalExceptionHandler (ErrorResponseDTO / JSON uniforme)]
                         │
                         ▼
                  [Service Interface]
                         │
                         ▼
                  [ServiceImpl (Dominio + @Transactional + support/)]
                         │
                         ▼
                  [Spring Data JPA Repository]
                         │
                         ▼
                  [JPA Entity (PostgreSQL 15+ / H2 modo PostgreSQL)]
```
1. **Regla de Dependencia:** Las capas superiores dependen de las inferiores a través de interfaces. Las capas inferiores no invocan controladores HTTP.
2. **Aislamiento de DTOs:** Las entidades JPA de base de datos nunca se exponen directamente en los controladores HTTP. Cada endpoint consume un `*RequestDTO` y retorna un `*ResponseDTO`.

### 3.2. Aplicación de Principios SOLID en Spring Boot
* **S (Single Responsibility):**
  * Controladores: Deserialización, validación `@Valid` de inputs y códigos de estado HTTP.
  * Servicios y colaboradores `support/`: Orquestación de reglas de negocio (`RN-001` a `RN-008`), límites transaccionales `@Transactional` y segregación por actor (`ProductoProveedorService`, `ProductoPublicoService`, `AdminProductoService`, `AuthService`, `RegistroCorporativoService`).
  * Repositorios: Consultas SQL/JPQL, `JpaSpecificationExecutor` y persistencia relacional.
* **O (Open/Closed) & D (Dependency Inversion):**
  * Lógica expuesta mediante interfaces de servicio (`AuthService`, `RegistroCorporativoService`, `CategoriaService`, `OrderService`, `ProviderSalesService`, etc.).
  * Inyección de dependencias por constructor (`@RequiredArgsConstructor` o constructor explícito), sin `@Autowired` en campos.
* **L (Liskov Substitution):**
  * Jerarquía limpia de excepciones (`BusinessException`, `ResourceNotFoundException`, `DuplicateResourceException`, `StockInsuficienteException`, `AutoCompraException`) manejadas uniformemente por `GlobalExceptionHandler`.
* **I (Interface Segregation):**
  * DTOs e interfaces específicas por actor y caso de uso.

### 3.3. Aplicación de Patrones de Diseño GoF
* **Repository Pattern:** `JpaRepository<T, ID>` y `JpaSpecificationExecutor<T>`.
* **Builder Pattern:** `@Builder` de Lombok en entidades y DTOs.
* **Strategy Pattern:** Especificaciones dinámicas JPA (`ProductoSpecification`) y cálculo modular (`SplitOrderCalculator`).
* **Interceptor / Filter Pattern:** `JwtAuthenticationFilter` y `AuditAspect` (`@Aspect`).
* **Facade Pattern:** Servicios de aplicación coordinando múltiples repositorios y helpers.

---

## 4. Tareas Técnicas Detalladas (Paso a Paso)

### 4.1. Consolidación del Árbol de Paquetes en `src/main/java/com/compunex/b2b/`
- [x] Estructurar los paquetes base transversales:
  * `config/`: `SecurityConfig.java`, `OpenApiConfig.java`, `DataInitializer.java` y subpaquete `config/audit/` (`Auditable.java`, `AuditAspect.java`). *(CORS centralizado dentro de `SecurityConfig.corsConfigurationSource()`)*.
  * `exception/`: `GlobalExceptionHandler.java`, `ErrorResponseDTO.java`, `BusinessException.java`, `DuplicateResourceException.java`, `ResourceNotFoundException.java`.
  * `security/`: `JwtTokenProvider.java`, `JwtAuthenticationFilter.java`, `CustomUserDetailsService.java`.
- [x] Estructurar los módulos de dominio:
  * `modules/auth/`: controller, dto (request/response), entity, exception, repository, service (`AuthService`, `RegistroCorporativoService` + `impl/`).
  * `modules/catalogo/`: controller (`CategoriaController`, `ProductoProveedorController`, `ProductoPublicoController`, `AdminProductoController`), dto, entity, repository, service (+ `impl/` y `support/`).
  * `modules/perfiles/`: controller, dto, entity, repository, service (`impl/`).
  * `modules/ordenes/`: controller, dto, entity, exception, repository, service (`impl/` y `support/`).
  * `modules/media/`: controller, dto, service (`impl/`). *(La moderación admin quedó integrada dentro de `modules/catalogo/` con `@PreAuthorize("hasRole('ADMIN')")`)*.

### 4.2. Auditoría y Refactor de los 14 Endpoints Existentes
- [x] **Módulo Auth (Endpoints 1 a 4):**
  * `POST /api/v1/auth/login` devuelve token JWT con `tipoToken: "Bearer"`.
  * Contraseñas almacenadas 100% cifradas con BCrypt.
  * `GET /api/v1/auth/me` obtiene la identidad del `SecurityContextHolder`.
- [x] **Módulo Catálogo Base (Endpoints 5 y 6):**
  * `GET /api/v1/categories` y `/{id}` incluyen `totalProductos` y subcategorías.
- [x] **Módulo Productos de Proveedor (Endpoints 7 a 12):**
  * `GET /api/v1/providers/me/products` devuelve estructura paginada oficial `{ "contenido", "pagina", "tamano", "totalElementos", "totalPaginas", "esUltima" }`.
  * `DELETE` aplica soft-delete (`fecha_eliminacion != null`).
- [x] **Módulo Admin (Endpoints 13 y 14):**
  * Protegido con `@PreAuthorize("hasRole('ADMIN')")` y filtro `/api/v1/admin/**` en `SecurityConfig`.

### 4.3. Configuración y Externalización de Entornos
- [x] Creados `src/main/resources/application-dev.yml` y `application-prod.yml`.
- [x] Externalizados `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION_MS` y `MEDIA_UPLOAD_DIR` mediante variables de entorno con respaldo local en `application.properties` / `application-dev.yml`.

---

## 5. Criterios de Aceptación (Definition of Done - DoD)
- [x] `.\mvnw.cmd clean test` compila (`119` fuentes principales + `25` de test) y aprueba `83/83` pruebas sin errores.
- [x] Los 14 endpoints existentes pasan sus pruebas unitarias y de capa web con `MockMvc`.
- [x] La estructura de paquetes cumple la convención `camelCase`.
- [x] Cero dependencias circulares y cero inyecciones por `@Autowired` en campos dentro del código fuente principal.

---

## 6. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd clean test -Dtest=AuthControllerTest,CategoriaControllerTest,ProductoProveedorControllerTest
```

---

## 7. Matriz de Trazabilidad
| Capa Arquitectónica | Patrón GoF / Regla SOLID | Ubicación en el Código |
| :--- | :--- | :--- |
| Entrada / Control | Single Responsibility (Transporte) | `modules.*.controller`, `exception.GlobalExceptionHandler` |
| Servicio / Dominio | Dependency Inversion / SRP / Facade | `modules.*.service`, `impl/`, `support/` |
| Persistencia | Repository / Specification Pattern | `modules.*.repository` (Spring Data JPA) |
| Seguridad y Auditoría | Filter / AOP Aspect | `security.JwtAuthenticationFilter`, `config.SecurityConfig`, `config.audit.AuditAspect` |
