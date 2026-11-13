# Sprint-G02 — Base de Datos DDL y Semillas Iniciales

> **Área Técnica:** Transversal / Datos y DBA  
> **Track:** General  
> **Agente Responsable:** Agente Datos / DBA  
> **Estado:** COMPLETADO (PostgreSQL 18 + Hibernate JPA `ddl-auto=update` + `DataInitializer`)  
> **Rama GitFlow:** `integracion/e2e`  
> **Dependencias Previas:** `Sprint-G01_Setup_y_Entorno`

---

## 1. Objetivo del Sprint
Implementar el esquema relacional completo de 10 tablas en PostgreSQL 18 (`compunex_b2b`) mediante entidades JPA (`spring.jpa.hibernate.ddl-auto=update`) aplicando restricciones de integridad referencial, unicidad (`uk...` sobre correo, RUC, SKU, código de orden y comprobante), auditoría y datos semilla vía `DataInitializer` (roles `ADMIN`/`PROVEEDOR`, 8 categorías tecnológicas y producto semilla inicial) para soportar el desarrollo y la integración E2E. *(Nota histórica: las migraciones Flyway/MySQL de la plantilla inicial fueron sustituidas por JPA/Hibernate + `DataInitializer` sobre PostgreSQL).*

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Diccionario de Datos:** `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`
* **Arquitectura de Datos:** `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/ARCHITECTURE.md`
* **Contratos Afectados:** DTOs y modelos de entidades mapeados a las 10 tablas.
* **Reglas de Negocio:**
  * `RN-001`: Roles (`ADMIN`, `PROVEEDOR`, `CLIENTE`).
  * `RN-002`: Validación de RUC (11 dígitos numéricos, UNIQUE en `perfiles_proveedor`).
  * `RN-003`: Soft Delete en `productos` (`fecha_eliminacion`, `eliminado_por`).
  * `RN-005` y `RN-006`: Estructura para Split Order (`ordenes`, `subordenes_factura`, `orden_items`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Migración DDL Principal (`V1__init_schema.sql`)
- [ ] Crear archivo `src/main/resources/db/migration/V1__init_schema.sql` con las 10 tablas en orden estricto de dependencias:
  1. `usuarios`: PK `id` BIGINT AUTO_INCREMENT, `uuid` VARCHAR(36) UNIQUE NOT NULL, `correo` VARCHAR(150) UNIQUE NOT NULL, `contrasena_hash` VARCHAR(255) NOT NULL, `rol` ENUM('ADMIN','PROVEEDOR','CLIENTE') NOT NULL, `estado` ENUM('ACTIVO','INACTIVO','BLOQUEADO') DEFAULT 'ACTIVO'.
  2. `perfiles_proveedor`: PK `id`, FK `usuario_id` UNIQUE (1:1), `identificacion_fiscal` VARCHAR(11) UNIQUE NOT NULL (RUC), `razon_social` VARCHAR(200) NOT NULL, `nombre_comercial` VARCHAR(150), `estado_verificacion` ENUM('PENDIENTE','APROBADO','RECHAZADO') DEFAULT 'PENDIENTE'.
  3. `categorias`: PK `id` VARCHAR(50), `nombre` VARCHAR(100) NOT NULL, `slug` VARCHAR(100) UNIQUE NOT NULL, `activo` BOOLEAN DEFAULT TRUE, `total_productos` INT DEFAULT 0.
  4. `subcategorias`: PK `id` BIGINT AUTO_INCREMENT, FK `categoria_id`, `nombre` VARCHAR(100), `slug` VARCHAR(100) UNIQUE.
  5. `productos`: PK `id`, `uuid` VARCHAR(36) UNIQUE NOT NULL, FK `proveedor_id` (hacia `usuarios.id`), FK `categoria_id`, FK `subcategoria_id`, `nombre` VARCHAR(255) NOT NULL, `sku` VARCHAR(100) UNIQUE NOT NULL, `precio_unitario` DECIMAL(12,2) NOT NULL, `stock_disponible` INT NOT NULL, `estado` ENUM('ACTIVO','INACTIVO','AGOTADO') DEFAULT 'ACTIVO', `fecha_eliminacion` DATETIME NULL, `eliminado_por` VARCHAR(100) NULL.
  6. `producto_especificaciones`: PK `id`, FK `producto_id` ON DELETE CASCADE, `clave` VARCHAR(100), `valor` VARCHAR(255), `orden` INT DEFAULT 0.
  7. `imagenes_producto`: PK `id`, FK `producto_id` ON DELETE CASCADE, `url_imagen` VARCHAR(500), `orden` INT DEFAULT 0, `es_principal` BOOLEAN DEFAULT FALSE.
  8. `ordenes`: PK `id`, `uuid` VARCHAR(36) UNIQUE NOT NULL, `codigo_orden` VARCHAR(50) UNIQUE NOT NULL, FK `comprador_id`, `estado` ENUM('PENDIENTE','PROCESANDO','PAGADO','CANCELADO') DEFAULT 'PENDIENTE', `monto_subtotal` DECIMAL(12,2), `monto_igv` DECIMAL(12,2), `monto_total` DECIMAL(12,2), `ruc_receptor` VARCHAR(11), `razon_social_receptor` VARCHAR(200), `direccion_fiscal` VARCHAR(255).
  9. `subordenes_factura`: PK `id`, `uuid` VARCHAR(36) UNIQUE, FK `orden_id`, FK `proveedor_id`, `numero_comprobante` VARCHAR(50) UNIQUE NOT NULL, `estado` ENUM('PENDIENTE_DESPACHO','EN_PREPARACION','DESPACHADO','ENTREGADO','CANCELADO') DEFAULT 'PENDIENTE_DESPACHO', `subtotal` DECIMAL(12,2), `igv` DECIMAL(12,2), `total` DECIMAL(12,2).
  10. `orden_items`: PK `id`, FK `suborden_id`, FK `producto_id`, `cantidad` INT NOT NULL, `precio_unitario` DECIMAL(12,2) NOT NULL, `subtotal` DECIMAL(12,2) NOT NULL.

### 3.2. Script de Semillas Iniciales (`V2__seed_data.sql`)
- [ ] Insertar usuario Administrador con contraseña cifrada BCrypt (`$2a$10$...`).
- [ ] Insertar 2 usuarios Proveedores con perfiles comerciales activos (`TechnoNova Mayoristas S.A.C.` RUC `20601234567` e `Innova PC Wholesale S.A.C.` RUC `20712345678`).
- [ ] Insertar 2 usuarios Clientes Mayoristas B2B de prueba.
- [ ] Insertar 5 categorías tecnológicas clave (Laptops Corporativas, Servidores, Componentes, Redes, Almacenamiento).
- [ ] Insertar subcategorías y 10 productos de prueba con precios en PEN y stock mayorista.

### 3.3. Configuración y Validación de Flyway en Spring Boot
- [ ] Habilitar Flyway en `application-dev.yml`: `spring.flyway.enabled: true`.
- [ ] Probar ejecución limpia de migraciones al arrancar la aplicación (`flyway_schema_history` en estado `SUCCESS`).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] Las 10 tablas (`categorias`, `imagenes_producto`, `orden_items`, `ordenes`, `perfiles_proveedor`, `producto_especificaciones`, `productos`, `subcategorias`, `subordenes_factura`, `usuarios`) creadas y verificadas en PostgreSQL `compunex_b2b`.
- [x] Restricciones de unicidad y llaves foráneas activas (verificadas en pruebas H2 y PostgreSQL en vivo).
- [x] Datos semilla iniciales (`admin@compunex.com`, `ventas.mayoristas@technova.com`, 8 categorías string y producto inicial) cargados por `DataInitializer`.
- [x] Integridad referencial en transacciones (`ordenes`, `subordenes_factura`, `orden_items`) y soft delete en `productos` verificados en vivo.

