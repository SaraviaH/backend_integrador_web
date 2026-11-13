# BACKLOG_FRONTEND.md — Backlog Detallado del Track Frontend (Angular 18 Standalone)

> **Área Técnica:** Frontend, UI/UX & Cliente  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Línea Base:** Angular 18 (Standalone Components, Signals, Reactive Forms, Tailwind CSS, SASS)  
> **Total Pantallas MVP:** 27 pantallas (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`)  
> **Total Sprints Frontend:** 14 sprints técnicos + 1 Quality Gate (`Sprint-F_Audit`)  
> **Estrategia Desacoplada:** Desarrollo inicial 100% contra Prism Mock Server (`http://localhost:4010`) sobre `compunex-openapi.yaml`

---

## 1. Visión y Estrategia del Track Frontend

El Agente de Frontend construye la interfaz de usuario en 14 sprints granulares y enfocados:
1. **Granularidad y Alta Cohesión:** Máximo 1 a 3 pantallas por sprint para garantizar revisiones visuales rigurosas y cero fatiga de contexto.
2. **Los 4 Estados de Pantalla Obligatorios:** Carga (Skeleton), Vacío (Empty State), Datos (Data UI) y Error (Retry Banner) en cada vista asíncrona.
3. **Gestión Reactiva con Signals:** `signal()`, `computed()` y `effect()` para carrito (`CartService`), sesión (`AuthService`) y filtros de búsqueda.
4. **Accesibilidad WCAG 2.1 AA:** Contraste >= 4.5:1, navegación completa por teclado y etiquetas ARIA.

---

## 2. Mapa de los 14 Sprints de Frontend

| ID Sprint | Título | Pantallas Cubiertas | Componentes Clave | Estado |
| :--- | :--- | :---: | :--- | :---: |
| `Sprint-F01` | Arquitectura por Capas, Reglas SOLID y Tokens SASS | Shell Global | `ShellComponent`, `StoreNavbarComponent`, `PanelSidebarComponent`, `CoreModels` | `PENDIENTE` |
| `Sprint-F02` | Auth, Login y Registro Empresa | `P-06`, `P-07` | `LoginComponent`, `RegisterCompanyComponent`, `AuthService` | `BLOQUEADO` |
| `Sprint-F03` | Portal de Inicio y Categorías | `P-01`, `P-02` | `HomeComponent`, `CategoriesComponent`, `CategoryCardComponent` | `BLOQUEADO` |
| `Sprint-F04` | Catálogo B2B y Búsqueda Reactiva | `P-03` | `CatalogComponent`, `ProductCardComponent`, `CatalogStateService` | `BLOQUEADO` |
| `Sprint-F05` | Ficha Detalle y Contacto Proveedor | `P-04`, `P-05` | `ProductDetailComponent`, `ProviderContactModalComponent` | `BLOQUEADO` |
| `Sprint-F06` | Carrito Reactivo y Agrupación | `P-09` | `CartComponent`, `CartGroupItemComponent`, `CartService` (Signals) | `BLOQUEADO` |
| `Sprint-F07` | Asistente de Checkout en 3 Pasos | `P-10`, `P-11`, `P-12` | `CheckoutWizardComponent`, `BillingStepComponent`, `ReviewStepComponent` | `BLOQUEADO` |
| `Sprint-F08` | Visor de Factura y Comprobantes | `P-13` | `InvoiceViewerComponent` (Estilos `@media print`) | `BLOQUEADO` |
| `Sprint-F09` | Mis Compras y Detalle de Pedido | `P-14`, `P-15` | `MyOrdersComponent`, `OrderDetailComponent` | `BLOQUEADO` |
| `Sprint-F10` | Mi Cuenta, Seguridad y Activación | `P-16`, `P-17`, `P-18` | `ProfileComponent`, `ChangePasswordComponent`, `ActivateProviderComponent` | `BLOQUEADO` |
| `Sprint-F11` | Dashboard Proveedor y Perfil | `P-19`, `P-26` | `ProviderDashboardComponent`, `ProviderCompanyProfileComponent` | `BLOQUEADO` |
| `Sprint-F12` | CRUD de Catálogo del Proveedor | `P-20`, `P-21`, `P-22`, `P-23` | `ProviderProductsComponent`, `ProductFormComponent` (FormArray) | `BLOQUEADO` |
| `Sprint-F13` | Ventas Recibidas y Despacho | `P-24`, `P-25` | `ProviderSalesComponent`, `ProviderSaleDetailComponent` | `BLOQUEADO` |
| `Sprint-F14` | Páginas de Error y Rutas | `P-36`, `P-37` | `AccessDeniedComponent`, `NotFoundComponent` | `BLOQUEADO` |
| `Sprint-F_Audit` | **Quality Gate 2: Certificación Frontend** | 27 Pantallas MVP | Suite completa UI contra Prism Mock | `BLOQUEADO` |

---

## 3. Matriz Exhaustiva de Pantallas vs Sprints

| # Pantalla | Nombre de Pantalla | Sprint | Ruta Angular | Endpoint Consumido (Mock / Real) |
| :---: | :--- | :---: | :--- | :--- |
| `P-01` | Inicio | F03 | `/` | `GET /api/v1/categories`, `GET /api/v1/products` |
| `P-02` | Categorías | F03 | `/categorias` | `GET /api/v1/categories`, `GET /api/v1/categories/{id}` |
| `P-03` | Catálogo y búsqueda | F04 | `/catalogo` | `GET /api/v1/products?search=&categoryId=` |
| `P-04` | Detalle de producto | F05 | `/productos/:id` | `GET /api/v1/products/{id}` |
| `P-05` | Contacto del proveedor | F05 | `/productos/:id/contacto` | `GET /api/v1/products/{id}` |
| `P-06` | Iniciar sesión | F02 | `/auth/login` | `POST /api/v1/auth/login` |
| `P-07` | Registro de empresa | F02 | `/auth/registro-empresa` | `POST /api/v1/auth/register-company` |
| `P-09` | Carrito | F06 | `/carrito` | `CartService` (Signals + LocalStorage) |
| `P-10` | Datos de facturación | F07 | `/checkout/datos-facturacion` | `GET /api/v1/auth/me` |
| `P-11` | Revisión del pedido | F07 | `/checkout/revision` | `CartService` (Agrupación por proveedor) |
| `P-12` | Confirmación de compra | F07 | `/checkout/confirmacion` | `POST /api/v1/orders/checkout` |
| `P-13` | Comprobantes simulados | F08 | `/pedidos/:id/comprobante` | `GET /api/v1/orders/me/{ordenId}` |
| `P-14` | Mis compras | F09 | `/cuenta/mis-compras` | `GET /api/v1/orders/me` |
| `P-15` | Detalle de compra | F09 | `/cuenta/mis-compras/:id` | `GET /api/v1/orders/me/{ordenId}` |
| `P-16` | Mi cuenta | F10 | `/cuenta/perfil` | `GET /api/v1/auth/me` |
| `P-17` | Cambiar contraseña | F10 | `/cuenta/seguridad` | `PATCH /api/v1/auth/password` |
| `P-18` | Activar perfil proveedor | F10 | `/cuenta/activar-proveedor` | `POST /api/v1/providers/me/activate` |
| `P-19` | Panel del proveedor | F11 | `/proveedor/dashboard` | `GET /api/v1/providers/me/sales`, `GET /api/v1/providers/me/products` |
| `P-20` | Mis productos | F12 | `/proveedor/productos` | `GET /api/v1/providers/me/products` |
| `P-21` | Crear producto | F12 | `/proveedor/productos/nuevo` | `POST /api/v1/providers/me/products` |
| `P-22` | Detalle de producto propio | F12 | `/proveedor/productos/:id` | `GET /api/v1/providers/me/products/{id}` |
| `P-23` | Editar producto | F12 | `/proveedor/productos/:id/editar` | `PUT /api/v1/providers/me/products/{id}` |
| `P-24` | Ventas recibidas | F13 | `/proveedor/ventas` | `GET /api/v1/providers/me/sales` |
| `P-25` | Detalle de venta | F13 | `/proveedor/ventas/:id` | `GET /api/v1/providers/me/sales/{subordenId}` |
| `P-26` | Perfil comercial | F11 | `/proveedor/perfil-comercial` | `GET /api/v1/providers/me/profile` |
| `P-36` | Acceso denegado | F14 | `/403` | N/A (Error de Router Guard) |
| `P-37` | Página no encontrada | F14 | `/**` | N/A (Wildcard Router) |
