# BACKLOG_GENERAL.md — Tablero Maestro de Sprints e Hitos (COMPUNEX B2B)

> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Proyecto:** COMPUNEX B2B — Marketplace Mayorista de Hardware  
> **Base de Contrato y Dominio:** [`CONTRATOS_JSON.md`](../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md) (24 Endpoints) y [`MODELO_Y_DICCIONARIO_BD.md`](../02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md) (10 Tablas).  
> **Regla de Operación:** Se dimensiona por entregables demostrables y calidad de software. Un sprint concluye al cumplir su Definition of Done (DoD) al 100%.

---

## 📊 1. Resumen de Gobernanza del Proyecto

| Parámetro | Definición en COMPUNEX B2B |
| :--- | :--- |
| **Objetivo General del Ciclo** | Entrega de MVP B2B E-Commerce Transaccional (Catálogo, Carrito Multi-Proveedor, Checkout Split Order, Facturación Simulada y Gestión de Proveedor). |
| **Criterio de Dependencia Técnica** | Backend Base (perfiles/secretos y 10 endpoints aditivos) y Frontend Angular por capas conectado vía `environment.apiUrl`. |
| **Mecanismo de Coordinación** | Trabajo individualizado (desarrollador y agente) sincronizado por contratos JSON congelados y pruebas automatizadas (JUnit / Angular). |
| **Quality Gates Programados** | QG-01: Cierre Backend y BD (`compunex-backend`) -> QG-02: Cierre Frontend Angular (`compunex-frontend`) -> QG-Final: Integración E2E y Empaquetado. |

---

## 🗺️ 2. Matriz Maestra de Sprints del Sistema

### 🏁 Fase 1: Cimientos, Entorno y Persistencia Física (Sprints Generales)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :--- |
| **Sprint-G01** | General | Setup del Ecosistema y Perfiles de Entorno | ⬜ Pendiente | Perfiles `dev`/`prod` en backend, variables `${...}` para BD y JWT, entorno Angular preparado con `environment.ts` y scripts de build. |
| **Sprint-G02** | General / Datos | Base de Datos: Esquema de 10 Tablas y Semillas | ⬜ Pendiente | Tablas `usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`, `ordenes`, `subordenes_factura`, `orden_items` con restricciones de integridad y seeds base. |

---

### ⚡ Fase 2: Construcción Desacoplada (Pistas Especializadas)

#### ⚙️ Pista A: Sprints de Backend (`01_Backend/` — `compunex-backend`)
| ID Sprint | Módulo / Épica | Endpoints / Contratos | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-B01** | Perfiles, Secretos y Seguridad JWT | Endpoints 1–4, 15, 17 | ⬜ Pendiente | Separación `application-dev`/`prod`, registro empresa (`P-07`), activación proveedor (`P-18`), cambio de clave y tests en verde. |
| **Sprint-B02** | Catálogo Público y Gestión Proveedor | Endpoints 5–12, 16, 18, 19 | ⬜ Pendiente | Catálogo público paginado (`/products`), ficha con proveedor/contacto, CRUD propio y perfil comercial (`P-26`). |
| **Sprint-B03** | Transaccional: Órdenes, Split Order y Facturación Simulada | Endpoints 20–24 | ⬜ Pendiente | Checkout multi-proveedor (`/orders/checkout`), cálculo fiscal servidor, comprobantes simulados, historial compras/ventas y JUnit. |

#### 🎨 Pista B: Sprints de Frontend (`02_Frontend/` — `compunex-frontend`)
| ID Sprint | Módulo / Épica | Pantallas Vinculadas | Estado | Criterio de Salida (DoD) |
| :---: | :--- | :---: | :---: | :--- |
| **Sprint-F01** | Setup Angular por Capas, Layout y Auth | `P-01`, `P-06`, `P-07`, `P-16`, `P-17` | ⬜ Pendiente | Estructura `kebab-case`, Navbar/Sidebar, SASS tokens, AuthInterceptor, AuthGuard, Login y Registro de Empresa. |
| **Sprint-F02** | Catálogo Público, Ficha Técnica y Carrito B2B | `P-02`, `P-03`, `P-04`, `P-05`, `P-09` | ⬜ Pendiente | Vista catálogo con filtros, ficha técnica con pedido mínimo, diálogo contacto y Carrito Multi-Proveedor agrupado. |
| **Sprint-F03** | Checkout Split Order, Facturación Simulada y Paneles | `P-10..P-15`, `P-18..P-26`, `P-36`, `P-37` | ⬜ Pendiente | Checkout, generación de comprobantes simulados, historial, Panel Proveedor (CRUD) y página 404. |

---

### 🔌 Fase 3: Integración E2E y Cierre (Sprint General Final)

| ID Sprint | Área / Ámbito | Épica / Capacidad | Estado | Criterio de Salida (DoD) |
| :---: | :---: | :--- | :---: | :--- |
| **Sprint-G_E2E** | General | Integración E2E Frontend ↔ Backend | ⬜ Pendiente | Flujo completo compra/venta con datos reales en local, 0 errores en consola, manejo de 400/401/403/404 probado. |
| **Sprint-G_Rel** | General | Empaquetado y Verificación Pre-Entrega | ⬜ Pendiente | Empaquetado `PF_BC_GRUPO_XX.rar` y `PF_FR_GRUPO_XX.rar` (sin contraseña, < 500 MB) y verificación anti-penalizaciones. |

*Convención de estados: ⬜ Pendiente · 🟡 En Progreso · ✅ Done (Verificado con Evidencia)*
