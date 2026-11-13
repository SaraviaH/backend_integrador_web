# 03. Arquitectura y Estructura del Backend (Spring Boot 3.5.16)

> **Plataforma:** COMPUNEX B2B — Ecosistema Mayorista de Componentes de Computación  
> **Framework:** Java 21 + Spring Boot 3.5.16 + Spring Security 6 + Spring Data JPA + Hibernate + Springdoc OpenAPI 2.8.9  
> **Persistencia:** PostgreSQL 15+ (y H2 en modo PostgreSQL para pruebas TDD)  
> **Patrón:** Monolito Modular por Dominios (*Vertical Slicing* + *SRP / Opción B*)  
> **Estándar DTO:** Segregación estricta de responsabilidades en paquetes `dto/request/` y `dto/response/`  
> **Metodología de Calidad:** Pruebas `@DataJpaTest`, unitarias con Mockito, `@WebMvcTest` y pruebas integradas `@SpringBootTest`

---

## 1. Estructura Real del Proyecto Maven

```text
compunex-backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/compunex/b2b/
    │   │   ├── CompunexBackendApplication.java
    │   │   │
    │   │   ├── config/                          # Infraestructura Spring y AOP
    │   │   │   ├── SecurityConfig.java          # Spring Security 6 + CORS + JWT stateless RBAC
    │   │   │   ├── OpenApiConfig.java           # Documentación Swagger / OpenAPI 3
    │   │   │   ├── DataInitializer.java         # Datos semilla iniciales
    │   │   │   └── audit/                       # Auditoría transversal AOP
    │   │   │       ├── Auditable.java
    │   │   │       └── AuditAspect.java
    │   │   │
    │   │   ├── exception/                       # Manejo centralizado de errores
    │   │   │   ├── GlobalExceptionHandler.java  # @RestControllerAdvice
    │   │   │   ├── ErrorResponseDTO.java        # status, error, mensaje, timestamp
    │   │   │   ├── BusinessException.java
    │   │   │   ├── ResourceNotFoundException.java
    │   │   │   └── DuplicateResourceException.java
    │   │   │
    │   │   ├── security/                        # Seguridad JWT
    │   │   │   ├── JwtTokenProvider.java
    │   │   │   ├── JwtAuthenticationFilter.java
    │   │   │   └── CustomUserDetailsService.java
    │   │   │
    │   │   └── modules/                         # Módulos de Negocio (Vertical Slices)
    │   │       ├── auth/                        # Módulo Auth & Onboarding Corporativo
    │   │       │   ├── controller/              # AuthController (/api/v1/auth)
    │   │       │   ├── dto/request|response/    # Login, RegistroProveedor, RegistroEmpresa, Password, Sesion
    │   │       │   ├── entity/                  # Usuario, RolUsuario, EstadoUsuario
    │   │       │   ├── exception/               # ContrasenaActualIncorrectaException
    │   │       │   ├── repository/              # UsuarioRepository
    │   │       │   └── service/                 # AuthService, RegistroCorporativoService + impl/
    │   │       │
    │   │       ├── perfiles/                    # Módulo Perfil Comercial del Proveedor
    │   │       │   ├── controller/              # ProviderProfileController (/api/v1/providers/me/*)
    │   │       │   ├── dto/request|response/    # ActivarProveedorRequest/Response, ProveedorPerfilResponse
    │   │       │   ├── entity/                  # PerfilProveedor
    │   │       │   ├── repository/              # PerfilProveedorRepository
    │   │       │   └── service/                 # ProviderProfileService + impl/
    │   │       │
    │   │       ├── catalogo/                    # Módulo Categorías, Productos y Moderación Admin
    │   │       │   ├── controller/              # CategoriaController, ProductoProveedorController, ProductoPublicoController, AdminProductoController
    │   │       │   ├── dto/request|response/    # DTOs por caso de uso + ProductoPaginadoResponseDTO.from
    │   │       │   ├── entity/                  # Categoria, Subcategoria, Producto, ProductoEspecificacion, ImagenProducto, enums
    │   │       │   ├── repository/              # CategoriaRepository, ProductoRepository, ProductoSpecification
    │   │       │   └── service/                 # CategoriaService, ProductoProveedorService, ProductoPublicoService, AdminProductoService + impl/ + support/
    │   │       │
    │   │       ├── ordenes/                     # Módulo Checkout Split Order, Historial y Ventas Proveedor
    │   │       │   ├── controller/              # OrderController, ProviderSalesController
    │   │       │   ├── dto/request|response/    # CheckoutRequest/Response, OrdenPaginada, VentaPaginada, SubordenDetalleProveedor
    │   │       │   ├── entity/                  # Orden, SubordenFactura, OrdenItem, EstadoOrden, EstadoSuborden
    │   │       │   ├── exception/               # AutoCompraException, StockInsuficienteException
    │   │       │   ├── repository/              # OrdenRepository, SubordenFacturaRepository, OrdenItemRepository
    │   │       │   └── service/                 # OrderService, ProviderSalesService + impl/ + support/ (SplitOrderCalculator, OrderResponseMapper)
    │   │       │
    │   │       └── media/                       # Módulo Carga y Entrega de Imágenes (Sprint-B09)
    │   │           ├── controller/              # MediaController (/api/v1/media)
    │   │           ├── dto/response/            # MediaUploadResponseDTO
    │   │           └── service/                 # MediaStorageService + impl/LocalMediaStorageServiceImpl
    │   │
    │   └── resources/
    │       ├── application.properties           # Configuración base PostgreSQL, JPA, JWT, Swagger, Multipart
    │       ├── application-dev.yml              # Perfil desarrollo local
    │       └── application-prod.yml             # Perfil producción (ddl-auto: validate + env vars obligatorias)
    │
    └── test/java/com/compunex/b2b/              # 25 clases de prueba (83 tests pasando)
        ├── CompunexBackendApplicationTests.java
        ├── config/audit/AuditAspectTest.java
        ├── security/SecurityAuthorizationTest.java
        └── modules/
            ├── auth/ (AuthControllerTest, CompanyRegistrationTest, AuthServiceTest, RegistroCorporativoServiceTest)
            ├── catalogo/ (AdminProductControllerTest, AdminProductoControllerTest, CategoriaControllerTest, ProductoProveedorControllerTest, ProductoPublicoControllerTest, ProductoRepositoryTest, AdminProductoServiceTest, CategoriaServiceTest, ProductoProveedorServiceTest)
            ├── media/ (MediaControllerTest)
            ├── ordenes/ (OrderControllerTest, OrderHistoryTest, OrderSecurityTest, ProviderSalesControllerTest, OrderRepositoryTest, SubordenRepositoryTest, OrderServiceSplitOrderTest)
            └── perfiles/ (ProviderProfileControllerTest)
```

