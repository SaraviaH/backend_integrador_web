# BACKLOG_GENERAL.md — Plantilla: Tablero Maestro de Sprints e Hitos

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Tablero orquestador de alto nivel para el Product Owner y Tech Leads. Permite visualizar el estado de los sprints generales y de cada área técnica especializada.  
> **Regla de Operación:** Se dimensiona por **entregables demostrables y calidad de software**, no por horas de reloj arbitrarias. Un sprint termina cuando su Definition of Done (DoD) se cumple al 100%.

---

## 📊 1. Resumen de Gobernanza del Proyecto

| Parámetro | Definición en el Proyecto |
| :--- | :--- |
| **Objetivo General del Ciclo** | *[Completar: Lanzamiento de MVP / Versión 1.0.0 local-first]* |
| **Criterio de Dependencia Técnica** | Secuencia elegida por el equipo; integrar temprano y ajustar el paralelismo a las dependencias |
| **Mecanismo de Aislamiento** | Cada área puede tener sub-backlog y bitácora enlazados al general; la coordinación requiere responsables, límites e integración |
| **Quality Gates Programados** | Auditoría al cerrar DDL/Backend Core, Auditoría tras Frontend Base, y Auditoría Final de Integración E2E |

---

## 🗺️ 2. Matriz Maestra de Sprints del Sistema

### 🏁 Fase 1: Cimientos y Persistencia Física (Sprints Generales Obligatorios)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **Sprint-G01** | General | Setup del Ecosistema y Entorno Local | Tech Lead / PO | ⬜ Pendiente | Docker local corriendo, variables `.env.example`, linters y repositorios clonados. |
| **Sprint-G02** | General / Datos | Base de Datos: DDL Puro y Migraciones V1 | Agente Datos / DBA | ⬜ Pendiente | Esquemas creados en base local, restricciones `FK/UNIQUE/CHECK` activas, migraciones versionadas. |

---

### ⚡ Fase 2: Construcción Desacoplada en Paralelo (Sprints por Especialidad)

> [!NOTE]
> Cada pista técnica opera con su propio Product Backlog autónomo para máxima escalabilidad y trabajo multi-agente con dependencias y puntos de integración explícitos:
> * Ver Backlog Detallado de Backend: [`01_Backend/BACKLOG_BACKEND.md`](01_Backend/BACKLOG_BACKEND.md)
> * Ver Backlog Detallado de Frontend: [`02_Frontend/BACKLOG_FRONTEND.md`](02_Frontend/BACKLOG_FRONTEND.md)

#### ⚙️ Pista A: Sprints de Backend (`01_Backend/`)
| ID Sprint | Módulo / Épica | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-B01** | *[Autenticación, Sesión e Identidad]* | Agente Backend | ⬜ Pendiente | Emisión de tokens, endpoints `/v1/auth/*` según OpenAPI y tests TDD en verde. |
| **Sprint-B02** | *[Núcleo Transaccional / Servicios Puros]* | Agente Backend | ⬜ Pendiente | Reglas de negocio `RN-001..` probadas con tests unitarios aislados, CRUD operativo. |
| **Sprint-B03** | *[Cierre Backend Core + Auditoría]* | Agente Backend | ⬜ Pendiente | 100% de operaciones de la API respondiendo en local. **Auditoría de Backend aprobada.** |

#### 🎨 Pista B: Sprints de Frontend (`02_Frontend/`)
| ID Sprint | Módulo / Épica | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-F01** | *[Setup UI + Mock Server + Navegación]* | Agente Frontend | ⬜ Pendiente | App corriendo en local, Prism mock respondiendo, Atomic Design y rutas base. |
| **Sprint-F02** | *[Vistas Principales y Formularios]* | Agente Frontend | ⬜ Pendiente | Flujo de usuario de punta a punta consumiendo contratos, validaciones de UI y tests de widgets. |
| **Sprint-F03** | *[Cierre UI Base + Auditoría]* | Agente Frontend | ⬜ Pendiente | Navegación completa sin errores visuales, modo local probado. **Auditoría de Frontend aprobada.** |

---

### 🔌 Fase 3: Convergencia e Integración Final (Sprints Generales de Cierre)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **Sprint-G_E2E** | General | Integración E2E y Smoke Tests | Equipo Completo | ⬜ Pendiente | Frontend conectado al Backend real en local, flujo completo verificado con datos nuevos. |
| **Sprint-G_Rel** | General | Empaquetado, Release Candidate y Auditoría Final | Tech Lead / PO | ⬜ Pendiente | Binario compilado (APK/Docker), 0 crashes, suite de tests total en verde. **Pase a Fase 04/05.** |

*Convención de estados: ⬜ Pendiente · 🟡 En Progreso · ✅ Done (Verificado con Evidencia)*
