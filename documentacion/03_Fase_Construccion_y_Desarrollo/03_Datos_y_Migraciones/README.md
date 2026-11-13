# 03. Datos y Migraciones: Reglas de Persistencia Física

> **Ámbito:** Persistencia y Evolución de Datos  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Normas de ingeniería para el modelado físico, scripts DDL puros, versionado de esquemas mediante herramientas de migración (Flyway, Liquibase, Prisma Migrate o SQL scripts numerados) y protección de integridad referencial.  
> **Regla de Oro:** **Cero datos falsos o sentencias `INSERT` en los esquemas de migración DDL.**

---

## 🏛️ Principios de Persistencia en Construcción

### 1. Migraciones Versionadas e Inmutables
* Todo cambio en la estructura de la base de datos se realiza mediante un nuevo archivo de migración versionado incrementalmente:
  `V1__esquema_inicial.sql`, `V2__agregar_indices.sql`, `V3__nueva_tabla.sql`.
* **Prohibido modificar una migración ya aplicada:** Si se necesita corregir una columna, se crea una nueva migración con un `ALTER TABLE`.
* Los archivos de migración de esquema contienen **exclusivamente sentencias DDL** (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`).

### 2. Separación de Datos Semilla (Seeds)
* Los datos iniciales o catálogos fijos de negocio se gestionan en una carpeta independiente:
  `database/seeds/01_catalogos.sql`.
* Nunca se mezclan datos de prueba o mockups dentro de los esquemas base de producción.

### 3. Integridad Referencial Protegida en el Motor
* La base de datos es la última línea de defensa: definir siempre restricciones explícitas (`PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK`, `UNIQUE`).
* Las consultas complejas o filtros frecuentes deben contar con su índice correspondiente documentado en la migración.
* Todas las consultas que interactúen con el usuario deben utilizar **parámetros vinculados (prepared statements)** para hacer imposible la inyección SQL.

---

## 💻 Entorno Local de Base de Datos

* Toda la persistencia debe ser reproducible localmente en un solo comando mediante `docker-compose.yml` (por ejemplo: contenedor PostgreSQL con volumen persistente).
* Los tests de integración del Backend se ejecutan contra esta instancia local o contra un contenedor efímero de pruebas.
