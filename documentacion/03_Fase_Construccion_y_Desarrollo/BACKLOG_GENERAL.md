# BACKLOG_GENERAL.md — Tablero Macro y Orquestador Multi-Agente

> **Área:** Transversal / Coordinador Macro  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Total Sprints:** 3 Generales + 8 Backend (+ Gate 1) + 14 Frontend (+ Gate 2) + Integración Final  
> **Línea Base Congelada:** 24 Endpoints (`CONTRATOS_JSON.md`), 10 Tablas MySQL (`MODELO_Y_DICCIONARIO_BD.md`), 27 Pantallas MVP (`PROMPTS_GOOGLE_STITCH_TEMPLATE.md`), 8 Reglas (`RN-001` a `RN-008`).

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
   Sprint-B01: Auditoría Base 14 EPs          Sprint-F01: Setup UI & Tokens
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
| `Sprint-G01` | Setup del Entorno y Proyectos Base | Proyectos Maven y Angular configurados, proxy y `GET /api/v1/salud` 200 OK. | Ninguna | `PENDIENTE` |
| `Sprint-G02` | Base de Datos DDL y Semillas V1/V2 | 10 tablas MySQL en XAMPP creadas vía Flyway y datos semilla. | `Sprint-G01` | `PENDIENTE` |

---

### ⚙️ Pista Backend (8 Sprints + Gate 1)
| ID Sprint | Título | Endpoints | Tablas | Estado |
| :---: | :--- | :---: | :--- | :---: |
| `Sprint-B01` | Auditoría y Refactor Base Existente | 1 a 6, 7 a 14 | `usuarios`, `perfiles_proveedor`, `categorias`, `productos` | `BLOQUEADO` |
| `Sprint-B02` | Auth Aditivo, Empresa y Activación | 15, 16, 17 | `usuarios`, `perfiles_proveedor` | `BLOQUEADO` |
| `Sprint-B03` | Catálogo Público B2B | 18, 19 | `productos`, `categorias`, `imagenes`, `specs` | `BLOQUEADO` |
| `Sprint-B04` | Persistencia Órdenes y Split Order | Modelado DDL JPA | `ordenes`, `subordenes_factura`, `orden_items` | `BLOQUEADO` |
| `Sprint-B05` | Checkout Transaccional Split Order | 20 | `ordenes`, `subordenes_factura`, `orden_items`, `productos` | `BLOQUEADO` |
| `Sprint-B06` | Historial Compras y Detalle Orden | 21, 22 | `ordenes`, `subordenes_factura`, `orden_items` | `BLOQUEADO` |
| `Sprint-B07` | Ventas Proveedor y Despacho | 23, 24 | `subordenes_factura`, `orden_items`, `usuarios` | `BLOQUEADO` |
| `Sprint-B08` | Auditoría AOP y Admin Moderación | 13, 14, AOP | `productos`, `usuarios` | `BLOQUEADO` |
| `Sprint-B_Audit` | **Quality Gate 1: Certificación Backend** | 1 al 24 | 10 Tablas Integradas | `BLOQUEADO` |

---

### 🎨 Pista Frontend (14 Sprints + Gate 2)
| ID Sprint | Título | Pantallas | Componentes Clave | Estado |
| :---: | :--- | :---: | :--- | :---: |
| `Sprint-F01` | Setup UI, Design Tokens y Shell | Shell Global | `ShellComponent`, `HeaderComponent`, `FooterComponent` | `BLOQUEADO` |
| `Sprint-F02` | Auth, Login y Registro Empresa | `P-06`, `P-07` | `LoginComponent`, `RegisterCompanyComponent`, `AuthService` | `BLOQUEADO` |
| `Sprint-F03` | Portal de Inicio y Categorías | `P-01`, `P-02` | `HomeComponent`, `CategoriesComponent` | `BLOQUEADO` |
| `Sprint-F04` | Catálogo B2B y Búsqueda Reactiva | `P-03` | `CatalogComponent`, `ProductCardComponent`, `CatalogStateService` | `BLOQUEADO` |
| `Sprint-F05` | Ficha Detalle y Contacto Proveedor | `P-04`, `P-05` | `ProductDetailComponent`, `ProviderContactModalComponent` | `BLOQUEADO` |
| `Sprint-F06` | Carrito Reactivo y Agrupación | `P-09` | `CartComponent`, `CartGroupItemComponent`, `CartService` | `BLOQUEADO` |
| `Sprint-F07` | Asistente de Checkout en 3 Pasos | `P-10`, `P-11`, `P-12` | `CheckoutWizardComponent`, `BillingStep`, `ReviewStep` | `BLOQUEADO` |
| `Sprint-F08` | Visor de Factura y Comprobantes | `P-13` | `InvoiceViewerComponent` (Estilos `@media print`) | `BLOQUEADO` |
| `Sprint-F09` | Mis Compras y Detalle de Pedido | `P-14`, `P-15` | `MyOrdersComponent`, `OrderDetailComponent` | `BLOQUEADO` |
| `Sprint-F10` | Mi Cuenta, Seguridad y Activación | `P-16`, `P-17`, `P-18` | `ProfileComponent`, `ChangePassword`, `ActivateProvider` | `BLOQUEADO` |
| `Sprint-F11` | Dashboard Proveedor y Perfil | `P-19`, `P-26` | `ProviderDashboardComponent`, `ProviderCompanyProfile` | `BLOQUEADO` |
| `Sprint-F12` | CRUD de Catálogo del Proveedor | `P-20` a `P-23` | `ProviderProductsComponent`, `ProductFormComponent` | `BLOQUEADO` |
| `Sprint-F13` | Ventas Recibidas y Despacho | `P-24`, `P-25` | `ProviderSalesComponent`, `ProviderSaleDetailComponent` | `BLOQUEADO` |
| `Sprint-F14` | Páginas de Error y Rutas | `P-36`, `P-37` | `AccessDeniedComponent`, `NotFoundComponent` | `BLOQUEADO` |
| `Sprint-F_Audit` | **Quality Gate 2: Certificación Frontend** | 27 Pantallas | Suite completa UI contra Prism Mock | `BLOQUEADO` |

---

### 🔌 Pista de Cierre e Integración Final
| ID Sprint | Título | Entregable Clave | Dependencia | Estado |
| :---: | :--- | :--- | :---: | :---: |
| `Sprint-G_Final` | Integración E2E y Release Final | Unión Front Real + Back Real sin Mocks, smoke tests cruzados. | `Gate 1` + `Gate 2` | `BLOQUEADO` |
| `AUDITORIA_FINAL` | **Acta de Certificación Definitiva** | Validación 0 rojos para pase a Fase 04/05. | `Sprint-G_Final` | `BLOQUEADO` |
