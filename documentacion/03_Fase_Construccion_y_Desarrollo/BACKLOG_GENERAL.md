# BACKLOG_GENERAL.md — Tablero Macro y Orquestador Multi-Agente

> **Área:** Transversal / Coordinador Macro  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo (**Cerrada y Certificada E2E — `v1.0.0-mvp`**)  
> **Total Sprints:** 3 Generales + 9 Backend (`B01..B09` + Gate 1) + 14 Frontend (+ Gate 2) + Integración Final  
> **Línea Base Entregada:** 24 Endpoints Core + 2 Media (`CONTRATOS_JSON.md`), 10 Tablas PostgreSQL (`compunex_b2b`), 27 Pantallas MVP, 8 Reglas (`RN-001` a `RN-008`).

---

## 1. Visión y Flujo Concurrente Multi-Agente

El desarrollo de COMPUNEX B2B opera de forma desacoplada y paralela mediante el patrón **Contract-First**:

```
                       [Sprint-G01: Setup del Ecosistema]
                                      │
                                      ▼
                       [Sprint-G02: Base de Datos DDL V1]
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
   [01_Backend/.sprints/]                     [02_Frontend/.sprints/]
   Sprint-B01: Arquitectura, SOLID & Base     Sprint-F01: Arquitectura, SOLID & Tokens
   Sprint-B02: Auth Aditivo Empresa           Sprint-F02: Auth & Registro
   Sprint-B03: Catálogo Público B2B           Sprint-F03: Home & Categorías
   Sprint-B04: Persistencia Órdenes           Sprint-F04: Catálogo B2B
   Sprint-B05: Checkout Split Order           Sprint-F05: Ficha Detalle Producto
   Sprint-B06: Historial & Facturas           Sprint-F06: Carrito Reactivo
   Sprint-B07: Ventas Proveedor               Sprint-F07: Checkout Wizard 3 Pasos
   Sprint-B08: Auditoría AOP & Admin          Sprint-F08: Visor Factura Simulada
                 │                            Sprint-F09: Mis Compras & Trazabilidad
                 ▼                            Sprint-F10: Mi Cuenta & Seguridad
   [Gate 1: AUDITORIA_1.md]                   Sprint-F11: Dashboard Proveedor
   (24/24 endpoints passing)                  Sprint-F12: Catálogo Proveedor CRUD
                 │                            Sprint-F13: Ventas & Despacho
                 │                            Sprint-F14: Páginas de Error & Fallbacks
                 │                                         │
                 │                                         ▼
                 │                            [Gate 2: AUDITORIA_2.md]
                 │                            (27/27 pantallas con 4 estados)
                 └────────────────────┬────────────────────┘
                                      │
                                      ▼
                       [Sprint-G_Final: Integración E2E]
                                      │
                                      ▼
                        [AUDITORIA_FINAL.md: APROBADO]
```

---

## 2. Matriz Maestra de Sprints del Proyecto

### 🏁 Pista Transversal Inicial (Setup y DDL)
| ID Sprint | Título | Entregable Clave | Dependencia | Estado |
| :---: | :--- | :--- | :---: | :---: |
| `Sprint-G01` | Setup del Entorno y Proyectos Base | Proyectos Maven (Java 21 / Spring Boot 3.5.16) y Angular 18 configurados; Swagger UI `200 OK`. | Ninguna | `COMPLETADO` |
| `Sprint-G02` | Base de Datos DDL y Semillas V1/V2 | 10 tablas en PostgreSQL (`compunex_b2b`) generadas vía Hibernate JPA + `DataInitializer` semilla. | `Sprint-G01` | `COMPLETADO` |

---

### ⚙️ Pista Backend (9 Sprints + Gate 1)
| ID Sprint | Título | Endpoints | Tablas | Estado |
| :---: | :--- | :---: | :--- | :---: |
| `Sprint-B01` | Arquitectura, Estructura y Reglas SOLID (14 EPs Base) | 1 a 6, 7 a 14 | `usuarios`, `perfiles_proveedor`, `categorias`, `productos` | `COMPLETADO` |
| `Sprint-B02` | Auth Aditivo, Empresa y Activación | 15, 16, 17 | `usuarios`, `perfiles_proveedor` | `COMPLETADO` |
| `Sprint-B03` | Catálogo Público B2B | 18, 19 | `productos`, `categorias`, `imagenes`, `specs` | `COMPLETADO` |
| `Sprint-B04` | Persistencia Órdenes y Split Order | Modelado DDL JPA | `ordenes`, `subordenes_factura`, `orden_items` | `COMPLETADO` |
| `Sprint-B05` | Checkout Transaccional Split Order | 20 | `ordenes`, `subordenes_factura`, `orden_items`, `productos` | `COMPLETADO` |
| `Sprint-B06` | Historial Compras y Detalle Orden | 21, 22 | `ordenes`, `subordenes_factura`, `orden_items` | `COMPLETADO` |
| `Sprint-B07` | Ventas Proveedor y Despacho | 23, 24 | `subordenes_factura`, `orden_items`, `usuarios` | `COMPLETADO` |
| `Sprint-B08` | Auditoría AOP y Admin Moderación | 13, 14, AOP | `productos`, `usuarios` | `COMPLETADO` |
| `Sprint-B09` | Almacenamiento Multimedia Local | `/media/upload`, `/media/files/**` | `imagenes_producto`, almacenamiento local | `COMPLETADO` |
| `Sprint-B_Audit` | **Quality Gate 1: Certificación Backend** | 1 al 24 + Media | 10 Tablas Integradas (`83/83` tests JUnit) | `APROBADO` |

