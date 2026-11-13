# BACKLOG_BACKEND.md — Product Backlog Autónomo del Backend

> **Área Técnica:** Backend & Core de Negocio  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Gestión autónoma, desacoplada y escalable de los sprints de desarrollo del backend. Cada tarea es ejecutable de forma independiente por el Agente de Backend sin generar bloqueos en el frontend ni en otras áreas.

---

## 📊 1. Resumen y Parámetros Operativos del Backend

| Parámetro | Definición del Proyecto |
| :--- | :--- |
| **Perfil del Subsistema** | `[API REST / Monolito Modular / Microservicio / GraphQL / Servidor de Dominio]` |
| **Organización de Sprints** | Etapas relativas y modulares (Sprints Iniciales de Núcleo, Sprints de Capacidades, Sprints de Hardening) |
| **Responsables / Agentes** | `[Agente Backend / Dev / Tech Lead]` |
| **Quality Gates / Auditorías** | Verificación técnica intermedia y auditoría de hito antes del despliegue |
| **Criterio de Priorización** | **1º** Dominio e invariantes puras → **2º** Repositorios y DDL → **3º** Contratos OpenAPI/JSON → **4º** Seguridad e Integración |
| **Requisitos Vinculados** | Requisitos funcionales de servidor (`RF-XXX`) y reglas de negocio (`RN-XXX`) de `DOMAIN.md` |
| **Dimensionamiento** | **Por entregable y criterios de aceptación (DoD)**, no por horas de reloj |

---

## 🏃 2. Matriz de Sprints del Backend

> [!TIP]
> Los sprints de backend avanzan de forma desacoplada gracias a los contratos estables de [`05_Integracion_y_APIs/CONTRATOS_JSON.md`](../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md). El backend no necesita que el frontend esté construido para probar y validar sus endpoints con TDD local.

| ID Sprint | Épica / Capacidad de Backend | Agente / Dueño | Estado | Criterios de Aceptación Técnicos (DoD) |
| :--- | :--- | :--- | :---: | :--- |
| **Sprint-B01** | Esqueleto de Servicio y Salud de API | `[Agente Backend]` | `[Backlog / Done]` | Endpoint `GET /v1/salud` responde `200 OK`; suite de tests unitarios inicial en verde; configuración de variables de entorno validada (`.env`). |
| **Sprint-B02** | Autenticación, Sesión y Credenciales | `[Agente Backend]` | `[Backlog]` | Endpoints de login/registro responden según contrato OpenAPI; emisión y validación de tokens seguros; tests unitarios y de integración de auth en verde. |
| **Sprint-B03** | Módulo Núcleo A: Entidades y Reglas de Negocio | `[Agente Backend]` | `[Backlog]` | Invariantes y reglas de negocio puras (`RN-001..RN-NNN`) implementadas con TDD; operaciones CRUD validadas; repositorios aislados con transacciones seguras. |
| **Sprint-B04** | Módulo Núcleo B: Procesamiento y Transacciones | `[Agente Backend]` | `[Backlog]` | Casos de uso de procesamiento completados; validación de duplicados con `Idempotency-Key`; respuestas de error en estándar RFC 9457. |
| **Sprint-B05** | Integraciones Externas / Notificaciones / Colas | `[Agente Backend]` | `[Backlog]` | Adaptadores de salida implementados con mocks locales para testing; manejo de fallos y reintentos exponenciales verificados. |
| **Sprint-B_Audit** | Auditoría Técnica Intermedia y Hardening | `[Agente QA Backend]` | `[Backlog]` | Ejecución de `AUDITORIA_HITO_TEMPLATE.md`; 100% de la suite de tests en verde; cero vulnerabilidades críticas en dependencias; análisis estático aprobado. |

---

## 🚫 3. Fuera de Alcance Explícito del Backend

Los siguientes elementos **NO** pertenecen al backlog de backend y no deben construirse en estos sprints:

* **Interfaces de Usuario y Vistas:** Corresponden exclusivamente al backlog de frontend ([`../02_Frontend/BACKLOG_FRONTEND.md`](../02_Frontend/BACKLOG_FRONTEND.md)).
* **Requisitos Congelados de Fase 01:** Funciones catalogadas como fuera de alcance en [`01_Fase_Planificacion_y_Analisis/`](../../01_Fase_Planificacion_y_Analisis/README.md).
* **Mocks de Producción en Base de Datos:** Los esquemas DDL son puros, sin sentencias `INSERT` ficticias.

---

## ⚠️ 4. Matriz de Riesgos y Mitigaciones Técnicas

| Riesgo Técnico de Backend | Probabilidad / Impacto | Estrategia de Mitigación | Responsable |
| :--- | :---: | :--- | :--- |
| **Deriva del Contrato OpenAPI:** Diferencias entre el código implementado y la spec. | Medio / Alto | El contrato OpenAPI manda siempre. Validación automatizada de schemas en las pruebas de integración. | `[Agente Backend]` |
| **Cuello de Botella en Base de Datos Local:** Consultas N+1 o bloqueos de concurrencia. | Medio / Medio | Uso estricto de transacciones delimitadas e índices acordados en el diseño de base de datos. | `[Agente Backend]` |
| **Dependencia de Servicios Externos:** Caída o latencia de APIs externas de terceros. | Alto / Alto | Implementación de patrón Circuit Breaker y adaptadores mock en local para no detener los tests. | `[Agente Backend]` |
| **Pérdida de Contexto entre Sesiones de IA:** Retomar el código sin conocer el estado previo. | Medio / Alto | Actualización obligatoria de [`MEMORY_BACKEND.md`](MEMORY_BACKEND.md) al culminar cada sprint. | `[Agente Backend]` |
