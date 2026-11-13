# 01. Backend: Normas de Construcción y Desarrollo Local

> **Ámbito:** Especialidad Técnica · Backend  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Proyecto:** COMPUNEX B2B  
> **Pila Tecnológica:** Java 21 · Spring Boot 3.5.16 · Spring Security 6 · JJWT 0.12.6 · Spring Data JPA · PostgreSQL 15+ (H2 en modo PostgreSQL para tests) · Maven Wrapper (`.\mvnw.cmd`)  
> **Regla de Operación:** La planificación y bitácora del track backend residen en [`BACKLOG_BACKEND.md`](./BACKLOG_BACKEND.md) y [`MEMORY_BACKEND.md`](./MEMORY_BACKEND.md).

---

## 🏛️ Principios de Construcción de Backend

### 1. Servicios Enfocados (SRP) y Aislamiento de Dominio
* Las reglas de negocio (`RN-001..RN-008` de `DOMAIN.md`) residen en implementaciones de servicio dentro de `com.compunex.b2b.modules.*.service.impl` y colaboradores de soporte en `...service.support`.
* Se aplica segregación por responsabilidad única: servicios separados por actor/caso de uso (`AuthService` vs `RegistroCorporativoService`; `ProductoProveedorService`, `ProductoPublicoService` y `AdminProductoService`; `OrderService` apoyado en `SplitOrderCalculator` y `OrderResponseMapper`).
* No importan clases de transporte web ni usan `@Autowired` en campos; toda inyección se realiza por constructor (`@RequiredArgsConstructor` o constructor explícito) y se prueba con JUnit 5 y Mockito sin requerir levantar todo el servidor.

### 2. Controladores Enfocados en Transporte y Contratos
* Paquete: `com.compunex.b2b.modules.*.controller`.
* Rutas base prefijadas con `/api/v1/*` (`/api/v1/auth`, `/api/v1/categories`, `/api/v1/providers`, `/api/v1/products`, `/api/v1/admin/products`, `/api/v1/orders`, `/api/v1/media`).
* Los controladores validan el payload con Jakarta Validation (`@Valid`) y delegan en su interfaz de servicio.
* Respetan los esquemas y códigos HTTP de `02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`.
* El manejo centralizado de errores opera mediante `GlobalExceptionHandler` (`ErrorResponseDTO` y respuestas JSON uniformes para validación `400`, autenticación `401`, recursos no encontrados `404` y conflictos `409`).

### 3. Repositorios y Persistencia en PostgreSQL
* Paquete: `com.compunex.b2b.modules.*.repository`.
* Implementan `JpaRepository` (y `JpaSpecificationExecutor<Producto>` en `ProductoRepository` con `ProductoSpecification`) usando consultas JPQL parametrizadas (`:parametro`) sin interpolación dinámica insegura.
* Transaccionalidad delimitada con `@Transactional` explícito en operaciones multi-entidad (registro proveedor/empresa, CRUD producto, activación proveedor, checkout Split Order ACID y actualización de despacho).

### 4. Seguridad e Identidad (Spring Security 6 + JJWT)
* Autenticación stateless mediante cabecera `Authorization: Bearer <token>`.
* El token JWT (`JwtTokenProvider`) contiene `sub` (correo) y claim `rol` (`COMPRADOR`, `CLIENTE`, `PROVEEDOR`, `ADMIN`), traducido por `CustomUserDetailsService` / `JwtAuthenticationFilter` a autoridades `ROLE_*`.
* La identidad del usuario autenticado se obtiene siempre de `SecurityContextHolder` / `Authentication.getName()`, nunca desde IDs enviados en el cuerpo del request.

---

## 🧪 El Ciclo TDD y Verificación en Backend

```text
1. ROJO:     Escribir test unitario o MockMvc en `src/test/java/com/compunex/b2b/...`
             Ejecutar `.\mvnw.cmd test -Dtest=NombreTest` y confirmar el fallo esperado.
2. VERDE:    Implementar la lógica mínima en servicio, soporte o controlador.
3. REFACTOR: Aplicar SRP, eliminar duplicados y correr `.\mvnw.cmd clean test` completo.
4. MANUAL:   Validar contra PostgreSQL (`localhost:5432`) vía Swagger UI (`/swagger-ui/index.html`) o Postman.
```

---

## 🛑 Protocolo de Cierre y Evidencia Física

Todo sprint backend se valida ejecutando la suite automatizada en H2 modo PostgreSQL y comprobando el comportamiento real en PostgreSQL:
* Suite verificada al cierre del track: `.\mvnw.cmd clean test` (`83` pruebas ejecutadas, `0` fallos, `0` errores).
* Evidencias y certificación: [`.sprints/Sprint-B_Audit/AUDITORIA_1.md`](./.sprints/Sprint-B_Audit/AUDITORIA_1.md).

---

## 🔗 Referencias de Gobernanza

* **Backlog de Sprints Backend:** [`BACKLOG_BACKEND.md`](./BACKLOG_BACKEND.md)
* **Bitácora Activa de Backend:** [`MEMORY_BACKEND.md`](./MEMORY_BACKEND.md)
* **Índice de Sprints Backend:** [`.sprints/README.md`](./.sprints/README.md)
* **Bitácora Viva del Sistema:** [`../../MEMORY.md`](../../MEMORY.md)
* **Contratos de API:** [`../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`](../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md)
* **Modelo de Base de Datos:** [`../../02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`](../../02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md)
