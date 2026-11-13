# SPEC — Sprint-G01: Setup del Ecosistema y Entorno Local

> **Ámbito:** Sprint General Transversal  
> **Objetivo:** Disponer de un entorno de desarrollo 100% reproducible en local para todos los agentes y desarrolladores, con Docker, linters, variables de entorno y validación de salud inicial.

---

## 📋 1. Alcance

* **Incluye:**
  * Configuración de repositorios o carpetas de código (`backend/`, `frontend/`, `database/`).
  * Archivo `docker-compose.yml` para levantar la infraestructura base local (BD, Redis/Cache si aplica).
  * Plantillas de variables de entorno seguras (`.env.example`).
  * Endpoint o script de comprobación de salud inicial (`/salud` o comando CLI).
* **NO incluye:**
  * Lógica de negocio de ningún caso de uso.
  * Diseños visuales de pantallas.

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Manual** | **Product Owner / Dev** | Clonar el repositorio y validar permisos locales de Docker/runtime. |
| **Manual** | **Product Owner / Dev** | Crear el archivo `.env` local copiando de `.env.example` sin versionar secretos. |
| **Automatizada** | **Agente IA** | Crear `docker-compose.yml` con el motor de BD acordado en `TECH_STACK.md`. |
| **Automatizada** | **Agente IA** | Configurar scripts de análisis estático / linter en Backend y Frontend. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Levantamiento de infraestructura local
* **Dado** una máquina con Docker instalado y el archivo `docker-compose.yml`
* **Cuando** se ejecuta `docker compose up -d`
* **Entonces** el contenedor de la base de datos se inicia en estado *healthy* en el puerto acordado.

### E2 — Integridad de variables de entorno
* **Dado** el repositorio recién clonado
* **Cuando** se inspecciona la raíz
* **Entonces** existe un `.env.example` documentado y `.gitignore` contiene la regla para ignorar `.env`.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Docker Compose levanta y responde en local sin errores.
- [ ] Linters configurados y pasando en 0 errores en todas las áreas.
- [ ] `.gitignore` protege todos los archivos sensibles y secretos.
- [ ] Commit realizado en rama `feature/setup-entorno` y aprobado para merge a `develop`.
