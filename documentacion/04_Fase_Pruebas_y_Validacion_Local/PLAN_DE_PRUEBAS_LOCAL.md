# PLAN_DE_PRUEBAS_LOCAL.md — Estrategia y Plan de Pruebas

> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Definir el alcance, la estrategia de pirámide de pruebas, los entornos de ejecución, las herramientas seleccionadas por el equipo y los criterios de aceptación para validar el incremento de software.  
> **Regla de Operación:** El agente de IA **no debe imponer librerías de testing predeterminadas**. Debe consultar al usuario qué frameworks de prueba utiliza su stack.

---

## 🤖 Consulta de Herramientas de Testing al Usuario

Antes de redactar la suite de pruebas automatizadas, el agente formula:
> 💬 *"¿Qué framework o herramientas de pruebas prefieres utilizar para este proyecto?*  
> * *Para Backend (Unit & Integración):* (ej. Jest, Vitest, Pytest, JUnit 5, Go test)  
> * *Para Frontend (Componentes & a11y):* (ej. React Testing Library, Vitest, Cypress, Playwright, axe-core)  
> * *Para E2E y Pruebas en Staging:* (ej. Playwright, Cypress, Postman / Newman, Maestro para móvil)*  
> *Indícame tus preferencias o si deseas que te recomiende la combinación óptima para tu stack."*

---

## 🎯 1. Objetivos del Plan de Pruebas

1. **Verificar Requisitos de Negocio:** Garantizar que los `RF-001..RF-NNN` aprobados en Fase 01 funcionan como espera el usuario.
2. **Validar Contratos de Integración:** Asegurar que cliente y servidor se comunican sin discrepancias respetando `CONTRATOS_JSON.md` y `openapi_template.yaml`.
3. **Comprobar Atributos de Calidad (RNF):** Validar tiempos de respuesta, funcionamiento offline y accesibilidad WCAG 2.1 AA.
4. **Validar en Pre-Producción (Staging):** Ejecutar pruebas de humo y flujos de usuario reales en Railway / Supabase con dispositivos físicos.

---

## 📊 2. Estrategia por Niveles de Prueba

| Nivel de Prueba | Alcance | Entorno | Automatización | Responsable |
| :--- | :--- | :--- | :---: | :--- |
| **Pruebas Unitarias** | Funciones puras, entidades de dominio y validaciones aisladas | En memoria (Local) | 100% Automático | Backend / Frontend Lead |
| **Pruebas de Integración** | Repositorios contra BD real, adaptadores y controladores HTTP | Docker local | 100% Automático | Backend Lead |
| **Pruebas de Componente UI**| Renderizado, estados (vacío, carga, error) y accesibilidad | Local / Headless | 100% Automático | Frontend Lead |
| **Pruebas E2E (Aceptación)** | Flujos completos de usuario (desde login hasta checkout) | Local / Staging | Automático / Manual | QA Lead |
| **Validación en Staging** | Conectividad real, redes móviles 4G, certificados SSL y pasarelas | Nube (Railway + Supabase)| Manual estructurado | Equipo completo |

---

## ⚙️ 3. Configuración de Entornos de Prueba

### 3.1 Entorno Local (Máquina de Desarrollo)
* **Base de Datos:** Contenedor Docker (PostgreSQL / SQLite) levantado con `docker-compose.yml`.
* **Mock Server:** Servidor Prism apuntando a `openapi_template.yaml` para desacoplar el frontend.
* **Aislamiento:** Cero dependencia de internet; las pruebas corren en modo avión sin fallar.

### 3.2 Entorno de Pre-Producción (Staging)
* **Hosting de API:** Despliegue en Railway / Render conectado a la rama `develop`.
* **Base de Datos Remota:** Instancia de pruebas en Supabase / Postgres Cloud aislada de producción.
* **Ping Anti-Sueño:** Configurado para responder `GET /v1/salud` cada 10 minutos para mantener la instancia activa.

---

## 📋 4. Criterios de Entrada y Salida (DoR y DoD de QA)

### Criterio de Entrada (Definition of Ready):
- [ ] Fase 03 completada y código estabilizado en ramas de trabajo.
- [ ] Suites de tests unitarios ejecutadas y pasando al 100% en local.
- [ ] Entorno de Staging preparado con antelación por el rol de DevOps/QA.

### Criterio de Salida (Definition of Done):
- [ ] Cero defectos bloqueantes o de severidad alta abiertos en el backlog.
- [ ] Informe de ejecución de pruebas completado con evidencias en [`INFORME_EJECUCION_PRUEBAS.md`](INFORME_EJECUCION_PRUEBAS.md).
- [ ] Calificación de semáforo en **VERDE** en [`AUDITORIA_CALIDAD_FASE4_A_FASE5.md`](AUDITORIA_CALIDAD_FASE4_A_FASE5.md).
