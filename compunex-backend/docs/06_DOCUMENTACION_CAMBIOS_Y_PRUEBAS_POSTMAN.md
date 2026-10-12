# 📑 Documentación Técnica de Cambios, Arquitectura y Guía de Pruebas en Postman — COMPUNEX B2B

Este documento detalla exhaustivamente todos los componentes **modificados**, los **añadidos**, las **funcionalidades implementadas**, lo que se **mantuvo intacto**, y la **guía paso a paso para probar la API en Postman**.

---

## 📌 Tabla de Contenidos
1. [Resumen Ejecutivo de Cambios](#-1-resumen-ejecutivo-de-cambios)
2. [Componentes y Archivos Nuevos Creados](#-2-componentes-y-archivos-nuevos-creados)
3. [Componentes y Archivos Modificados](#-3-componentes-y-archivos-modificados)
4. [Componentes Conservados Intactos (Sin Alteraciones)](#-4-componentes-conservados-intactos-sin-alteraciones)
5. [Matriz de Seguridad, Roles y Endpoints](#-5-matriz-de-seguridad-roles-y-endpoints)
6. [Guía Paso a Paso para Probar en Postman](#-6-guía-paso-a-paso-para-probar-en-postman)
7. [Batería de Pruebas Automatizadas (Maven)](#-7-batería-de-pruebas-automatizadas-maven)

---

## 🚀 1. Resumen Ejecutivo de Cambios

Se completaron los requerimientos del curso de **Desarrollo Web Integrado** (Sesiones 6, 7, 8 y 9) y la resolución de avisos del panel *Problems* de VS Code, cumpliendo con los siguientes pilares:

* **Sesión 6 (Validación y Manejo de Datos):** Incorporación de anotaciones de Bean Validation (`@NotBlank`, `@Positive`, `@Size`) en DTOs y persistencia relacional con JPA/Hibernate.
* **Sesión 7 (Consultas JPQL Personalizadas y Transacciones):** Creación de métodos con `@Query` para búsquedas insensibles a mayúsculas/minúsculas (`LIKE LOWER(...)`), filtros por propietario y exclusión de registros eliminados, bajo transaccionalidad atómica (`@Transactional`).
* **Sesión 8 (Seguridad, Roles y JWT):** Restricción de acceso en Spring Security 6 basada en roles (`ADMIN`, `PROVEEDOR`), emisión de JWT con claim `rol`, respuesta `401 Unauthorized` en rutas protegidas y `403 Forbidden` ante intentos de acceso no autorizados.
* **Sesión 9 (Módulo de Administración):** Implementación de endpoints de supervisión global de catálogo y control de estados de publicación para el administrador.
* **Depuración de Avisos VS Code:** Reemplazo de `@MockBean` obsoleto por `@MockitoBean`, eliminación de anotaciones `@Repository` redundantes en interfaces de Spring Data, y creación de metadatos de configuración en `META-INF` para propiedades JWT personalizadas.

---

## 🆕 2. Componentes y Archivos Nuevos Creados

| Archivo Creado | Ubicación | Funcionalidad / Propósito |
|---|---|---|
| **`AdminProductoController.java`** | `.../modules/catalogo/controller/` | Controlador REST exclusivo para el rol `ADMIN`. Expone `GET /api/v1/admin/products` (catálogo global paginado con búsqueda) y `PATCH /api/v1/admin/products/{id}/status` (cambio de estado de publicación). |
| **`OpenApiConfig.java`** | `.../config/` | Configuración de OpenAPI 3.0 / Swagger UI para registrar el esquema de seguridad Bearer JWT (`HTTP Bearer`). Añade el botón interactivo **Authorize** en Swagger UI. |
| **`additional-spring-configuration-metadata.json`** | `.../src/main/resources/META-INF/` | Metadatos JSON de Spring Boot para documentar `jwt.secret` y `jwt.expiration-ms`. Elimina los avisos de propiedad desconocida en VS Code sin alterar la lectura de propiedades. |
| **`AdminProductoControllerTest.java`** | `.../modules/catalogo/controller/` | Pruebas unitarias de capa web para el controlador de administración (`@WebMvcTest`), verificando listado y actualización de estado. |
| **`ProductoRepositoryTest.java`** | `.../modules/catalogo/repository/` | Pruebas de integración de persistencia con `@DataJpaTest` para validar las consultas personalizadas JPQL con `@Query`. |
| **`SecurityAuthorizationTest.java`** | `.../security/` | Pruebas de integración de seguridad que validan el filtro de seguridad, verificando respuestas `401 Unauthorized`, `403 Forbidden` y `200 OK` según el rol. |
| **`application.properties` (Test)** | `.../src/test/resources/` | Configuración hermética de pruebas con base de datos en memoria H2 (`MODE=PostgreSQL`, `create-drop`), permitiendo ejecutar `mvn test` sin requerir PostgreSQL en ejecución. |
| **`05_GUIA_ENDPOINTS_Y_PRUEBAS.md`** | `.../docs/` | Documento resumen de contratos, roles y métodos de ejecución. |

---

## 🛠️ 3. Componentes y Archivos Modificados

### 3.1. Seguridad y Autenticación
* **`SecurityConfig.java`:**
  * Se configuró `HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)` para que accesos sin token respondan `401` en lugar de `403`.
  * Se aplicó la matriz de permisos estricta:
    * `/api/v1/admin/**` -> `.hasRole("ADMIN")`
    * `/api/v1/providers/**` -> `.hasRole("PROVEEDOR")`
    * `/api/v1/auth/me` y `/api/v1/auth/password` -> `.authenticated()`
    * `POST /api/v1/auth/login`, `GET /api/v1/categories/**`, Swagger y consola H2 -> `.permitAll()`
* **`JwtTokenProvider.java`:**
  * Se añadió la inclusión del claim de rol en el token: `claims.put("rol", ...)` al generar el token JWT.
  * Se implementó el método público `obtenerRolDesdeToken(String token)` para extraer el rol del usuario autenticado.
* **`DataInitializer.java`:**
  * Se incorporó el sembrado automático del usuario de prueba **Administrador** (`admin@compunex.com` / `AdminPassword2026!`).
  * Se añadió la sincronización automática de la contraseña del **Proveedor** (`ventas.mayoristas@technova.com` / `PasswordMayorista123!`) verificando el hash BCrypt con `getHashContrasena()` y `setHashContrasena()`.

### 3.2. Catálogo y Persistencia (JPQL y Transaccionalidad)
* **`ProductoRepository.java`:**
  * Se añadió la consulta JPQL de búsqueda para proveedor:
    ```sql
    @Query("SELECT p FROM Producto p WHERE p.proveedor.id = :proveedorId AND p.estado <> :estado AND LOWER(p.titulo) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Producto> buscarPorProveedorYTitulo(...);
    ```
  * Se añadieron las consultas JPQL para el administrador:
    ```sql
    @Query("SELECT p FROM Producto p WHERE p.estado <> :estado AND LOWER(p.titulo) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Producto> buscarTodosPorTitulo(...);
    Page<Producto> findAllByEstadoNot(...);
    ```
  * Se retiró la anotación redundante `@Repository` (Spring Data JPA ya registra automáticamente interfaces que extienden `JpaRepository`).
* **`ProductoService.java` e `ProductoServiceImpl.java`:**
  * Se agregó el parámetro opcional `String search` al método `listarMisProductos`.
  * Se implementaron los métodos `listarProductosAdmin(String search, Pageable pageable)` y `cambiarEstadoPublicacionAdmin(Long id, CambiarEstadoProductoDTO dto)`.
  * Se aseguró la anotación `@Transactional` en operaciones que mutan estado para garantizar atomicidad y rollback ante errores.
* **`ProductoProveedorController.java`:**
  * Se incorporó `@RequestParam(required = false) String search` en `GET /api/v1/providers/me/products`.

### 3.3. DTOs y Validación
* **`CrearProductoRequestDTO.java`:** Agregada validación `@NotBlank` en `descripcion` y `@Positive` en `precioTotalRef`.
* **`ActualizarProductoRequestDTO.java`:** Consistencia en campos de actualización.
* **`CambiarPasswordDTO.java`:** Agregada validación `@Size(min = 6)` para la nueva clave.

### 3.4. Limpieza de Avisos de VS Code en Tests y Repositorios
* **`UsuarioRepository.java` y `PerfilProveedorRepository.java`:** Eliminada anotación `@Repository` redundante.
* **`CompunexBackendApplicationTests.java`:** Eliminado el import no utilizado `org.junit.jupiter.api.Disabled` y habilitada la prueba de carga del contexto Spring Boot.
* **`AuthControllerTest.java`, `CategoriaControllerTest.java`, `ProductoProveedorControllerTest.java`:** Migración de `@MockBean` (en desuso a partir de Spring Boot 3.4) a `@MockitoBean` (`org.springframework.test.context.bean.override.mockito.MockitoBean`).
* **`COMPUNEX_B2B_Coleccion_Postman.json`:** Actualizada la colección con la carpeta `08. Administración`, petición `[0.1b] Login Administrador` y parámetro `?search=` en las peticiones de catálogo.

---

## 🔒 4. Componentes Conservados Intactos (Sin Alteraciones)

Para respetar los lineamientos del proyecto y no romper contratos ni arquitectura previa:

1. **Modelo de Datos y Tablas de Base de Datos:**
   * No se cambiaron las tablas relacionales existentes en PostgreSQL (`usuarios`, `perfiles_proveedor`, `productos`, `categorias`, `subcategorias`, `productos_especificaciones`, `imagenes_producto`).
   * No se eliminó ningún campo ni se cambiaron nombres de columnas.
2. **Arquitectura Multi-Tenant:**
   * Se conservó la regla de negocio donde un proveedor únicamente puede consultar, actualizar o eliminar sus propios productos (`findByIdAndProveedorId`). Si intenta operar sobre un ID ajeno, la API devuelve `404 Not Found`.
3. **Contratos de Endpoints Existentes:**
   * Rutas como `/api/v1/auth/login`, `/api/v1/auth/me`, `/api/v1/categories`, `/api/v1/providers/me/products` mantienen sus URLs, códigos de estado HTTP y formatos de respuesta JSON originales.
4. **Seguridad y Criptografía:**
   * Se mantuvo BCrypt con 10 rondas de salt para el hashing de credenciales.
   * Se mantuvo la vigencia del token JWT y el formato Bearer.
5. **Versiones de Tecnologías Core:**
   * Java 21 LTS y Spring Boot 3.5.16 se conservaron exactamente en las versiones estipuladas.

---

## 🚦 5. Matriz de Seguridad, Roles y Endpoints

### Credenciales de Prueba (Sembradas en `DataInitializer`)
* **Proveedor:** `ventas.mayoristas@technova.com` / `PasswordMayorista123!`
* **Administrador:** `admin@compunex.com` / `AdminPassword2026!`

| Endpoint | Método | Rol Requerido | Cabecera | Comportamiento |
|---|---|---|---|---|
| `/api/v1/categories` | `GET` | *Público* | Ninguna | Retorna listado de categorías activas con total de productos (`200 OK`). |
| `/api/v1/auth/login` | `POST` | *Público* | Ninguna | Valida credenciales y retorna `{ "token": "...", "tipoToken": "Bearer", ... }`. |
| `/api/v1/auth/me` | `GET` | Cualquiera autenticado | `Bearer <token>` | Devuelve `correo`, `nombre`, `rol` y `valido: true`. |
| `/api/v1/auth/password` | `PATCH` | Cualquiera autenticado | `Bearer <token>` | Actualiza la contraseña validando la anterior con BCrypt. |
| `/api/v1/providers/me/products` | `GET` | `PROVEEDOR` | `Bearer <token>` | Lista productos del proveedor autenticado. Admite `?search=Kingston&page=0&size=10`. |
| `/api/v1/providers/me/products/{id}` | `GET` | `PROVEEDOR` | `Bearer <token>` | Ficha técnica completa de un producto propio. |
| `/api/v1/providers/me/products` | `POST` | `PROVEEDOR` | `Bearer <token>` | Crea un nuevo producto con especificaciones e imágenes (`201 Created`). |
| `/api/v1/providers/me/products/{id}` | `PUT` | `PROVEEDOR` | `Bearer <token>` | Actualiza completamente un producto propio (`200 OK`). |
| `/api/v1/providers/me/products/{id}/status` | `PATCH` | `PROVEEDOR` | `Bearer <token>` | Alterna entre `ACTIVO` e `INACTIVO` (`200 OK`). |
| `/api/v1/providers/me/products/{id}` | `DELETE` | `PROVEEDOR` | `Bearer <token>` | Eliminación lógica (`204 No Content`). |
| `/api/v1/admin/products` | `GET` | `ADMIN` | `Bearer <token>` | Supervisión de productos globales de todos los proveedores. Admite `?search=RAM`. |
| `/api/v1/admin/products/{id}/status` | `PATCH` | `ADMIN` | `Bearer <token>` | Modifica el estado de cualquier producto sin restricción de dueño. |

---

## 📮 6. Guía Paso a Paso para Probar en Postman

### Paso 1: Importar la Colección en Postman
1. Abre **Postman**.
2. Haz clic en el botón **Import** (esquina superior izquierda).
3. Selecciona o arrastra el archivo:
   `compunex-backend/docs/02_contratos_api/01_apis_por_rol/001-Apis-Formalizado-En-desarrollo/COMPUNEX_B2B_Coleccion_Postman.json`
4. Aparecerá la colección titulada **`COMPUNEX B2B - Colección Oficial API REST (Fase 1)`**.

> [!TIP]
> **Gestión Automática del Token:**  
> Las peticiones de login ya incluyen un script en la pestaña **Tests** que toma automáticamente el token JWT devuelto y lo guarda en la variable de entorno/colección `token`. No necesitas copiar y pegar tokens manualmente entre peticiones.

---

### Paso 2: Ejecución de Casos de Prueba

#### Caso de Prueba 1: Endpoint Público (Sin Autenticación)
* **Petición en Postman:** `01. Categorías / [1.1] Listar Categorías Activas (Público)`
* **Método y URL:** `GET http://localhost:8080/api/v1/categories`
* **Resultado Esperado:** Código `200 OK`. Array con categorías (`ram`, `ssd`, etc.) y sus contadores de productos.

---

#### Caso de Prueba 2: Autenticación de Proveedor
* **Petición en Postman:** `00. Autenticación y Sesión / [0.1] Login y Emisión de Token JWT`
* **Método y URL:** `POST http://localhost:8080/api/v1/auth/login`
* **Body (JSON):**
  ```json
  {
    "correo": "ventas.mayoristas@technova.com",
    "contrasena": "PasswordMayorista123!"
  }
  ```
* **Resultado Esperado:** Código `200 OK`. Recibes el token JWT y el script guarda la variable `token`.

---

#### Caso de Prueba 3: Consultar Perfil de Sesión del Proveedor
* **Petición en Postman:** `00. Autenticación y Sesión / [0.2] Obtener Sesión Actual (/me)`
* **Método y URL:** `GET http://localhost:8080/api/v1/auth/me`
* **Cabecera enviada:** `Authorization: Bearer {{token}}`
* **Resultado Esperado:** Código `200 OK`.
  ```json
  {
    "correo": "ventas.mayoristas@technova.com",
    "nombre": "TechNova Mayorista S.A.C.",
    "rol": "PROVEEDOR",
    "valido": true
  }
  ```

---

#### Caso de Prueba 4: Listado de Productos Propios y Búsqueda JPQL
* **Petición en Postman:** `07. Proveedor - Catálogo / [7.1] Listar Mis Productos Paginados`
* **Método y URL:** `GET http://localhost:8080/api/v1/providers/me/products?page=0&size=10&search=Kingston`
* **Resultado Esperado:** Código `200 OK`. Retorna únicamente los productos que coinciden con el título `"Kingston"` pertenecientes a TechNova.

---

#### Caso de Prueba 5: Creación de un Nuevo Producto (Bean Validation)
* **Petición en Postman:** `07. Proveedor - Catálogo / [7.3] Crear Nuevo Producto (Completo)`
* **Método y URL:** `POST http://localhost:8080/api/v1/providers/me/products`
* **Body (JSON):**
  ```json
  {
    "categoriaId": "ram",
    "titulo": "Memoria RAM Corsair Vengeance 32GB DDR5 6000MHz",
    "descripcion": "Kit de memoria de alta velocidad para plataformas AMD e Intel.",
    "modeloComercial": "DISTRIBUIDOR_OFICIAL",
    "tipoFormato": "Caja Master x5",
    "unidadesPorPaquete": "5 unidades",
    "pedidoMinimo": "1 caja",
    "precioUnitarioRef": 110.00,
    "precioTotalRef": 550.00,
    "moneda": "USD",
    "terminosComerciales": "Garantía de por vida directa con el fabricante.",
    "especificaciones": [
      { "nombre": "Capacidad", "valor": "32 GB" },
      { "nombre": "Frecuencia", "valor": "6000 MHz" }
    ],
    "imagenes": [
      { "url": "https://img.compunex.com/products/corsair-32gb.jpg", "orden": 1 }
    ]
  }
  ```
* **Resultado Esperado:** Código `201 Created` con el objeto del producto generado y su ID asignado.

---

#### Caso de Prueba 6: Alternar Estado de Publicación de Producto
* **Petición en Postman:** `07. Proveedor - Catálogo / [7.5] Cambiar Estado de Publicación`
* **Método y URL:** `PATCH http://localhost:8080/api/v1/providers/me/products/1/status`
* **Body (JSON):**
  ```json
  {
    "estado": "INACTIVO"
  }
  ```
* **Resultado Esperado:** Código `200 OK` reflejando el nuevo estado del producto.

---

#### Caso de Prueba 7: Autenticación de Administrador
* **Petición en Postman:** `00. Autenticación y Sesión / [0.1b] Login Administrador`
* **Método y URL:** `POST http://localhost:8080/api/v1/auth/login`
* **Body (JSON):**
  ```json
  {
    "correo": "admin@compunex.com",
    "contrasena": "AdminPassword2026!"
  }
  ```
* **Resultado Esperado:** Código `200 OK`. La variable `token` se actualiza con los privilegios de `ADMIN`.

---

#### Caso de Prueba 8: Consulta de Catálogo Global por Administrador (Sesión 9)
* **Petición en Postman:** `08. Administración / [8.1] Listar Productos Globales (Admin)`
* **Método y URL:** `GET http://localhost:8080/api/v1/admin/products?page=0&size=10&search=RAM`
* **Resultado Esperado:** Código `200 OK`. Retorna productos de todos los proveedores en el sistema con el detalle `proveedorRazonSocial`.

---

#### Caso de Prueba 9: Cambio Administrativo de Estado de Producto
* **Petición en Postman:** `08. Administración / [8.2] Modificar Estado de Producto (Admin)`
* **Método y URL:** `PATCH http://localhost:8080/api/v1/admin/products/1/status`
* **Body (JSON):**
  ```json
  {
    "estado": "PENDIENTE_REVISION"
  }
  ```
* **Resultado Esperado:** Código `200 OK` actualizando el estado de forma forzosa sin requerir ser el dueño del producto.

---

#### Caso de Prueba 10: Validación de Rechazo de Seguridad (403 Forbidden y 401 Unauthorized)
1. **Intento de Acceso con Rol Insuficiente (403):**
   * Realiza login como Proveedor (`[0.1]`).
   * Intenta llamar a `GET http://localhost:8080/api/v1/admin/products`.
   * **Resultado:** Código `403 Forbidden` (El proveedor no puede acceder a las funciones del administrador).
2. **Intento de Acceso sin Token (401):**
   * Elimina la cabecera `Authorization` en cualquier endpoint privado (por ejemplo `GET http://localhost:8080/api/v1/auth/me`).
   * **Resultado:** Código `401 Unauthorized`.

---

## 🧪 7. Batería de Pruebas Automatizadas (Maven)

El backend cuenta con una batería completa de pruebas unitarias y de integración que se ejecutan contra una base de datos en memoria H2 aislada:

```powershell
# Desde el directorio compunex-backend:
.\mvnw.cmd test
```

### Resumen del Test Suite:
* **Total de pruebas ejecutadas:** 53
* **Fallos (Failures):** 0
* **Errores (Errors):** 0
* **Omitidas (Skipped):** 0
* **Estado:** **`BUILD SUCCESS`**

Cubrimiento de pruebas:
1. `CompunexBackendApplicationTests`: Carga del contexto de Spring Boot 3.5.16.
2. `AuthControllerTest`: Pruebas del controlador de autenticación (Login, Me, Validaciones).
3. `CategoriaControllerTest`: Pruebas de endpoints de categorías y subcategorías.
4. `ProductoProveedorControllerTest`: Pruebas de operaciones CRUD del proveedor.
5. `AdminProductoControllerTest`: Pruebas del controlador administrativo.
6. `ProductoRepositoryTest`: Pruebas de consultas JPQL con `@Query`.
7. `SecurityAuthorizationTest`: Pruebas integrales de matrices de seguridad y control de acceso RBAC.
