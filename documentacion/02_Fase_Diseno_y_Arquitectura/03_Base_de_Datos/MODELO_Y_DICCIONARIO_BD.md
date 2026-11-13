# MODELO_Y_DICCIONARIO_BD.md — Modelo, Normalización y Diccionario de Persistencia (COMPUNEX B2B)

> **Área Técnica:** Base de Datos  
> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Fuentes Canónicas:** [`CONTRATOS_JSON.md`](../05_Integracion_y_APIs/CONTRATOS_JSON.md), [`DOMAIN.md`](../DOMAIN.md) y entidades JPA en `compunex-backend`.

---

## 1. Alcance, Motor y Fuentes de Esquema

* **Motor Actual Configurado:** PostgreSQL (`org.postgresql:postgresql`, base `compunex_b2b`), gestionado vía Spring Data JPA / Hibernate (`ddl-auto=update`). *(Pendiente confirmar para ATF3 si se migra a MySQL con usuario ≠ `root` — ver `DT-02`).*
* **Motor de Pruebas Locales:** H2 In-Memory (`com.h2database:h2` en scope `test`).
* **Alcance de Tablas (10 en total):**
  * **7 tablas implementadas en código:** `usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`.
  * **3 tablas diseñadas para Fase 03 (E-Commerce Split Order):** `ordenes`, `subordenes_factura`, `orden_items`.

---

## 2. Justificación de Normalización (1FN, 2FN, 3FN y Desnormalizaciones)

| Forma Normal | Dependencia Funcional / Regla | Solución y Justificación | Excepción / Coste Documentado |
| :---: | :--- | :--- | :--- |
| **1FN** | Ningún atributo debe ser multivaluado ni compuesto en una sola columna. | Las especificaciones técnicas (`clave`, `valor`) y URLs de imágenes (`url_imagen`, `orden`) se extraen a `producto_especificaciones` e `imagenes_producto` (1:N). | Requiere `@BatchSize(size = 20)` en JPA para evitar problema N+1. |
| **2FN** | Todo atributo no primo debe depender de la clave candidata completa. | Todas las tablas usan PK simple (`id` autoincremental o `VARCHAR` en `categorias`), eliminando dependencias parciales. | — |
| **3FN** | Ningún atributo no primo debe depender transitivamente de otro atributo no primo. | Datos fiscales/comerciales del proveedor se separan en `perfiles_proveedor` (1:1 con `usuarios`); subcategorías en `subcategorias` (1:N); facturas por proveedor en `subordenes_factura` (1:N con `ordenes`). | **Desnormalización 1 (`categorias.total_productos`):** Contador cacheado para consulta rápida del catálogo; debe sincronizarse al crear/eliminar productos. |
| **Snapshot Histórico** | Los precios y datos fiscales de una compra no deben mutar si el proveedor edita su catálogo después. | `orden_items.precio_unitario` y `ordenes` (`ruc_receptor`, `razon_social_receptor`, `direccion_fiscal`) congelan el valor vigente al momento del checkout. | Duplica datos maestros en la orden por integridad histórica y contable simulada. |

---

## 3. Modelo Conceptual y Lógico (Identidad, Integridad y Transacciones)

* **Diagrama ER mantenido:** Ver [`03_Base_de_Datos/ARCHITECTURE.md`](ARCHITECTURE.md).
* **Claves e Índices de Unicidad (`UNIQUE`):**
  * `usuarios`: `uuid`, `correo`
  * `perfiles_proveedor`: `usuario_id` (1:1), `identificacion_fiscal` (RUC único)
  * `productos`: `uuid`
  * `ordenes` *(Fase 03)*: `codigo_orden`
  * `subordenes_factura` *(Fase 03)*: `numero_comprobante`
* **Política de Borrado:**
  * `productos`: **Borrado lógico (Soft Delete)** mediante `fecha_eliminacion` y `eliminado_por`.
  * `producto_especificaciones` / `imagenes_producto`: `CascadeType.ALL` + `orphanRemoval = true` dependientes del ciclo de vida de `Producto`.
  * `ordenes`, `subordenes_factura`, `orden_items`: Sin borrado físico para preservar trazabilidad de comprobantes simulados.
