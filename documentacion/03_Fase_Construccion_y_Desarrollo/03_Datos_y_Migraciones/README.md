# 03. Datos y Migraciones: Reglas de Persistencia Física (MySQL 8.0 XAMPP)

> **Ámbito:** Persistencia y Evolución de Datos  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Motor de Persistencia:** MySQL 8.0 Community / MariaDB 10.4+ en XAMPP (puerto `3306`, base de datos `compunex_b2b`)  
> **Propósito:** Normas de ingeniería para el modelado físico, scripts DDL puros, versionado de esquemas mediante Flyway (`V1__...sql`) y protección de integridad referencial.  
> **Regla de Oro:** **Cero datos ficticios en los esquemas de migración DDL.** Las 10 tablas físicas reflejan exactamente `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`.

---

## 🏛️ Principios de Persistencia en Construcción

### 1. Migraciones Versionadas con Flyway
* Todo cambio en la estructura de la base de datos se realiza mediante un archivo de migración inmutable en `src/main/resources/db/migration/`:
  - `V1__init_schema.sql`: Creación de las 10 tablas base con sus claves primarias, foráneas, restricciones `UNIQUE`, `CHECK` e índices.
  - `V2__indices_rendimiento.sql`: Optimización de índices para búsquedas por RUC, SKU y rangos de fechas.
* **Prohibido modificar una migración ya aplicada:** Si se requiere un cambio, se genera `V3__...sql` con sentencias `ALTER TABLE`.
* Los archivos de migración contienen **exclusivamente sentencias DDL** (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`).

### 2. Separación Estricta de Datos Semilla (Seeds)
* Los datos iniciales requeridos para operar el sistema se ubican en una carpeta independiente:
  `src/main/resources/db/seeds/01_seed_inicial.sql`.
* Incluye:
  - 3 roles del sistema: `ROLE_COMPRADOR`, `ROLE_PROVEEDOR`, `ROLE_ADMIN`.
  - 2 empresas de prueba con RUC válido de 11 dígitos (1 compradora y 1 proveedora).
  - 3 usuarios de prueba con contraseñas hasheadas en BCrypt.
  - 5 categorías tecnológicas base (Laptops, Servidores, Redes, Almacenamiento, Periféricos).
  - 10 productos B2B con stock inicial y precios unitarios.

### 3. Integridad Referencial Protegida en MySQL
* Motor de almacenamiento: `InnoDB` (soporte completo de transacciones ACID y claves foráneas).
* Collation y codificación: `utf8mb4_unicode_ci` (soporte completo de caracteres internacionales y acentos).
* Reglas de integridad:
  - `ON DELETE RESTRICT` en tablas transaccionales (`ordenes`, `subordenes_factura`, `orden_items`) para evitar borrado accidental en cascada de datos contables.
  - Restricciones `CHECK`: `stock >= 0`, `precio_unitario > 0.00`, `total >= 0.00`.

---

## 💻 Entorno Local en XAMPP

* Iniciar MySQL desde el panel de control de XAMPP (puerto 3306).
* Crear la base de datos:
  ```sql
  CREATE DATABASE IF NOT EXISTS compunex_b2b CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
* Flyway ejecutará automáticamente las migraciones al arrancar la aplicación Spring Boot en el `Sprint-01` y `Sprint-02`.
