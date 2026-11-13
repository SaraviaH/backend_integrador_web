# Sprint-B01 — Arquitectura Monolítica Modular, Estructura de Paquetes, Patrones GoF y Reglas SOLID

> **Área Técnica:** Backend (Spring Boot 3.2.0 / Java 17)  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-architecture-scaffold` hacia `develop`  
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
                  [Controller]  <──> [GlobalExceptionHandler (RFC 9457)]
                         │
                         ▼
                  [Service Interface]
                         │
                         ▼
                  [ServiceImpl (Dominio Puro + @Transactional)]
                         │
                         ▼
                  [Spring Data JPA Repository]
                         │
                         ▼
                  [JPA Entity (MySQL 8.0)]
```
1. **Regla de Dependencia:** Las capas superiores dependen de las inferiores a través de interfaces. Las capas inferiores nunca conocen a las superiores (ej. un `Service` nunca importa nada de `org.springframework.web`).
2. **Aislamiento de DTOs:** Las entidades JPA de base de datos nunca se exponen directamente en los controladores HTTP. Cada endpoint consume un `*RequestDTO` y retorna un `*ResponseDTO`.

### 3.2. Aplicación de Principios SOLID en Spring Boot
* **S (Single Responsibility):**
  * Controladores: Exclusivamente deserialización, validación `@Valid` de inputs y códigos de estado HTTP.
  * Servicios: Orquestación de reglas de negocio (`RN-001` a `RN-008`) y límites transaccionales `@Transactional`.
  * Repositorios: Consultas SQL/JPQL y persistencia relacional.
* **O (Open/Closed) & D (Dependency Inversion):**
  * Toda lógica se expone mediante interfaces de servicio (`AuthService`, `CategoriaService`, `OrderService`).
  * Inyección de dependencias exclusivamente por constructor mediante `@RequiredArgsConstructor` de Lombok. Prohibido el uso de `@Autowired` sobre campos privados.
* **L (Liskov Substitution):**
  * Jerarquía limpia de excepciones (`BusinessException`, `ResourceNotFoundException`, `DuplicateResourceException`) manejadas uniformemente por `GlobalExceptionHandler`.
* **I (Interface Segregation):**
  * DTOs específicos y segregados por caso de uso. No reutilizar un DTO gigante con campos nulos para operaciones distintas.

### 3.3. Aplicación de Patrones de Diseño GoF
* **Repository Pattern:** Abstracción del acceso a datos mediante interfaces `JpaRepository<T, ID>` y `JpaSpecificationExecutor<T>`.
* **Builder Pattern:** Construcción segura e inmutable de DTOs y entidades mediante `@Builder` de Lombok.
* **Strategy Pattern:** Estrategias de cálculo fiscal de IGV (18%) y validadores de identificación fiscal (algoritmo RUC).
* **Interceptor / Filter Pattern:** `JwtAuthenticationFilter` en la cadena de seguridad de Spring Security 6.2.
* **Facade Pattern:** La capa de servicio actúa como fachada unificada ante múltiples repositorios y utilidades de hashing.

---

## 4. Tareas Técnicas Detalladas (Paso a Paso)

### 4.1. Consolidación del Árbol de Paquetes en `src/main/java/com/compunex/b2b/`
- [ ] Estructurar los paquetes base transversales:
  * `config/`: `SecurityConfig.java`, `OpenApiConfig.java`, `CorsConfig.java`, `DataInitializer.java`.
  * `exception/`: `GlobalExceptionHandler.java`, `ErrorResponseDTO.java`, excepciones de dominio.
  * `security/`: `JwtTokenProvider.java`, `JwtAuthenticationFilter.java`, `CustomUserDetailsService.java`.
- [ ] Estructurar los módulos de dominio:
  * `modules/auth/`: controller, dto (request/response), entity, repository, service (impl).
  * `modules/catalogo/`: controller, dto, entity, repository, service (impl).
  * `modules/perfiles/`: entity, repository, service (impl).
  * `modules/ordenes/` *(preparar paquetes para Split Order)*: controller, dto, entity, repository, service (impl).
  * `modules/admin/` *(preparar paquetes para moderación y AOP)*: controller, dto, service.

### 4.2. Auditoría y Refactor de los 14 Endpoints Existentes
- [ ] **Módulo Auth (Endpoints 1 a 4):**
  * Verificar que `POST /api/v1/auth/login` devuelva token JWT con `tipoToken: "Bearer"`.
  * Verificar que contraseñas se almacenen 100% cifradas con BCrypt.
  * Verificar que `GET /api/v1/auth/me` obtenga la identidad del `SecurityContextHolder`.
- [ ] **Módulo Catálogo Base (Endpoints 5 y 6):**
  * Verificar que `GET /api/v1/categories` y `/{id}` incluyan `totalProductos` y subcategorías.
- [ ] **Módulo Productos de Proveedor (Endpoints 7 a 12):**
  * Verificar que `GET /api/v1/providers/me/products` devuelva estructura paginada oficial `{ "contenido", "pagina", "tamano", "totalElementos", "totalPaginas", "esUltima" }`.
  * Verificar que `DELETE` aplique soft-delete (`fecha_eliminacion != null`).
- [ ] **Módulo Admin (Endpoints 13 y 14):**
  * Verificar protección `@PreAuthorize("hasRole('ADMIN')")`.

### 4.3. Configuración y Externalización de Entornos
- [ ] Crear `src/main/resources/application-dev.yml` y `application-prod.yml`.
- [ ] Externalizar `spring.datasource.url`, `username`, `password` y `jwt.secret` a variables de entorno con valores por defecto locales.

---

## 5. Criterios de Aceptación (Definition of Done - DoD)
- [ ] `mvn clean compile` compila sin advertencias de dependencias ni anotaciones huérfanas.
- [ ] Los 14 endpoints existentes pasan sus pruebas de integración con `MockMvc`.
- [ ] La estructura de paquetes cumple la convención `camelCase` requerida.
- [ ] Cero dependencias circulares y cero inyecciones por `@Autowired` en campos.

---

## 6. Plan de Verificación y Comandos
```bash
cd compunex-backend
# Ejecutar suite de pruebas de arquitectura y contratos existentes
mvn clean test -Dtest=AuthControllerTest,CategoriaControllerTest,ProductoProveedorControllerTest
```

---

## 7. Matriz de Trazabilidad
| Capa Arquitectónica | Patrón GoF / Regla SOLID | Ubicación en el Código |
| :--- | :--- | :--- |
| Entrada / Control | Single Responsibility (Transporte) | `modules.*.controller`, `exception.GlobalExceptionHandler` |
| Servicio / Dominio | Dependency Inversion / Facade | `modules.*.service` (Interfaces e implementaciones) |
| Persistencia | Repository Pattern | `modules.*.repository` (Spring Data JPA) |
| Seguridad | Filter / Strategy | `security.JwtAuthenticationFilter`, `config.SecurityConfig` |