* **Límites de Transacción (`@Transactional`):**
  1. Registro de proveedor (`POST /api/v1/auth/register`) y activación (`POST /api/v1/providers/me/activate`): creación atómica de `Usuario`/`Rol` + `PerfilProveedor`.
  2. Checkout Split Order (`POST /api/v1/orders/checkout`): validación de stock/estado/no auto-compra (`RN-007`), cálculo en servidor (`RN-008`) y persistencia atómica de `ordenes` + N `subordenes_factura` + `orden_items`.

---

## 4. Diccionario Multi-Stack (Cobertura Completa y Fronteras de Tipo)

| Tabla.Campo | Significado | Tipo SQL / Persistido | Tipo Backend (Java) | Tipo Transporte JSON / Angular | Unidad / Formato | Restricciones | Privacidad / Origen |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `usuarios.id` | Identificador interno de cuenta | `BIGINT` (`IDENTITY`) | `Long` | `number` *(seguro ≤ $2^{53}-1$)* | Entero | `PK`, `NOT NULL` | Interno |
| `usuarios.uuid` | Identificador público universal | `UUID` | `UUID` | `string` (UUID v4) | UUID | `NOT NULL`, `UNIQUE` | Interno / API |
| `usuarios.nombre` | Nombre del contacto/usuario | `VARCHAR(200)` | `String` | `string` | Texto | `NOT NULL` | Perfil |
| `usuarios.correo` | Correo de acceso | `VARCHAR(255)` | `String` | `string` | Email | `NOT NULL`, `UNIQUE` | Sensible (acceso) |
| `usuarios.hash_contrasena` | Hash BCrypt de clave | `VARCHAR(255)` | `String` | *(No se transporta)* | BCrypt | `NOT NULL` | **Privado (nunca en DTO)** |
| `usuarios.rol` | Rol RBAC | `VARCHAR(20)` | `RolUsuario` | `string` | Enum | `NOT NULL` | Control acceso |
| `usuarios.estado` | Estado de cuenta | `VARCHAR(20)` | `EstadoUsuario` | `string` | Enum (`ACTIVO`, etc.) | `NOT NULL` | Moderación |
| `perfiles_proveedor.id` | Identificador de proveedor | `BIGINT` | `Long` | `number` | Entero | `PK`, `NOT NULL` | Interno |
| `perfiles_proveedor.usuario_id` | Cuenta dueña del perfil | `BIGINT` | `Usuario` | *(Implícito en sesión)* | FK | `FK`, `NOT NULL`, `UNIQUE` | Interno |
| `perfiles_proveedor.identificacion_fiscal` | RUC de la empresa | `VARCHAR(20)` | `String` | `string` | 11 dígitos | `NOT NULL`, `UNIQUE` | Público B2B |
| `perfiles_proveedor.razon_social` | Razón social tributaria | `VARCHAR(200)` | `String` | `string` | Texto | `NOT NULL` | Público B2B |
| `perfiles_proveedor.nombre_comercial` | Marca comercial | `VARCHAR(200)` | `String` | `string` | Texto | Nullable | Público B2B |
| `perfiles_proveedor.telefono_contacto` | Teléfono comercial | `VARCHAR(20)` | `String` | `string` | Teléfono | `NOT NULL` | Contacto B2B |
| `perfiles_proveedor.direccion` / `ciudad` | Sede fiscal y ciudad | `VARCHAR(300)` / `(100)` | `String` | `string` | Texto | `NOT NULL` | Público B2B |
| `categorias.id` | Slug identificador | `VARCHAR(50)` | `String` | `string` | Slug texto | `PK`, `NOT NULL` | Maestro |
| `categorias.nombre` / `icono` / `estado` | Nombre, icono y estado | `VARCHAR` | `String` / `EstadoCategoria` | `string` | Texto / Enum | `NOT NULL` (`nombre`, `estado`) | Maestro |
| `categorias.total_productos` | Conteo materializado | `INTEGER` | `Integer` | `number` | Cantidad | Default `0` | Derivado |
| `subcategorias.id` / `categoria_id` / `nombre` | Subcategoría técnica | `BIGINT` / `VARCHAR(50)` / `VARCHAR(100)` | `Long` / `Categoria` / `String` | `number` / `string` | Texto | `PK`, `FK`, `NOT NULL` | Maestro |
| `productos.id` / `uuid` | Identificador y UUID de producto | `BIGINT` / `UUID` | `Long` / `UUID` | `number` / `string` | Entero / UUID | `PK`, `UNIQUE`, `NOT NULL` | Catálogo |
| `productos.proveedor_id` / `categoria_id` | Dueño y categoría | `BIGINT` / `VARCHAR(50)` | `PerfilProveedor` / `Categoria` | `number` / `string` | FKs | `FK`, `NOT NULL` | Catálogo |
| `productos.titulo` / `descripcion` | Título y descripción | `VARCHAR(255)` / `TEXT` | `String` | `string` | Texto | `NOT NULL` | Catálogo |
| `productos.modelo_comercial` | Modalidad B2B | `VARCHAR(30)` | `ModeloComercial` | `string` | Enum | `NOT NULL` | Catálogo |
| `productos.tipo_formato` / `unidades_por_paquete` / `pedido_minimo` | Formato y mínimos mayoristas | `VARCHAR(100)` | `String` | `string` | Texto | `NOT NULL` | Catálogo |
| `productos.precio_unitario_ref` / `precio_total_ref` | Precios referenciales | `NUMERIC(12,2)` | `BigDecimal` | `number` | Moneda (`USD`) | `NOT NULL` | Catálogo |
| `productos.moneda` / `estado` | Moneda y estado publicación | `VARCHAR(10)` / `(30)` | `String` / `EstadoProducto` | `string` | ISO / Enum | `NOT NULL` | Catálogo |
| `productos.fecha_eliminacion` / `eliminado_por` | Auditoría borrado lógico | `TIMESTAMP` / `BIGINT` | `Instant` / `Long` | `string` (ISO-8601 UTC) | UTC / ID | Nullable | Auditoría |
| `producto_especificaciones` (`clave`, `valor`) | Ficha técnica clave-valor | `VARCHAR(100)` / `(255)` | `String` | `string` | Texto | `FK producto_id`, `NOT NULL` | Catálogo |
| `imagenes_producto` (`url_imagen`, `orden`) | Galería ordenada | `VARCHAR(500)` / `SMALLINT` | `String` / `Short` | `string` / `number` | URL / Orden | `FK producto_id`, `NOT NULL` | Catálogo |
| `ordenes.id` / `codigo_orden` *(Nuevo)* | ID y código legible de orden | `BIGINT` / `VARCHAR(30)` | `Long` / `String` | `number` / `string` | Texto (`PED-2026-...`) | `PK`, `UNIQUE`, `NOT NULL` | Transaccional |
| `ordenes.comprador_id` *(Nuevo)* | Usuario comprador | `BIGINT` | `Usuario` | *(Implícito en sesión)* | FK | `FK`, `NOT NULL` | Privado |
| `ordenes.ruc_receptor` / `razon_social_receptor` / `direccion_fiscal` *(Nuevo)* | Snapshot fiscal comprador | `VARCHAR(20)` / `(200)` / `(300)` | `String` | `string` | RUC / Texto | `NOT NULL` | Checkout |
| `ordenes.metodo_pago_simulado` / `total_general` / `moneda` *(Nuevo)* | Método simulado y total | `VARCHAR(40)` / `NUMERIC(12,2)` / `VARCHAR(10)` | `String` / `BigDecimal` | `string` / `number` | USD | `NOT NULL` | Calculado en servidor |
| `ordenes.fecha_emision` *(Nuevo)* | Fecha de confirmación | `TIMESTAMP` | `Instant` | `string` (ISO-8601 UTC) | UTC | `NOT NULL` | Auditoría |
| `subordenes_factura.id` / `orden_id` / `proveedor_id` *(Nuevo)* | Suborden emitida por proveedor | `BIGINT` | `Long` / `OrdenCompra` / `PerfilProveedor` | `number` | PK / FKs | `PK`, `FK`, `NOT NULL` | Split Order |
| `subordenes_factura.numero_comprobante` / `tipo_comprobante` / `estado` *(Nuevo)* | Serie simulada y estado | `VARCHAR(30)` | `String` | `string` (`SIM-F001-...`) | Texto | `UNIQUE`, `NOT NULL` | Simulado |
| `subordenes_factura.subtotal` / `igv` / `total` *(Nuevo)* | Desglose tributario simulado | `NUMERIC(12,2)` | `BigDecimal` | `number` | Moneda (`USD`) | `NOT NULL` | Calculado en servidor (`18%`) |
| `orden_items.id` / `suborden_id` / `producto_id` *(Nuevo)* | Línea de detalle de compra | `BIGINT` | `Long` / `SubordenFactura` / `Producto` | `number` | PK / FKs | `PK`, `FK`, `NOT NULL` | Transaccional |
| `orden_items.cantidad` / `precio_unitario` / `subtotal_linea` *(Nuevo)* | Cantidad y snapshot de precio | `INTEGER` / `NUMERIC(12,2)` | `Integer` / `BigDecimal` | `number` | Unidades / USD | `NOT NULL`, `> 0` | Snapshot catálogo |

