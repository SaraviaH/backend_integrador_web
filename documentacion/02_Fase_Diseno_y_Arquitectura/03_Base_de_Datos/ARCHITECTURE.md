# ARCHITECTURE.md — Arquitectura de Base de Datos y Persistencia (COMPUNEX B2B)

> **Cambio de alcance:** La moderación administrativa de productos fue retirada por decisión del usuario. Las referencias técnicas existentes a `admin/products` o `motivo_moderacion` describen el diseño o implementación anterior y están pendientes de revisión; no son funciones objetivo vigentes.

> **Área Técnica:** Base de Datos  
> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Modelo, Normalización y Diccionario:** Ver [`MODELO_Y_DICCIONARIO_BD.md`](MODELO_Y_DICCIONARIO_BD.md)

---

## 🏛️ 1. Definición Arquitectónica de Persistencia

* **Paradigma de Datos:** Relacional (SQL) normalizado con integridad referencial estricta.
* **Motor Actual:** **PostgreSQL** (`org.postgresql:postgresql` en `pom.xml`, `compunex_b2b`). *(Nota pendiente de confirmar para entrega ATF3: posible migración a **MySQL** con usuario dedicado ≠ `root`).*
* **Motor de Pruebas Locales (TDD):** **H2 In-Memory** (`com.h2database:h2` en scope `test`).
* **Gestión de Esquema:** JPA / Hibernate (`spring.jpa.hibernate.ddl-auto=update`) y carga inicial de datos maestros vía `DataInitializer.java`.

---

## 🧱 2. Modelo Entidad-Relación Real (7 Tablas)

```mermaid
erDiagram
    usuarios ||--o| perfiles_proveedor : "1:1 (usuario_id)"
    perfiles_proveedor ||--o{ productos : "1:N (proveedor_id)"
    categorias ||--o{ subcategorias : "1:N (categoria_id)"
    categorias ||--o{ productos : "1:N (categoria_id)"
    productos ||--o{ producto_especificaciones : "1:N cascada (producto_id)"
    productos ||--o{ imagenes_producto : "1:N cascada (producto_id)"
    usuarios ||--o{ ordenes : "1:N compra (comprador_id)"
    ordenes ||--o{ subordenes_factura : "1:N split proveedor (orden_id)"
    perfiles_proveedor ||--o{ subordenes_factura : "1:N emite (proveedor_id)"
    subordenes_factura ||--o{ orden_items : "1:N detalle (suborden_id)"
    productos ||--o{ orden_items : "1:N referencia (producto_id)"

    usuarios {
        bigint id PK
        uuid uuid UK
        varchar nombre
        varchar correo UK
        varchar hash_contrasena
        varchar rol "PROVEEDOR | ADMIN"
        varchar estado "ACTIVO | ..."
        text motivo_estado
        timestamp fecha_registro
        timestamp ultimo_acceso
        timestamp fecha_actualizacion
    }

    perfiles_proveedor {
        bigint id PK
        bigint usuario_id FK
        varchar identificacion_fiscal UK
        varchar razon_social
        varchar nombre_comercial
        varchar telefono_contacto
        varchar url_logo
        varchar url_banner
        varchar direccion
        varchar ciudad
        varchar anos_mercado
        text descripcion
        text politica_comercial
        numeric calificacion
        boolean verificado
        boolean destacado
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    categorias {
        varchar id PK
        varchar nombre
        varchar icono
        varchar descripcion
        varchar estado "ACTIVA | ..."
        int total_productos
        timestamp fecha_creacion
        timestamp fecha_actualizacion
    }

    subcategorias {
        bigint id PK
        varchar categoria_id FK
        varchar nombre
    }

    productos {
        bigint id PK
        uuid uuid UK
        bigint proveedor_id FK
        varchar categoria_id FK
        varchar titulo
        text descripcion
        varchar modelo_comercial
        varchar tipo_formato
        varchar unidades_por_paquete
        varchar pedido_minimo
        numeric precio_unitario_ref
        numeric precio_total_ref
        varchar moneda "USD"
        text terminos_comerciales
        varchar estado "ACTIVO | ..."
        text motivo_moderacion
        boolean es_recomendado
        boolean es_promocionado
        boolean tiene_oferta
        timestamp fecha_publicacion
        timestamp fecha_actualizacion
        timestamp fecha_eliminacion
        bigint eliminado_por
    }

    producto_especificaciones {
        bigint id PK
        bigint producto_id FK
        varchar clave
        varchar valor
    }

    imagenes_producto {
        bigint id PK
        bigint producto_id FK
        varchar url_imagen
        smallint orden
    }

    ordenes {
        bigint id PK
        varchar codigo_orden UK
        bigint comprador_id FK
        varchar ruc_receptor
        varchar razon_social_receptor
        varchar direccion_fiscal
        varchar metodo_pago_simulado
        numeric total_general
        varchar moneda
        timestamp fecha_emision
    }

    subordenes_factura {
        bigint id PK
        bigint orden_id FK
        bigint proveedor_id FK
        varchar numero_comprobante UK
        varchar tipo_comprobante
        numeric subtotal
        numeric igv
        numeric total
        varchar estado
    }

    orden_items {
        bigint id PK
        bigint suborden_id FK
        bigint producto_id FK
        int cantidad
        numeric precio_unitario
        numeric subtotal_linea
    }
```

---

## 🔒 3. Estrategia de Integridad y Consultas

1. **Borrado Lógico:** La tabla `productos` preserva la trazabilidad histórica registrando `fecha_eliminacion` y `eliminado_por` en lugar de eliminar físicamente la fila.
2. **Optimización N+1:** Las colecciones `especificaciones` e `imagenes` de `Producto` utilizan `@BatchSize(size = 20)` y `orphanRemoval = true`.
3. **Unicidad de Identidad:** `usuarios.correo`, `usuarios.uuid`, `productos.uuid` y `perfiles_proveedor.identificacion_fiscal` tienen restricción `UNIQUE`.
