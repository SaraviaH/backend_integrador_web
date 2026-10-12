# INFORME TÉCNICO Y EVIDENCIAS DE IMPLEMENTACIÓN: SEGURIDAD, ROLES, JPA Y JPQL

**Universidad / Curso:** Desarrollo Web Integrado  
**Proyecto:** COMPUNEX B2B — Plataforma Mayorista de Hardware  
**Autor:** Edison Sivipaucar Quispe  
**Fecha:** Octubre, 2026  
**Formato Académico:** Estándar APA 7ma Edición  

---

## Resumen Ejecutivo

El presente documento expone la implementación técnica y validación experimental de los módulos de seguridad perimetral, control de accesos y persistencia de datos desarrollados para la plataforma **COMPUNEX B2B**. Se detallan los mecanismos de autenticación sin estado mediante **Spring Security 6** y **JWT (JSON Web Tokens)**, el modelo de autorización basado en roles (**RBAC**) con aislamiento multi-tenant, el mapeo objeto-relacional mediante **JPA / Hibernate**, y la optimización de consultas a la base de datos PostgreSQL utilizando **JPQL** y grafos de entidades (`@EntityGraph`). Asimismo, se proveen evidencias estructuradas paso a paso para la captura de pruebas en **Postman** y ejecución de tests unitarios en **JUnit 5 / Maven**.

---

## 1. Seguridad con Spring Security 6

La arquitectura de seguridad se basa en una cadena de filtros (`SecurityFilterChain`) configurada en modo sin estado (`SessionCreationPolicy.STATELESS`), eliminando el almacenamiento de sesiones en el servidor y delegando la autenticidad a tokens criptográficos.

### Tabla 1
*Matriz de Permisos y Control de Acceso por Endpoint (RBAC)*

| Endpoint / Patrón | Método HTTP | Regla de Acceso | Justificación Técnica |
|---|---|---|---|
| `/api/v1/auth/login` | POST | `permitAll()` | Endpoint público para autenticación y emisión de JWT. |
| `/api/v1/auth/register`, `/api/v1/auth/registro-proveedor` | POST | `permitAll()` | Endpoint público para registro corporativo de proveedores mayoristas con JWT. |
| `/api/v1/categories/**` | GET | `permitAll()` | Catálogo público para consulta de compradores no autenticados. |
| `/swagger-ui/**`, `/api-docs/**` | GET | `permitAll()` | Acceso a documentación interactiva OpenAPI. |
| `/api/v1/admin/**` | ANY | `hasRole("ADMIN")` | Acceso exclusivo a usuarios con rol Administrador. |
| `/api/v1/providers/me/**` | ANY | `hasRole("PROVEEDOR")` | Operaciones de gestión del stock exclusivo del proveedor. |
| `/api/v1/auth/me` | GET | `authenticated()` | Consulta del perfil para cualquier usuario autenticado. |
| `/api/v1/auth/password` | PATCH | `authenticated()` | Cambio de credenciales para usuarios autenticados. |
| *Resto de rutas* | ANY | `authenticated()` | Principio de menor privilegio (denegación por defecto). |

*Nota.* Elaboración propia basada en `SecurityConfig.java`.

