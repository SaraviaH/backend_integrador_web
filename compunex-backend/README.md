# COMPUNEX B2B — Back-end (Spring Boot API REST)

> **Stack:** Java 25 (LTS) | Spring Boot 3.5.16 | Spring Security 6 + JWT | Spring Data JPA | PostgreSQL | Swagger/OpenAPI

---

## 1. Requisitos Previos

1. **JDK 25 (LTS)** instalado y configurado en `JAVA_HOME`.
2. **PostgreSQL** en ejecución en el puerto `5432`.
3. **IDE recomendado:** Apache NetBeans, IntelliJ IDEA o VS Code (también puede ejecutarse directamente con Maven Wrapper `mvnw`).

---

## 2. Configuración de Base de Datos (PostgreSQL)

1. Abre **pgAdmin**, **DBeaver** o la consola `psql`.
2. Crea una base de datos vacía con el nombre exacto:
   ```sql
   CREATE DATABASE compunex_b2b;
   ```
3. No es necesario crear tablas manualmente: Hibernate/JPA (`spring.jpa.hibernate.ddl-auto=update`) genera las tablas automáticamente y `DataInitializer` carga los datos semilla iniciales (categorías y usuarios de prueba) al arrancar.

---

## 3. Perfiles y Variables de Entorno

El proyecto cuenta con configuración base y perfiles en `src/main/resources/`:
* `application.properties` (configuración por defecto con fallback local)
* `application-dev.yml` (perfil de desarrollo)
* `application-prod.yml` (perfil de producción)

Variables de entorno soportadas:

| Variable | Descripción | Valor por defecto (desarrollo) |
|---|---|---|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/compunex_b2b` |
| `DB_USER` | Usuario de base de datos | `postgres` |
| `DB_PASSWORD` | Contraseña de base de datos | *(configurada en entorno local)* |
| `JWT_SECRET` | Clave secreta HMAC para firmar tokens JWT | *(clave local por defecto)* |
| `JWT_EXPIRATION_MS` | Expiración del token en milisegundos | `86400000` (24 horas) |
| `MEDIA_UPLOAD_DIR` | Carpeta local para imágenes subidas | `uploads` |

Ejemplo para definir variables en PowerShell antes de iniciar:
```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/compunex_b2b"
$env:DB_USER="postgres"
$env:DB_PASSWORD="tu_password"
$env:SPRING_PROFILES_ACTIVE="dev"
```

---

## 4. Cómo Ejecutar el Back-end

### Opción A — Desde terminal (Maven Wrapper)
```powershell
cd compunex-backend
.\mvnw.cmd spring-boot:run
```

### Opción B — Desde Apache NetBeans / IDE
1. Abrir la carpeta `compunex-backend` como proyecto Maven.
2. Ubicar `src/main/java/com/compunex/b2b/CompunexBackendApplication.java`.
3. Ejecutar el archivo (**Run File** / `Shift + F6`).

Una vez iniciado, el servidor escuchará en **`http://localhost:8080`**.

* **Swagger UI:** `http://localhost:8080/swagger-ui.html`
* **OpenAPI JSON:** `http://localhost:8080/api-docs`

---

## 5. Ejecutar Pruebas Automatizadas (JUnit 5 + H2)

Las pruebas unitarias, `@WebMvcTest`, `@DataJpaTest` y de seguridad JWT usan base de datos en memoria **H2**, por lo que no modifican PostgreSQL:

```powershell
cd compunex-backend
.\mvnw.cmd test
```

---

## 6. Estructura de Paquetes

```text
src/main/java/com/compunex/b2b/
├── config/          # SecurityConfig, OpenApiConfig, DataInitializer
├── exception/       # GlobalExceptionHandler
├── security/        # JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService
└── modules/
    ├── auth/        # Login, registro de proveedor, sesión (/me), cambio de contraseña
    ├── catalogo/    # Categorías, productos de proveedor (CRUD) y administración
    └── perfiles/    # PerfilProveedor y repositorio
```

---

## 7. Documentación Complementaria

* Contratos de API y guías: `docs/`
* Colección y casos Postman: [docs/06_DOCUMENTACION_CAMBIOS_Y_PRUEBAS_POSTMAN.md](docs/06_DOCUMENTACION_CAMBIOS_Y_PRUEBAS_POSTMAN.md)