---

## 5. Plan de Verificación y Comandos
```sql
-- Verificar existencia de las 10 tablas
USE compunex_db;
SHOW TABLES;
-- Debe listar: categorias, flyway_schema_history, imagenes_producto, orden_items,
-- ordenes, perfiles_proveedor, producto_especificaciones, productos,
-- subcategorias, subordenes_factura, usuarios.

-- Verificar registros semilla
SELECT COUNT(*) FROM usuarios; -- >= 5
SELECT COUNT(*) FROM categorias; -- >= 5
SELECT COUNT(*) FROM productos; -- >= 10
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Entidad / Tabla | Migración Flyway |
| :--- | :--- | :--- | :--- |
| `RF-01`, `RF-02` | `RN-001`, `RN-002` | `usuarios`, `perfiles_proveedor` | `V1__init_schema.sql` |
| `RF-03`, `RF-04` | `RN-003`, `RN-004` | `categorias`, `subcategorias`, `productos`, etc. | `V1__init_schema.sql` |
| `RF-05`, `RF-06` | `RN-005`, `RN-006` | `ordenes`, `subordenes_factura`, `orden_items` | `V1__init_schema.sql` |
| Semillas de Prueba | `RN-001`..`RN-004` | Todas las tablas maestras | `V2__seed_data.sql` |
