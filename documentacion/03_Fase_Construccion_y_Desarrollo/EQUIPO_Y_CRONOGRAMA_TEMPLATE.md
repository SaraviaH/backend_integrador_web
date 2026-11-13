# Equipo y Coordinación del Incremento (COMPUNEX B2B)

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Modalidad:** Desarrollo local individual y asistido por agente. Sin asignación externa de cronogramas fijos.

---

## 👥 1. Roles y Responsabilidad Técnica

| Ámbito / Módulo | Responsable | Límite de Archivos | Contrato de Referencia | Estado |
| :--- | :--- | :--- | :--- | :---: |
| **Arquitectura, BD y Backend** | Desarrollador + Agente IA | `backend_integrador_web/compunex-backend/` | [`CONTRATOS_JSON.md`](../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md) | En curso |
| **Frontend Angular Web** | Desarrollador + Agente IA | Workspace Frontend Angular (`src/app/**`) | [`CONTRATOS_JSON.md`](../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md) | Pendiente de inicio |
| **Aseguramiento de Calidad (QA)** | Desarrollador + Agente IA | `documentacion/04_Fase_Pruebas_y_Validacion_Local/` | JUnit 5 + Pruebas E2E en navegador | Pendiente |

---

## 🔄 2. Puntos de Sincronización y Reglas de Coordinación

* **Punto de Integración:** Entorno local en `http://localhost:8080/api/v1` consumido por Angular en `http://localhost:4200`.
* **Fuente Única de Verdad de Datos:** [`CONTRATOS_JSON.md`](../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md). Ningún componente del frontend inventa campos fuera de este archivo.
* **Control de Conflictos:** Cada cambio técnico de estructura se registra en la bitácora correspondiente (`MEMORY_BACKEND.md` o `MEMORY_FRONTEND.md`) antes de realizar commit.