---

## 5. Precisión, Compatibilidad, Migración y Estado de Verificación

* **Precisión Numérica, Enteros y Fechas:**
  * Todos los importes (`precio_unitario_ref`, `precio_total_ref`, `subtotal`, `igv`, `total`, `subtotal_linea`, `total_general`) usan `NUMERIC(12,2)` en SQL y `BigDecimal` en Java; ningún cálculo financiero se confía al cliente JavaScript (`number`).
  * Los identificadores `BIGINT` se transportan como `number` en los DTOs actuales mientras el volumen esté dentro del rango seguro de JavaScript ($2^{53}-1$); si creciera a IDs distribuidos tipo Snowflake, deben serializarse como `string`.
  * Todas las marcas temporales usan `Instant` (UTC) serializado en ISO-8601 (`2026-11-12T19:30:00Z`).
* **Compatibilidad y Consumidores:**
  * Consumidores actuales: Front-end Angular (`compunex-frontend`), colección Postman de pruebas y Swagger UI (`/swagger-ui.html`).
  * Los cambios de esquema para Fase 03 (`ordenes`, `subordenes_factura`, `orden_items`) son puramente aditivos y no rompen las 7 tablas ni los 14 endpoints existentes.
* **Migración, Recuperación y Restauración:**
  * Actualmente el proyecto usa generación automática Hibernate (`spring.jpa.hibernate.ddl-auto=update`) y semillas en `DataInitializer.java`; **no cuenta aún con scripts de migración versionados (Flyway/Liquibase) ni con pruebas de respaldo/restauración verificadas**.
  * Antes de cerrar Fase 03/04 se debe definir el script SQL DDL/seed final (especialmente si se confirma migración a MySQL por `DT-02`).
* **Pruebas con Motor Compatible y Resultados:**
  * ✅ **Ejecutado (59 tests JUnit):** Las 7 tablas actuales están cubiertas por pruebas unitarias y de repositorio en **H2 In-Memory** (`BUILD SUCCESS`), pero **H2 no sustituye la validación en el motor destino real (PostgreSQL o MySQL)**.
  * ⬜ **Pendiente (Controles no ejecutados):** Verificar DDL, restricciones `UNIQUE`/`FK`, transacciones `@Transactional` y consultas paginadas directamente contra **PostgreSQL / MySQL** real, además de implementar y probar las 3 tablas nuevas en Fase 03.
