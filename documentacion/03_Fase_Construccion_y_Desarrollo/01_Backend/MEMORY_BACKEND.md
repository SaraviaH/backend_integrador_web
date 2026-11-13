# MEMORY_BACKEND.md — Bitácora y Estado Activo del Agente Backend

> **Área Técnica:** Backend (Spring Boot 3.2.0)  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Responsable:** Agente Backend  
> **Última Actualización:** 2026-11-13

---

## 1. Estado Actual de Ejecución

* **Sprint Activo:** Ninguno (En espera de `Sprint-G02` de DDL).
* **Endpoints Implementados:** 0 / 24 certificados.
* **Cobertura de Pruebas Unitarias / MockMvc:** 0%.
* **Estado de Conexión a Base de Datos:** Verificada en `Sprint-G01`.

---

## 2. Registro de Sprints Backend

| Sprint | Rama GitFlow | Estado | Endpoints Verificados | Test Suite |
| :--- | :--- | :---: | :---: | :---: |
| `Sprint-B01_Auth_y_Seguridad` | `feature/backend-auth-security` | `PENDIENTE` | 0 / 7 | 0 passing |
| `Sprint-B02_Catalogo_y_Productos` | `feature/backend-catalog` | `BLOQUEADO` | 0 / 4 | 0 passing |
| `Sprint-B03_Carrito_y_Split_Order` | `feature/backend-split-order` | `BLOQUEADO` | 0 / 3 | 0 passing |
| `Sprint-B04_Panel_Proveedor_y_Despacho` | `feature/backend-provider-dispatch` | `BLOQUEADO` | 0 / 8 | 0 passing |
| `Sprint-B05_Auditoria_y_Admin` | `feature/backend-admin-audit` | `BLOQUEADO` | 0 / 2 | 0 passing |
| `Sprint-B_Audit` (Gate 1) | `release/gate-1-backend-core` | `BLOQUEADO` | 0 / 24 | 0 passing |

---

## 3. Decisiones de Arquitectura y Patrones Aplicados
* **Seguridad y Filtros:** `JwtAuthenticationFilter` captura el header `Authorization: Bearer <token>`, valida la firma con clave secreta HS256 (`JJWT 0.11.5`) y puebla el `SecurityContextHolder`.
* **Manejo de Transacciones Complejas:** El servicio `OrderServiceImpl` está anotado con `@Transactional(rollbackFor = Exception.class)` para asegurar que la creación de `ordenes`, `subordenes_factura` y `orden_items` sea estrictamente atómica.
* **Formato de Números de Comprobante:** Se utiliza el patrón `F001-%08d` basado en la secuencia o PK de `subordenes_factura`.
* **Soft Delete:** Para la entidad `Producto`, el método `deleteById` actualiza `fecha_eliminacion = LocalDateTime.now()` y `estado = INACTIVO`, en lugar de invocar `repository.delete()`.

---

## 4. Registro de Bloqueos Técnicos
| Fecha | Descripción del Bloqueo | Impacto | Solución Propuesta | Estado |
| :--- | :--- | :--- | :--- | :---: |
| 2026-11-13 | Espera de esquema DDL en MySQL | No se pueden correr pruebas de integración con JPA real | `Sprint-G02` genera el esquema inicial Flyway | EN CURSO |

---

## 5. Instrucciones para el Agente Backend
1. Antes de iniciar un sprint, leer cuidadosamente su `SPEC.md`.
2. Crear la rama `feature/...` desde `develop`.
3. Implementar entidades, repositorios, servicios y controladores.
4. Escribir pruebas unitarias y de integración (`MockMvc`).
5. Actualizar la tabla de la Sección 2 en este archivo con la cantidad de tests aprobados.
6. Notificar al Coordinador Macro en `MEMORY_GENERAL.md` cuando el sprint esté listo para revisión.
