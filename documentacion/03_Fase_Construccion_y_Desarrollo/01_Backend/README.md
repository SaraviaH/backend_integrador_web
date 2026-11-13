# 01. Backend: Normas de Construcción y Desarrollo Local

> **Ámbito:** Especialidad Técnica · Backend  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Proyecto:** COMPUNEX B2B  
> **Pila Tecnológica:** Java 17 · Spring Boot 3.2.0 · Spring Security 6.2 · JJWT 0.12.3 · Spring Data JPA · MySQL 8.0 (XAMPP local puerto 3306) · Maven  
> **Regla de Operación:** Toda la lógica de negocio se escribe desacoplada de frameworks y se prueba con tests unitarios locales rápidos. La planificación y ejecución de sprints reside exclusivamente en [`.sprints/BACKLOG.md`](../.sprints/BACKLOG.md).

---

## 🏛️ Principios de Construcción de Backend

### 1. Servicios Puros y Aislamiento de Dominio
* Las 8 reglas de negocio (`RN-001..RN-008` de `DOMAIN.md`) residen en clases de servicio puras (`com.compunex.backend.service.*`).
* No importan clases web (`HttpServletRequest`, anotaciones de Spring Web) ni acoplamientos rígidos; deben poder probarse con JUnit 5 y Mockito puros en milisegundos sin levantar el contexto de Spring (`@SpringBootTest` solo para integración).

### 2. Controladores Enfocados en Transporte y Contratos
* Paquete: `com.compunex.backend.controller.*`.
* Rutas base prefijadas con `/api/v1/*`.
* Los controladores validan el payload de entrada con Jakarta Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@Min`, `@Pattern`), extraen la identidad del usuario del `Authentication` de Spring Security y delegan en el servicio.
* Respetan al pie de la letra los esquemas y códigos HTTP de `02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`.
* Respuestas de error estructuradas con el estándar oficial **RFC 9457** (`type`, `title`, `status`, `detail`).

### 3. Repositorios y Persistencia Local en MySQL
* Paquete: `com.compunex.backend.repository.*`.
* Implementan `JpaRepository` con consultas JPQL o SQL nativo parametrizadas (`:parametro`) para prevenir inyecciones SQL.
* Transaccionalidad delimitada con `@Transactional(readOnly = true)` por defecto en servicios, y `@Transactional` explícito en operaciones de escritura (crucial para el algoritmo de Split Order en `Sprint-05`).

### 4. Seguridad e Identidad (Spring Security 6.2 + JJWT)
* Autenticación stateless mediante cabecera `Authorization: Bearer <token>`.
* El token JWT contiene en sus claims: `sub` (username/email), `empresa_id`, `rol` (`ROLE_COMPRADOR`, `ROLE_PROVEEDOR`, `ROLE_ADMIN`).
* Prohibido extraer el `usuario_id` o `empresa_id` de payloads de petición para operaciones sensibles; siempre se extrae del token validado.

---

## 🧪 El Ciclo TDD en Backend

```text
1. ROJO:     Escribir el test unitario en `src/test/java/...` para el escenario Given-When-Then del SPEC activo.
             Ejecutar `./mvnw test -Dtest=NombreTest` y verificar que FALLA.
2. VERDE:    Escribir el código mínimo en el servicio o controlador para que el test pase.
3. REFACTOR: Limpiar código, eliminar duplicados y verificar que el 100% de la suite permanece en verde.
4. MANUAL:   Probar el endpoint en Postman o curl contra MySQL local (XAMPP) para comprobar el JSON real.
```

---

## 🛑 Protocolo Anti-Alucinación (El Humano en el Bucle)

El desarrollador o agente de backend **NUNCA** da por cerrado un sprint sin comprobación física:
> 💬 *"¿Probaste el endpoint en **Postman** contra MySQL en XAMPP? ¿Verificaste en phpMyAdmin o consola SQL que los registros se insertaron en las tablas correctas con sus relaciones FK intactas?"*

---

## 🔗 Referencias de Gobernanza

* **Backlog de Sprints:** [`.sprints/BACKLOG.md`](../.sprints/BACKLOG.md)
* **Bitácora Viva del Sistema:** `MEMORY.md` (raíz del proyecto)
* **Contratos de API:** `02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`
* **Modelo de Base de Datos:** `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`
