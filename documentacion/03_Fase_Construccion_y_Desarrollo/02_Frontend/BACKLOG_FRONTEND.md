# BACKLOG_FRONTEND.md — Product Backlog Autónomo del Frontend

> **Área Técnica:** Frontend, UI/UX & Cliente  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Gestión autónoma, desacoplada y escalable de los sprints de desarrollo de la interfaz de usuario. Cada sprint es ejecutable de forma independiente por el Agente de Frontend, usando el cliente mock de la API o mocks en memoria sin depender de que el backend esté listo.

---

## 📊 1. Resumen y Parámetros Operativos del Frontend

| Parámetro | Definición del Proyecto |
| :--- | :--- |
| **Perfil del Subsistema** | `[SPA Web / Mobile Flutter / Mobile React Native / PWA / Desktop App]` |
| **Organización de Sprints** | Etapas modulares (Sprints de Setup y Componentes Base, Sprints de Features/Vistas, Sprints de Integración y Accesibilidad) |
| **Responsables / Agentes** | `[Agente Frontend / UI Dev / QA Frontend]` |
| **Quality Gates / Auditorías** | Verificación de accesibilidad WCAG 2.1 AA, pruebas de interacción y auditoría de hito |
| **Criterio de Priorización** | **1º** Tokens y Átomos base → **2º** Shell de Navegación y Auth → **3º** Pantallas Núcleo → **4º** Estados de Red (Carga/Error/Offline) |
| **Requisitos Vinculados** | Requisitos funcionales de interacción (`RF-XXX`), mockups aprobados e inventario de pantallas |
| **Dimensionamiento** | **Por componente y criterios de aceptación (DoD)**, no por horas de reloj |

---

## 🏃 2. Matriz de Sprints del Frontend

> [!TIP]
> **Desacoplamiento Contract-First:** El Frontend puede desarrollarse y probarse al 100% en local consumiendo el servidor mock generado desde [`openapi_template.yaml`](../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/openapi_template.yaml) (vía Prism o mock handlers de MSW). No existe bloqueo ni dependencia de sincronización con el equipo de Backend.

| ID Sprint | Épica / Pantallas y Componentes | Agente / Dueño | Estado | Criterios de Aceptación Técnicos (DoD) |
| :--- | :--- | :--- | :---: | :--- |
| **Sprint-F01** | Setup del Cliente, Tokens y Átomos Base | `[Agente Frontend]` | `[Backlog / Done]` | Proyecto cliente inicializado; tokens de [`DESIGN_TEMPLATE.md`](../../02_Fase_Diseno_y_Arquitectura/02_Frontend/Mockups/DESIGN_TEMPLATE.md) configurados; botones, inputs y tipografía base renderizando con tests visuales/unitarios. |
| **Sprint-F02** | Shell de Navegación y Flujo de Autenticación | `[Agente Frontend]` | `[Backlog]` | Vistas de bienvenida y login construidas según mockups `P-02`; navegación por rutas funcional; validación de formularios en cliente con mensajes de error accesibles. |
| **Sprint-F03** | Módulo Núcleo A: Vistas Principales y Listados | `[Agente Frontend]` | `[Backlog]` | Pantalla principal `P-03` implementada con Atomic Design; renderizado de tarjetas; soporte de estados de carga (skeletons), lista vacía y error de red. |
| **Sprint-F04** | Módulo Núcleo B: Detalle y Formularios de Creación | `[Agente Frontend]` | `[Backlog]` | Pantalla de detalle `P-04` y formulario de creación `P-05`; controles táctiles con áreas mínimas de 48×48 dp; feedback visual de guardado exitoso y validaciones de campo. |
| **Sprint-F05** | Estado Desconectado y Manejo de Red (Offline/Cache) | `[Agente Frontend]` | `[Backlog]` | Persistencia en almacenamiento local (IndexedDB / SQLite / LocalStorage); banner visual de modo sin conexión; sincronización optimista con rollback en fallo. |
| **Sprint-F_Audit** | Auditoría de Accesibilidad (WCAG AA) y Pulido UI | `[Agente QA Frontend]` | `[Backlog]` | Verificación de contraste 4.5:1; navegación con teclado y lectores de pantalla (TalkBack/VoiceOver); escalado de texto al 200% sin roturas; auditoría de hito en verde. |

---

## 🚫 3. Fuera de Alcance Explícito del Frontend

Los siguientes elementos **NO** pertenecen al backlog de frontend:

* **Lógica de Persistencia en Servidor o Base de Datos:** Corresponde exclusivamente al backend ([`../01_Backend/BACKLOG_BACKEND.md`](../01_Backend/BACKLOG_BACKEND.md)).
* **Componentes o Pantallas sin Requisito Aprobado:** Prohibido agregar pantallas "fantasma" que no figuren en los mockups aprobados de Fase 02.
* **Seguridad Crítica Delegada en Cliente:** Las validaciones visuales son para experiencia de usuario; la seguridad y autorización residen en el backend.

---

## ⚠️ 4. Matriz de Riesgos y Mitigaciones Técnicas

| Riesgo Técnico de Frontend | Probabilidad / Impacto | Estrategia de Mitigación | Responsable |
| :--- | :---: | :--- | :--- |
| **Desalineación con la API Real:** Incompatibilidad de payloads al integrar. | Medio / Alto | El cliente HTTP consume tipos TypeScript o modelos generados directamente desde el contrato OpenAPI. | `[Agente Frontend]` |
| **Fallas de Accesibilidad (WCAG):** Áreas táctiles pequeñas o bajo contraste en pantallas reales. | Alto / Alto | Verificación obligatoria contra la lista de chequeo de [`Mockups/README.md`](../../02_Fase_Diseno_y_Arquitectura/02_Frontend/Mockups/README.md). | `[Agente QA Frontend]` |
| **Fugas de Memoria en Estado Global:** Re-renderizados excesivos o suscripciones no canceladas. | Bajo / Medio | Uso de selectores atómicos de estado y limpieza de listeners en el ciclo de vida de los componentes. | `[Agente Frontend]` |
| **Pérdida de Contexto entre Sesiones de IA:** Pérdida del progreso de componentes. | Medio / Alto | Registro obligatorio del estado de la UI en [`MEMORY_FRONTEND.md`](MEMORY_FRONTEND.md) al culminar cada sprint. | `[Agente Frontend]` |
