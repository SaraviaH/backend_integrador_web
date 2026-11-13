# SPEC — Sprint-G_Final: Integración E2E y Release Candidate

> **Ámbito:** Sprint General Transversal de Cierre de Construcción  
> **Objetivo:** Conectar el Frontend real con el Backend real en local (apagando el mock server), ejecutar el recorrido completo de punta a punta con datos nuevos y compilar el binario / paquete de release candidate.

---

## 📋 1. Alcance

* **Incluye:**
  * Desactivar el mock server local y apuntar el cliente Frontend a la API del Backend local real.
  * Ejecutar el flujo de negocio de punta a punta (End-to-End) con una cuenta de usuario nueva y datos reales.
  * Pruebas de humo (Smoke Tests) de todos los endpoints de la API.
  * Generación del artefacto o binario de release preliminar (APK, imagen Docker compilada, build de producción).
  * Ejecución de la **Auditoría de Cierre de Construcción** (`AUDITORIA_HITO_TEMPLATE.md`).
* **NO incluye:**
  * Despliegue automático a servidores de producción en la nube (eso pertenece a la **Fase 05 CI/CD**).
  * Pruebas de estrés masivas o auditorías externas de seguridad (pertenecen a la **Fase 04 QA**).

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Manual** | **Product Owner / Tester** | Ensayar el recorrido completo en un entorno local y verificar la experiencia de usuario. |
| **Automatizada** | **Equipo de Desarrollo** | Ejecutar la suite completa de pruebas unitarias y de integración de todo el proyecto. |
| **Automatizada** | **Equipo de Desarrollo** | Compilar el artefacto de distribución verificando tamaño máximo y ausencia de crashes. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Flujo E2E completo sin caídas
* **Dado** el backend levantado en local y la aplicación frontend instalada
* **Cuando** un usuario nuevo completa todo el flujo principal (registro, creación de datos, consulta)
* **Entonces** el sistema persiste la información en la base de datos real y la refleja en la interfaz sin ningún cierre inesperado (0 crashes).

### E2 — Resiliencia ante desconexión / Modo local
* **Dado** el cliente operando en modo desconectado / avión
* **Cuando** el usuario interactúa con funciones de lectura y encolado local
* **Entonces** la UI no se bloquea y los datos se sincronizan fluidamente al reanudar la conexión con el backend real.

---

## ✅ 4. Definition of Done (DoD)

- [ ] 100% de los tests del Backend y Frontend pasando en verde simultáneamente.
- [ ] Recorrido completo ensayado mínimo 3 veces continuas sin un solo fallo o excepción no controlada.
- [ ] El artefacto de release compila limpiamente cumpliendo las restricciones de tamaño de `TECH_STACK.md`.
- [ ] Auditoría de cierre completada con **0 Rojos abiertos**.
- [ ] Merge de todas las ramas a `develop` y pase formal autorizado hacia la **Fase 04 (Pruebas y QA)**.
