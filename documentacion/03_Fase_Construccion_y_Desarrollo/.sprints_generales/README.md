# Sprints Generales y Transversales (Hitos de Inicio y Cierre)

> **Área:** Transversal / Arquitectura e Integración Global  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Objetivo Multi-Agente:** Proveer el andamiaje común (Setup y DDL) antes de bifurcar el trabajo hacia los agentes de Backend y Frontend, y consolidar la integración E2E final una vez concluidos ambos tracks.

---

## 1. Justificación y Ciclo de Vida Transversal

En una arquitectura de desarrollo concurrente multi-agente, existen etapas que son inherentemente transversales:
1. **Inicio Compartido (`Sprint-G01` y `Sprint-G02`):**
   - No se puede programar backend ni correr migraciones si el workspace, los proyectos Maven/Angular y la base de datos MySQL local no están configurados y funcionando.
   - Una vez concluido `Sprint-G02` (DDL de 10 tablas verificado), se activa el **bifurcador multi-agente**: el Agente de Backend comienza `Sprint-B01` y el Agente de Frontend comienza `Sprint-F01` (usando Prism Mock Server).
2. **Cierre e Integración E2E (`Sprint-G_Final`):**
   - Una vez que Backend aprueba su `AUDITORIA_1.md` (Gate 1) y Frontend aprueba su `AUDITORIA_2.md` (Gate 2), ambos tracks convergen en este sprint de integración final para conectar la UI real con la API real, ejecutar pruebas E2E y certificar la entrega completa.

---

## 2. Mapa de Sprints Generales

```
[INICIO MACRO]
      │
      ▼
┌────────────────────────────────────────────────────────┐
│ Sprint-G01: Setup del Entorno y Proyectos Base         │
│ (Maven Spring Boot 3.2.0 + Angular 18 + MySQL 8.0)     │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Sprint-G02: Base de Datos DDL y Semillas Iniciales     │
│ (Flyway V1__init_schema.sql - 10 tablas + Seeds)       │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
     [Track 01: Backend]         [Track 02: Frontend]
     (Sprint-B01 a B05)          (Sprint-F01 a F05)
             │                           │
             ▼                           ▼
     [Gate 1: Audit 1]           [Gate 2: Audit 2]
             └─────────────┬─────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│ Sprint-G_Final: Integración E2E y Certificación        │
│ (Frontend Real + Backend Real + MySQL + Postman E2E)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
              [AUDITORIA_FINAL.md: APROBADO]
```

---

## 3. Catálogo de Sprints en este Directorio

| Carpeta / Sprint | Título | Entregable Clave |
| :--- | :--- | :--- |
| `Sprint-G01_Setup_y_Entorno/` | Setup del Entorno | Proyectos compilando, `GET /api/v1/salud` respondiendo `200 OK`, Angular app sirviendo `http://localhost:4200`. |
| `Sprint-G02_Base_de_Datos_DDL/` | Base de Datos DDL | Script Flyway `V1__init_schema.sql` con 10 tablas creadas en MySQL XAMPP y datos semilla (`V2__seed_data.sql`). |
| `Sprint-G_Final_Integracion_E2E/` | Integración E2E Final | Switch de Angular de Prism Mock a Spring Boot real, flujo E2E completo de compra y despacho verificado, `AUDITORIA_FINAL.md`. |