### Configuración Central de Seguridad
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/login", "/api/v1/categories/**").permitAll()
            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
            .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/v1/providers/me/**").hasRole("PROVEEDOR")
            .anyRequest().authenticated()
        )
        .exceptionHandling(ex -> ex
            .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

---

## 2. Autenticación y Autorización con JWT

El flujo de autenticación implementa tokens firmados mediante el algoritmo simétrico **HMAC-SHA256**. Cada token encapsula la identidad del usuario (`Subject`) y sus roles concedidos (`Claims`), permitiendo la verificación perimetral inmediata.

### Tabla 2
*Especificación Técnica de los Tokens JWT*

| Propiedad | Valor / Mecanismo | Propósito / Beneficio |
|---|---|---|
| Algoritmo | HMAC-SHA256 (`Keys.hmacShaKeyFor`) | Garantiza la integridad y autenticidad del token. |
| Tiempo de Expiración | 86,400,000 ms (24 horas) | Limita la ventana de riesgo ante tokens comprometidos. |
| Claim `roles` | Lista de autoridades (ej. `["ROLE_ADMIN"]`) | Permite a Spring Security reconstruir el contexto RBAC sin consultar la base de datos en cada petición. |
| Filtro de Validación | `JwtAuthenticationFilter` | Extrae el header `Authorization: Bearer <token>`, valida firma y establece `SecurityContextHolder`. |

*Nota.* Parámetros configurados en `JwtService.java` y `application.properties`.

---

## 3. Control de Roles y Aislamiento Multi-Tenant

Para prevenir accesos no autorizados y fugas de datos entre empresas proveedoras, se implementó un control a dos niveles:

1. **Nivel Perimetral:** Spring Security valida que el usuario posea `ROLE_PROVEEDOR` para ingresar a `/api/v1/providers/me/**`.
2. **Nivel de Servicio (Aislamiento de Datos):** La lógica de negocio no recibe el `empresaId` como parámetro del cliente. En su lugar, el backend extrae el ID de la empresa directamente del usuario autenticado en sesión (`SecurityContextHolder`), impidiendo la manipulación de inventarios ajenos (*Insecure Direct Object Reference - IDOR*).

---

## 4. Persistencia Objeto-Relacional con JPA y Hibernate

El modelo relacional se mapea a través de entidades administradas por **Hibernate**. Entre sus características destacan:

* **Relaciones Bidireccionales:** Mapeos `@OneToMany` y `@ManyToOne` entre `Categoria`, `Subcategoria` y `Producto`.
* **Cargas Perezosas (`FetchType.LAZY`):** Se evita la sobrecarga de memoria cargando colecciones secundarias solo cuando se solicitan explícitamente.
* **Eliminación Lógica (*Soft-Delete*):** Los productos no se borran físicamente (`DELETE`); en su lugar, se actualiza la bandera `activo = false` para preservar la trazabilidad e historial comercial.
* **Gestión Transaccional:** Uso de anotaciones `@Transactional` para asegurar consistencia ACID en operaciones de escritura.

---

## 5. Consultas Personalizadas con JPQL y Optimización

Para consultas que superan los métodos derivados de Spring Data, se definieron consultas en lenguaje **JPQL** (`@Query`) orientadas al modelo de objetos:

### Búsqueda Case-Insensitive con Paginación
```java
@Query("""
    SELECT p FROM Producto p
    WHERE p.empresa.id = :empresaId
      AND p.activo = true
      AND (:q IS NULL OR :q = '' OR
           LOWER(p.nombre) LIKE LOWER(CONCAT('%', :q, '%')) OR
           LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%')))
""")
Page<Producto> buscarPorEmpresaYFiltro(
    @Param("empresaId") Long empresaId,
    @Param("q") String q,
    Pageable pageable
);
```

### Optimización contra el Problema N+1 mediante `@EntityGraph`
Para evitar múltiples consultas secundarias durante la lectura del catálogo de categorías con sus subcategorías, se configuró `@EntityGraph`:
```java
@EntityGraph(attributePaths = {"subcategorias"})
List<Categoria> findAll();
```
Esto fuerza una única consulta con `LEFT JOIN`, reduciendo la latencia de red y el consumo de conexiones del pool.

---

## 6. Registro de Evidencias (Pruebas Postman y Automatizadas)

A continuación se presentan los espacios formalmente rotulados bajo norma APA para adjuntar las capturas de pantalla de validación:

### Figura 1
*Autenticación Exitosa y Generación de Token JWT (Postman)*  
*(Pegar captura de respuesta HTTP 200 con `accessToken`)*  
*Nota.* Petición POST a `/api/v1/auth/login` con credenciales de Administrador.

### Figura 2
*Rechazo por Credenciales Inválidas - HTTP 401 Unauthorized*  
*(Pegar captura de respuesta HTTP 401)*  
*Nota.* Intento de autenticación con contraseña incorrecta.

### Figura 3
*Validación de Claims e Identidad en `/api/v1/auth/me`*  
*(Pegar captura de respuesta HTTP 200 con roles y empresa)*  
*Nota.* Endpoint protegido que valida el token Bearer en cabecera.

### Figura 4
*Control de Acceso Perimetral RBAC - Acceso Denegado HTTP 403 Forbidden*  
*(Pegar captura de respuesta HTTP 403 Forbidden)*  
*Nota.* Usuario con rol PROVEEDOR intentando acceder a ruta exclusiva de ADMIN.

### Figura 5
*Ejecución de Consulta JPQL con Búsqueda Case-Insensitive y Paginación*  
*(Pegar captura de respuesta HTTP 200 con catálogo filtrado por query `?q=`)*  
*Nota.* Verificación de filtro JPQL que retorna productos del proveedor.

### Figura 6
*Mapeo JPA con Relaciones y Soft-Delete en Gestión de Productos*  
*(Pegar captura de actualización o eliminación lógica de producto)*  
*Nota.* Respuesta HTTP 200 confirmando la actualización de estado sin borrado físico.

### Figura 7
*Ejecución de la Colección Completa en Postman Collection Runner*  
*(Pegar captura de Postman Runner con tests en verde)*  
*Nota.* Ejecución automatizada de los 11 endpoints con pruebas unitarias de aserción.

### Figura 8
*Resultados de Pruebas Automatizadas Unitarias con JUnit 5 y Maven*  
*(Pegar captura de terminal: `BUILD SUCCESS` - 53 tests passed)*  
*Nota.* Ejecución de `mvn clean test` validando el 100% de servicios y repositorios.

---

## 7. Conclusiones

1. La combinación de **Spring Security 6** y **JWT** ofrece una solución robusta y escalable para entornos B2B, eliminando el estado de sesión y reduciendo la carga en base de datos.
2. El esquema de **Roles y Permisos (RBAC)** garantiza el aislamiento de datos multi-tenant, impidiendo que un proveedor altere información de terceros.
3. El uso coordinado de **JPA / Hibernate** y **JPQL**, complementado con `@EntityGraph`, garantiza alta eficiencia en las consultas SQL generadas, resolviendo problemas de rendimiento como el cuello de botella $N+1$.
4. Las pruebas automatizadas (53 pruebas unitarias) y la colección estructurada en Postman respaldan la confiabilidad y calidad del software implementado.
