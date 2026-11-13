# BACKLOG_GENERAL.md — Tablero Macro de Orquestación Multi-Agente

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Sistema:** COMPUNEX — E-Commerce B2B con Split Order y Facturación Simulada  
> **Propósito:** Tablero macro para el Product Owner / Tech Lead. Coordina los sprints transversales y supervisa las dos pistas paralelas de desarrollo autónomo (Backend y Frontend).  
> **Regla de Operación:** Se dimensiona por **entregables demostrables y Definition of Done (DoD)**, no por horas de reloj arbitrarias.

---

## 📊 1. Resumen de Gobernanza del Proyecto

| Parámetro | Definición en el Proyecto |
| :--- | :--- |
| **Perfil del Software** | MVP Transaccional B2B (Spring Boot 3.2.0 + Angular 18 + MySQL 8.0 XAMPP) |
| **Modelo Operativo** | **Multi-Agente Concurrente Desacoplado** (Backend y Frontend corren en paralelo) |
| **Integrantes y Roles** | Desarrollador (PO / Revisor Humano) + Agentes de IA ejecutando bajo [AGENTS.md](../../AGENTS.md) |
| **Cronograma / Calendario** | Sin fechas de reloj ficticias; el avance se rige por el cumplimiento secuencial de cada DoD demostrable |
| **Quality Gates Programados** | Auditoría Backend (`Sprint-B_Audit`), Auditoría Frontend (`Sprint-F_Audit`) y Auditoría Final (`Sprint-G_Final`) |
| **Contratos Vinculantes** | 24 endpoints de `CONTRATOS_JSON.md`, 10 tablas de `MODELO_Y_DICCIONARIO_BD.md`, 27 pantallas de `PROMPTS_GOOGLE_STITCH_TEMPLATE.md`, 8 reglas de `DOMAIN.md` |

---

## 🗺️ 2. Matriz Maestra de Sprints del Sistema

### 🏁 Etapa 1: Cimientos y Persistencia Física (Sprints Generales Iniciales)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **Sprint-G01** | Transversal | Setup del Ecosistema y Entorno Local | Agente Infra / Dev | ⬜ Pendiente | Spring Boot 3.2 compila; Angular 18 compila; MySQL en XAMPP conectado; `.env.example` versionado; `GET /api/v1/salud` responde `200 OK`. |
| **Sprint-G02** | Persistencia | Base de Datos: DDL Físico de 10 Tablas y Seeds | Agente Datos / DBA | ⬜ Pendiente | Las 10 tablas físicas existen en MySQL con PK, FK, `UNIQUE`, `CHECK` e índices; migración Flyway `V1__init_schema.sql` ejecutada; datos iniciales cargados. |

---

### ⚡ Etapa 2: Construcción Desacoplada en Paralelo (Pistas Autónomas)

> [!NOTE]
> Ambas pistas avanzan simultáneamente sin bloquearse. Frontend consume el Mock Server local de la API (`CONTRATOS_JSON.md`) mientras Backend implementa los endpoints reales sobre la BD local.

#### ⚙️ Pista A: Sprints de Backend ([`01_Backend/BACKLOG_BACKEND.md`](01_Backend/BACKLOG_BACKEND.md))
*Responsable: Agente de Backend*

| ID Sprint | Módulo / Épica de Servidor | Endpoints | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-B01** | Autenticación, JWT JJWT y Control RBAC | `#1..#4` | ⬜ Pendiente | Register, login, refresh, logout según contratos; BCrypt; RUC único (`RN-001`); tests TDD en verde. |
| **Sprint-B02** | Catálogo B2B, Categorías y Productos | `#5..#10` | ⬜ Pendiente | CRUD productos, paginación, filtros; reglas `RN-003` (precio > 0) y `RN-004` (stock >= 0) probadas en verde. |
| **Sprint-B03** | Carrito, Cotización y Split Order Transaccional | `#11..#16` | ⬜ Pendiente | Algoritmo de Split Order atómico (`RN-005`); cálculo IGV 18%; serie de factura simulada (`RN-006`). |
| **Sprint-B04** | Panel Proveedor, Despacho y Stock en Lote | `#17..#21` | ⬜ Pendiente | Transición de estados de suborden (`RN-007`); factura consultable; aislamiento multitenant (`RN-008`). |
| **Sprint-B05** | Bitácora de Auditoría Admin y Usuarios | `#23..#24` | ⬜ Pendiente | Logging inmutable de eventos con interceptor AOP; administración y gestión de usuarios. |
| **Sprint-B_Audit**| Auditoría Técnica Intermedia de Backend | Todos (`1..24`) | ⬜ Pendiente | **Quality Gate 1 (0 rojos abiertos):** Colección Postman con los 24 endpoints pasando al 100% en MySQL local. |