---

### 🎨 Pista Frontend (14 Sprints + Gate 2)
| ID Sprint | Título | Pantallas | Componentes Clave | Estado |
| :---: | :--- | :---: | :--- | :---: |
| `Sprint-F01` | Arquitectura por Capas, Reglas SOLID y Tokens SASS | Shell Global | `ShellComponent`, `StoreNavbar`, `PanelSidebar`, `CoreModels` | `COMPLETADO` |
| `Sprint-F02` | Auth, Login y Registro Empresa | `P-06`, `P-07` | `LoginComponent`, `RegisterCompanyComponent`, `AuthService` | `COMPLETADO` |
| `Sprint-F03` | Portal de Inicio y Categorías | `P-01`, `P-02` | `HomeComponent`, `CategoriesComponent` | `COMPLETADO` |
| `Sprint-F04` | Catálogo B2B y Búsqueda Reactiva | `P-03` | `CatalogComponent`, `ProductCardComponent`, `CatalogStateService` | `COMPLETADO` |
| `Sprint-F05` | Ficha Detalle y Contacto Proveedor | `P-04`, `P-05` | `ProductDetailComponent`, `ProviderContactModalComponent` | `COMPLETADO` |
| `Sprint-F06` | Carrito Reactivo y Agrupación | `P-09` | `CartComponent`, `CartGroupItemComponent`, `CartService` | `COMPLETADO` |
| `Sprint-F07` | Asistente de Checkout en 3 Pasos | `P-10`, `P-11`, `P-12` | `CheckoutWizardComponent`, `BillingStep`, `ReviewStep` | `COMPLETADO` |
| `Sprint-F08` | Visor de Factura y Comprobantes | `P-13` | `InvoiceViewerComponent` (Estilos `@media print`) | `COMPLETADO` |
| `Sprint-F09` | Mis Compras y Detalle de Pedido | `P-14`, `P-15` | `MyOrdersComponent`, `OrderDetailComponent` | `COMPLETADO` |
| `Sprint-F10` | Mi Cuenta, Seguridad y Activación | `P-16`, `P-17`, `P-18` | `ProfileComponent`, `ChangePassword`, `ActivateProvider` | `COMPLETADO` |
| `Sprint-F11` | Dashboard Proveedor y Perfil | `P-19`, `P-26` | `ProviderDashboardComponent`, `ProviderCompanyProfile` | `COMPLETADO` |
| `Sprint-F12` | CRUD de Catálogo del Proveedor | `P-20` a `P-23` | `ProviderProductsComponent`, `ProductFormComponent` | `COMPLETADO` |
| `Sprint-F13` | Ventas Recibidas y Despacho | `P-24`, `P-25` | `ProviderSalesComponent`, `ProviderSaleDetailComponent` | `COMPLETADO` |
| `Sprint-F14` | Páginas de Error y Rutas | `P-36`, `P-37` | `AccessDeniedComponent`, `NotFoundComponent` | `COMPLETADO` |
| `Sprint-F_Audit` | **Quality Gate 2: Certificación Frontend** | 27 Pantallas | Suite completa UI (`ng build` 0 errores / 0 advertencias) | `APROBADO` |

---

### 🔌 Pista de Cierre e Integración Final
| ID Sprint | Título | Entregable Clave | Dependencia | Estado |
| :---: | :--- | :--- | :---: | :---: |
| `Sprint-G_Final` | Integración E2E y Release Final | Unión Front Real + Back Real sin Mocks (`useMock: false`), 5 flujos E2E en vivo en Chromium + PostgreSQL. | `Gate 1` + `Gate 2` | `COMPLETADO` |
| `AUDITORIA_FINAL` | **Acta de Certificación Definitiva** | Validación 0 rojos en vivo y tag `v1.0.0-mvp` en `integracion/e2e`. | `Sprint-G_Final` | `APROBADO` |
