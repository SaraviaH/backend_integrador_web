# SPEC — Sprint-G01: Setup del Ecosistema y Entorno Local (COMPUNEX B2B)

> **Ámbito:** Sprint General Transversal  
> **Objetivo:** Disponer del entorno de desarrollo local reproducible para Backend Spring Boot y Frontend Angular, resolviendo la separación de perfiles y externalización de variables de entorno seguras.

---

## 📋 1. Alcance

* **Incluye:**
  * Configuración de perfiles en Backend: `application.properties` (base con perfil dinámico), `application-dev.properties` y `application-prod.properties`.
  * Externalización de variables de entorno para variables sensibles (`${DB_URL}`, `${DB_USER}`, `${DB_PASS}`, `${JWT_SECRET}`).
  * Verificación de exclusión de credenciales en `.gitignore`.
  * Configuración de variables de entorno en Frontend Angular (`src/environments/environment.ts` y `environment.prod.ts`) con `apiUrl: 'http://localhost:8080/api/v1'`.
* **NO incluye:**
  * Lógica de nuevos endpoints de negocio ni pantallas de UI.

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Técnica** | Desarrollador + Agente | Crear `application-dev.properties` y `application-prod.properties` en `compunex-backend`. |
| **Técnica** | Desarrollador + Agente | Parametrizar `application.properties` con `spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}`. |
| **Técnica** | Desarrollador + Agente | Configurar `environment.ts` y `environment.prod.ts` en Angular apuntando a `/api/v1`. |
| **Validación** | Desarrollador + Agente | Ejecutar `.\mvnw.cmd test` en backend para confirmar que las pruebas siguen pasando con perfiles. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Carga de perfil dev por defecto
* **Dado** el backend configurado con perfiles
* **Cuando** se levanta la aplicación sin pasar `SPRING_PROFILES_ACTIVE`
* **Entonces** el sistema toma el perfil `dev` y se conecta al entorno de desarrollo local.

### E2 — Cero contraseñas expuestas en código base
* **Dado** el archivo `src/main/resources/application.properties` y los perfiles
* **Cuando** se inspeccionan las propiedades de base de datos y JWT
* **Entonces** todos los valores sensibles utilizan sintaxis `${...}` con valores de respaldo para desarrollo local, sin credenciales de producción quemadas.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Perfiles `application-dev.properties` y `application-prod.properties` creados y funcionales.
- [ ] Variables de entorno documentadas para ejecución local.
- [ ] 59 pruebas JUnit ejecutadas con éxito (`BUILD SUCCESS`).
- [ ] `environment.ts` del Frontend configurado y alineado con `apiUrl`.