#### 🎨 Pista B: Sprints de Frontend ([`02_Frontend/BACKLOG_FRONTEND.md`](02_Frontend/BACKLOG_FRONTEND.md))
*Responsable: Agente de Frontend*

| ID Sprint | Módulo / Vistas de Interfaz | Pantallas | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-F01** | Setup Angular 18, Tailwind Tokens y Auth UI | `P-01..P-03` | ⬜ Pendiente | Shell responsivo, router guards, interceptor JWT, pantallas de bienvenida, login y registro con RUC. |
| **Sprint-F02** | Catálogo B2B, Búsqueda y Detalle de Producto | `P-04..P-09` | ⬜ Pendiente | Catálogo con filtros reactivos (Signals), búsqueda por SKU, ficha técnica y comparador de productos. |
| **Sprint-F03** | Carrito Corporativo Reactivo y Cotización | `P-10..P-14` | ⬜ Pendiente | `CartService` reactivo con Signals; agrupación visual por proveedor previo al split; 4 estados de pantalla. |
| **Sprint-F04** | Checkout B2B, Split Order Visual y Factura | `P-15..P-21` | ⬜ Pendiente | Pre-visualización de subórdenes divididas, confirmación de compra, historial y visor de factura simulada. |
| **Sprint-F05** | Paneles de Gestión para Proveedor y Admin | `P-22..P-27` | ⬜ Pendiente | Panel de subórdenes de despacho, métricas B2B, panel admin de auditoría y gestión de usuarios. |
| **Sprint-F_Audit**| Auditoría de Accesibilidad (WCAG AA) y UI | Todas (`P-01..27`)| ⬜ Pendiente | **Quality Gate 2 (0 rojos abiertos):** 27 pantallas MVP implementadas, WCAG 2.1 AA (contraste ≥ 4.5:1), clics reales. |

---

### 🔌 Etapa 3: Convergencia e Integración Final (Sprints Generales de Cierre)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Responsable | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :---: | :--- |
| **Sprint-G_Final** | Transversal | Integración E2E, Smoke Tests y Release | Equipo Completo | ⬜ Pendiente | Frontend Angular 18 conectado de punta a punta al Backend Spring Boot real sobre MySQL XAMPP; recorrido nuevo probado; 0 crashes; compilación limpia de producción. **AUDITORIA_FINAL aprobada.** |

*Convención de estados: ⬜ Pendiente · 🟡 En Progreso · ✅ Done (Verificado con Evidencia)*

---

## 🚦 3. Gate 0 — Cobertura y Trazabilidad Total

| Elemento | Total Fase 01 / 02 | Asignados en Backend | Asignados en Frontend | Asignados en Generales | Estado |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Requisitos Funcionales (`RF-001..RF-014`)** | 14 | 14 | 14 | 14 | ✅ **100% Cubierto** |
| **Tablas de Base de Datos** | 10 | 10 | — | 10 | ✅ **100% Cubierto** |
| **Endpoints del Contrato JSON** | 24 | 24 | 24 (consumo) | 1 (`/salud`) | ✅ **100% Cubierto** |
| **Pantallas de UI (Mockups Stitch)** | 27 | — | 27 | — | ✅ **100% Cubierto** |
| **Reglas de Negocio (`RN-001..RN-008`)** | 8 | 8 | 8 (validación UI) | — | ✅ **100% Cubierto** |
| **Carpetas `_Plantilla` o Placeholders** | — | 0 | 0 | 0 | ✅ **Cero Placeholders** |

**Veredicto Gate 0:** ✅ **APROBADO PARA CONSTRUCCIÓN MULTI-AGENTE**
