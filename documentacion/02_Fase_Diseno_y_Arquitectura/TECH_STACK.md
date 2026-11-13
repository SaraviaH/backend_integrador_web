# TECH_STACK.md — Pila Tecnológica Congelada (COMPUNEX B2B)

> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Propósito:** Registrar las versiones exactas del stack implementado en `compunex-backend`, la arquitectura objetivo del Front-end y las decisiones técnicas vigentes.

---

## 🏛️ 1. Decisiones de Stack Arquitectónico (D1 - D4)

| Decisión | Qué establece | Justificación / Requisito |
| :---: | :--- | :--- |
| **D1** | **Monolito Modular por Capas en Spring Boot:** Separación explícita en `controller`, `service`, `repository`, `entity`, `dto`, `security` y `exception`. | Mantiene reglas de negocio testables en servicios y cumple la convención `camelCase` de la rúbrica (`RNF-001`, `RNF-002`). |
| **D2** | **Estrategia Local-First:** Base de datos en memoria `H2` para pruebas unitarias/integración y motor relacional local para ejecución. | Permite correr los 59 tests JUnit al instante sin depender de servidores externos ni nube. |
| **D3** | **Seguridad Stateless con JWT (`jjwt 0.12.6`) + BCrypt:** Autenticación sin sesiones de servidor, filtro por petición y control RBAC. | Cumple `RF-001`, `RF-002` y `RNF-001` con aislamiento por rol (`PROVEEDOR`, `ADMIN`). |
| **D4** | **Contratos REST + OpenAPI/Swagger:** Documentación viva generada en `/api-docs` y `/swagger-ui.html`. | Desacopla el desarrollo Back-end y Front-end Angular evitando ambigüedades de DTOs. |

---

## 🛠️ 2. Matriz Tecnológica por Capa

| Capa / Subsistema | Tecnología y Versión Exacta | Justificación Técnica (RF/RNF) | Alternativa / Nota Local |
| :--- | :--- | :--- | :--- |
| **Backend / Servidor** | **Java 21 (LTS)** + **Spring Boot `3.5.16`** | Tipado fuerte, ecosistema maduro, validación declarativa (`spring-boot-starter-validation`) y seguridad integrada. | Ejecución local vía Maven Wrapper (`.\mvnw.cmd`). |
| **Seguridad y Tokens** | **Spring Security 6** + **JJWT `0.12.6`** + **BCrypt** | Validación de firma/expiración JWT y hashing seguro de contraseñas (`RNF-001`). | Filtro `JwtAuthenticationFilter` con `SessionCreationPolicy.STATELESS`. |
| **Persistencia / ORM** | **Spring Data JPA / Hibernate** | Abstracción de repositorios, paginación nativa y carga por lotes (`@BatchSize`). | `ddl-auto=update` en desarrollo local. |
| **Base de Datos Principal** | **PostgreSQL** *(configurado actualmente en `pom.xml`)* | Integridad referencial ACID y soporte completo para tipos `UUID`, `TEXT` y `NUMERIC(12,2)`. | **Nota ATF3:** Pendiente confirmar si se migra a **MySQL** (`mysql-connector-j`) con usuario ≠ `root`. |
| **Base de Datos de Pruebas** | **H2 In-Memory (`com.h2database:h2`)** | Ejecución rápida e independiente de pruebas JUnit (`scope: test`). | Aislada por suite de pruebas. |
| **Documentación API** | **Springdoc OpenAPI `2.6.0`** | Interfaz Swagger UI en `/swagger-ui.html` y JSON en `/api-docs`. | Disponible en local sin configuración externa. |
| **Herramienta de Pruebas Back** | **JUnit 5 + Spring Boot Test + Spring Security Test** | Cobertura unitaria, `@WebMvcTest` y `@DataJpaTest` (59 tests actuales). | `.\mvnw.cmd test` en local. |
| **Frontend / Cliente (Objetivo)** | **Angular** + **TypeScript** + **Framework CSS responsivo** | SPA modular (`kebab-case`), consumo REST con `HttpClient`, interceptores JWT/Error y UI responsiva (`RNF-004`). | Servidor de desarrollo local `ng serve` contra `localhost:8080`. |

---

## 🚫 3. Prácticas Prohibidas

| Práctica Prohibida | Motivo de la Prohibición |
| :--- | :--- |
| **Credenciales o `jwt.secret` hardcodeados en entrega final** | Riesgo de seguridad (`RSK-02`); deben externalizarse mediante perfiles `dev`/`prod` y variables `${...}` (`RNF-003`). |
| **URLs quemadas en servicios Angular** | Rompe la portabilidad entre desarrollo y producción; debe usarse `environment.apiUrl`. |
| **Lógica de negocio en controladores o triggers SQL** | Dificulta las pruebas unitarias aisladas en `service` y rompe la separación de capas. |
