# SPEC — Sprint-G02: Base de Datos DDL Puro y Migraciones V1

> **Ámbito:** Sprint General Transversal (Previo al inicio del Backend)  
> **Objetivo:** Materializar el modelo de datos acordado en `DOMAIN.md` y `03_Base_de_Datos/` en scripts DDL puros y migraciones versionadas ejecutadas contra la base de datos local.  
> **Regla de Oro:** **Cero datos falsos o sentencias `INSERT` en los esquemas DDL.** Los esquemas definen estructura física pura (`CREATE TABLE`, `ALTER TABLE`, `CREATE INDEX`).

---

## 📋 1. Alcance

* **Incluye:**
  * Script inicial de migración versionada (`V1__esquema_inicial.sql` o herramienta equivalente de migración).
  * Creación de todas las tablas principales con tipos de datos estrictos, restricciones `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL` y `CHECK`.
  * Índices de optimización para búsquedas frecuentes y claves foráneas.
  * Script separado de semillas mínimas o catálogos iniciales (`seeds/01_catalogos.sql`).
* **NO incluye:**
  * Controladores, endpoints ni interfaces de usuario.
  * Insertar datos de prueba arbitrarios dentro de la migración de estructura.

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Manual** | **Product Owner / DBA** | Revisar y autorizar los catálogos fijos de negocio (categorías, roles base). |
| **Automatizada** | **Agente IA** | Redactar el archivo DDL de migración respetando exactamente los nombres de `DOMAIN.md`. |
| **Automatizada** | **Agente IA** | Ejecutar la migración contra el contenedor de base de datos local y verificar integridad. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Creación limpia de esquemas relacionales
* **Dado** el contenedor de base de datos vacío
* **Cuando** se ejecuta la herramienta de migración (Flyway, Prisma, script SQL)
* **Entonces** todas las tablas del modelo quedan creadas con sus constraints activas y estado exitoso.

### E2 — Integridad referencial protegida en el motor
* **Dado** una tabla con clave foránea (`FK`) hacia otra entidad
* **Cuando** se intenta insertar un registro con un `id_padre` inexistente
* **Entonces** el motor de base de datos rechaza la operación por violación de integridad referencial.

### E3 — Nombres estrictos según DOMAIN.md
* **Dado** el glosario de términos de `DOMAIN.md`
* **Cuando** se comparan los nombres de tablas y columnas creadas
* **Entonces** coinciden carácter por carácter (en `snake_case` plural para tablas, sin sinónimos).

---

## ✅ 4. Definition of Done (DoD)

- [ ] La migración inicial se ejecuta limpiamente sobre una base de datos local vacía.
- [ ] No existen sentencias `INSERT` dentro del archivo de migración DDL de estructura.
- [ ] Todas las claves foráneas e índices requeridos están presentes físicamente en la base.
- [ ] Commit realizado en rama `feature/db-esquema-inicial` y aprobado para merge a `develop`.
- [ ] **Luz verde:** Con este sprint cerrado, el Agente de Backend queda autorizado para iniciar el desarrollo de servicios y repositorios.