---

## 2. Convenciones de Segregación de DTOs (`request/` vs `response/`)

| Paquete | Rol Arquitectónico | Anotaciones Permitidas | Convención de Nombre | Ejemplo |
|---|---|---|---|---|
| **`dto/request/`** | Parsear el `@RequestBody` del cliente HTTP | `@Valid`, `@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Pattern`, `@Email` | `*RequestDTO.java` | `CrearProductoRequestDTO.java` |
| **`dto/response/`** | Serializar datos limpios hacia Angular SPA | `record` inmutables Java 21 o DTOs con `@Builder` | `*ResponseDTO.java` | `ProductoDetalleResponseDTO.java` |

> [!IMPORTANT]
> **Regla de Cero Exposición:** Ningún DTO en `dto/response/` expone credenciales (`hashContrasena`) ni campos internos ajenos al contrato en `CONTRATOS_JSON.md`.

---

## 3. Responsabilidades por Capa Arquitectónica

### 🎮 1. Capa de Controladores (`controller/`) — *Thin Controllers*
- Exposición de rutas `/api/v1/*`, validación `@Valid` de entrada y códigos HTTP (`200`, `201`, `204`).
- Delegación directa en interfaces de servicio especializadas por actor.

### ⚙️ 2. Capa de Servicios (`service/`, `service/impl/` y `service/support/`)
- Segregación por responsabilidad única (SRP): cada servicio cubre un caso de uso o actor específico (`ProductoProveedorService`, `ProductoPublicoService`, `AdminProductoService`, `AuthService`, `RegistroCorporativoService`).
- Colaboradores cohesivos en `support/` encapsulan lógica pura o mapeos compartidos (`SplitOrderCalculator`, `OrderResponseMapper`, `ProveedorContextHelper`, `ProductoEstadoHelper`).
- `@Transactional` delimita operaciones multi-entidad y rollback atómico (por ejemplo, `@Transactional(rollbackFor = Exception.class)` en checkout Split Order).

### 🗄️ 3. Capa de Persistencia (`repository/` y `entity/`)
- `JpaRepository` y `JpaSpecificationExecutor` (`ProductoSpecification`) sobre PostgreSQL 15+ (`ddl-auto=update` en `dev` / `validate` en `prod`).
- Secuencias lógicas persistentes mediante consultas `MAX(id)` en `OrdenRepository` y `SubordenFacturaRepository`.

---

## 4. Formato Uniforme de Errores (`ErrorResponseDTO`)

`GlobalExceptionHandler` captura excepciones de dominio (`BusinessException`, `ResourceNotFoundException`, `DuplicateResourceException`, `StockInsuficienteException`, `AutoCompraException`) y devuelve JSON estructurado con `status`, `error`, `mensaje` y `timestamp`:

```json
{
  "status": 400,
  "error": "Bad Request",
  "mensaje": "No puedes comprar tus propios productos: Memoria RAM ...",
  "timestamp": "2026-11-13T04:15:00"
}
```

---

## 5. Resumen Técnico Verificado

| Aspecto | Implementación Real Verificada |
|---|---|
| **Framework y Java** | Spring Boot `3.5.16` + Java `21` + Springdoc OpenAPI `2.8.9` |
| **Base de Datos** | PostgreSQL (`localhost:5432/compunex_b2b`) + H2 modo PostgreSQL en tests |
| **Entidades JPA** | 10 tablas (`usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`, `ordenes`, `subordenes_factura`, `orden_items`) |
| **Cobertura API** | 27 endpoints implementados (24 Core + `PATCH /providers/me/sales/{subordenId}/status` + 2 Media) |
| **Suite Automatizada** | `.\mvnw.cmd clean test` → `83` tests ejecutados, `0` fallos, `0` errores |
