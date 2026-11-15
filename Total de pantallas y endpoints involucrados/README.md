# Total de Pantallas y Endpoints Involucrados — COMPUNEX B2B

Documento de referencia para coordinación entre frontend (`compunex-frontend`) y backend (`compunex-backend`).  
Base API configurada en [`environment.ts`](../compunex-frontend/src/environments/environment.ts): `http://localhost:8080/api/v1` (`useMock: false`).

---

## 1. Mapa de Pantallas Existentes vs Endpoints

### A. Zona Pública y Catálogo (`PublicLayoutComponent`)

| Pantalla | Ruta(s) | Acceso / Guard | Componente Principal | Endpoints Backend Involucrados | Notas para mejora |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Inicio / Portada** | `/` | Público | `HomeViewComponent` (`features/home/home-view.component.ts`) | *Ninguno (datos estáticos de muestra)* | Los productos/categorías/proveedores de la portada son estáticos; opcionalmente conectar con `GET /products` y `GET /categories`. |
| **Categorías** | `/categories` *(alias `/categorias`)* | Público | `CategoriesComponent` (`features/categories/categories.component.ts`) | `GET /api/v1/categories` | Carga categorías y subcategorías reales. |
| **Catálogo B2B** | `/catalog` *(alias `/catalogo`)* | Público | `CatalogComponent` (`features/catalog/catalog.component.ts`) | `GET /api/v1/categories`<br>`GET /api/v1/products?search=&categoryId=&page=&size=` | Precio min/max, solo con stock y ordenamiento (`sort`) se filtran actualmente en frontend sobre la página recibida. |
| **Detalle de Producto** | `/catalog/:id`, `/productos/:id` | Público | `ProductDetailComponent` (`features/product-detail/product-detail.component.ts`)<br>+ `ProductContactModalComponent` | `GET /api/v1/products/{id}` | El modal de contacto/cotización (`ProductContactModalComponent`) aún simula envío local; no existe endpoint de mensajería/cotización en backend. |
| **Carrito B2B** | `/carrito` *(alias `/cart`)* | Público | `CartComponent` (`features/cart/cart.component.ts`)<br>+ `CartGroupItemComponent` | *Ninguno (estado local en `CartStateService` / `localStorage`)* | Agrupa ítems por proveedor y calcula IGV 18% en memoria antes del checkout. |
| **Términos y Privacidad** | `/terminos`, `/privacidad` | Público | `LegalViewComponent` (`features/legal/legal-view.component.ts`) | *Ninguno (contenido informativo estático)* | Texto legal básico; editable según requerimientos del curso. |

---

### B. Autenticación y Pantallas de Error (`PublicLayoutComponent`)

| Pantalla | Ruta(s) | Acceso / Guard | Componente Principal | Endpoints Backend Involucrados | Notas para mejora |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Iniciar Sesión** | `/auth/login` | Público | `LoginComponent` (`features/auth/login/login.component.ts`) | `POST /api/v1/auth/login`<br>`GET /api/v1/auth/me`<br>`GET /api/v1/providers/me/profile` *(si el rol es `ROLE_PROVEEDOR`)* | No existe endpoint de recuperación de contraseña en backend; actualmente muestra aviso de soporte. |
| **Registrar Empresa Compradora** | `/auth/registro-empresa` | Público | `RegisterCompanyComponent` (`features/auth/register-company/register-company.component.ts`) | `POST /api/v1/auth/register-company` | Registra cuentas con rol `CLIENTE`. El endpoint `POST /api/v1/auth/register` (registro directo de proveedor) existe en backend pero no tiene formulario separado en frontend (se usa activación desde cuenta). |
| **Acceso Denegado (403)** | `/forbidden` *(alias `/403`)* | Público | `ForbiddenViewComponent` (`features/forbidden/forbidden-view.component.ts`) | *Ninguno* | Destino cuando `roleGuard` rechaza acceso a `/panel`. |
| **No Encontrado (404)** | `/404`, `**` | Público | `NotFoundViewComponent` (`features/not-found/not-found-view.component.ts`) | *Ninguno* | Ruta fallback global. |

---

### C. Flujo de Compra, Órdenes y Cuenta Corporativa (`PublicLayoutComponent` + `authGuard`)

| Pantalla | Ruta(s) | Acceso / Guard | Componente Principal | Endpoints Backend Involucrados | Notas para mejora |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Checkout Paso 1: Facturación** | `/checkout/datos-facturacion` *(alias `/checkout`)* | Autenticado (`authGuard`) | `CheckoutWizardComponent` + `BillingStepComponent` | *Ninguno (precarga desde `AuthStateService.currentUser()`)* | Valida RUC, razón social, dirección y método de pago antes de pasar al paso 2. |
| **Checkout Paso 2: Revisión Split Order** | `/checkout/revision` | Autenticado (`authGuard`) | `CheckoutWizardComponent` + `ReviewStepComponent` | `POST /api/v1/orders/checkout` | Descuenta stock, prohíbe auto-compra (`AutoCompraException`) y divide la orden en subórdenes por proveedor. |
| **Checkout Paso 3: Confirmación** | `/checkout/confirmacion` | Autenticado (`authGuard`) | `CheckoutWizardComponent` + `ConfirmationStepComponent` | *Ninguno (lee el `CheckoutResponse` del paso 2)* | Muestra código de orden y enlaces a los comprobantes. |
| **Visor de Factura / Comprobante** | `/pedidos/:id/comprobante` *(alias `/comprobantes/:id`)* | Autenticado (`authGuard`) | `InvoiceViewerComponent` (`features/invoices/invoice-viewer.component.ts`) | `GET /api/v1/orders/me/{ordenId}` | Muestra comprobantes simulados por suborden y soporta impresión. |
| **Historial de Mis Compras** | `/cuenta/mis-compras` | Autenticado (`authGuard`) | `MyOrdersComponent` (`features/orders/my-orders/my-orders.component.ts`) | `GET /api/v1/orders/me?page=&size=` | `OrdenResumenDTO` en backend aún no devuelve `estado`, por eso el listado no muestra badge de estado general. |
| **Detalle de Orden y Trazabilidad** | `/cuenta/mis-compras/:id` | Autenticado (`authGuard`) | `OrderDetailComponent` (`features/orders/order-detail/order-detail.component.ts`) | `GET /api/v1/orders/me/{ordenId}` | Sí muestra estado por suborden y estado general derivado de las subórdenes. |
| **Mi Cuenta y Perfil** | `/cuenta/perfil` *(alias `/cuenta`)* | Autenticado (`authGuard`) | `ProfileComponent` (`features/account/profile/profile.component.ts`) | `GET /api/v1/auth/me`<br>`GET /api/v1/providers/me/profile` *(si es proveedor)* | La edición de perfil (`updateProfile`) actualmente solo actualiza `localStorage`; falta endpoint `PUT/PATCH` en backend para persistir cambios de usuario comprador. |
| **Seguridad / Cambiar Contraseña** | `/cuenta/seguridad` | Autenticado (`authGuard`) | `ChangePasswordComponent` (`features/account/security/change-password.component.ts`) | `PATCH /api/v1/auth/password` | Actualiza contraseña validando la actual. |
| **Activar Perfil Proveedor** | `/cuenta/activar-proveedor` | Autenticado (`authGuard`) | `ActivateProviderComponent` (`features/account/activate-provider/activate-provider.component.ts`) | `POST /api/v1/providers/me/activate` | Promueve la cuenta `CLIENTE` a `ROLE_PROVEEDOR` y devuelve nuevo JWT. |

---

### D. Panel del Proveedor (`PanelLayoutComponent` + `roleGuard(['ROLE_PROVEEDOR', 'ROLE_ADMIN'])`)

| Pantalla | Ruta(s) | Acceso / Guard | Componente Principal | Endpoints Backend Involucrados | Notas para mejora |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dashboard Proveedor** | `/panel/dashboard` *(alias `/panel`, `/proveedor`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderDashboardComponent` + `ProviderKpiCardsComponent` + `ProviderRecentSalesComponent` | `GET /api/v1/providers/me/products?page=0&size=100`<br>`GET /api/v1/providers/me/sales?page=0&size=100`<br>`GET /api/v1/providers/me/sales?page=0&size=5` | Las métricas KPI se calculan en frontend agregando productos y ventas; se puede crear un endpoint dedicado de métricas si crece el volumen. |
| **Perfil Comercial y Branding** | `/panel/profile` *(alias `/panel/perfil-comercial`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderCompanyProfileComponent` (`features/provider/company-profile/provider-company-profile.component.ts`) | `GET /api/v1/providers/me/profile`<br>`POST /api/v1/media/upload` *(folder=`profiles`)*<br>`POST /api/v1/providers/me/activate` *(para guardar cambios)* | **Mejora clave:** `ActivarProveedorRequestDTO` no guarda `urlLogo` ni `urlBanner` en BD y falta un `PUT /api/v1/providers/me/profile` dedicado. |
| **Mis Productos (Listado)** | `/panel/products` *(alias `/panel/productos`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderProductsListComponent` + `ProductFilterBarComponent` + `ProductTableComponent` + `PaginationBarComponent` | `GET /api/v1/providers/me/products?page=0&size=10`<br>`PATCH /api/v1/providers/me/products/{id}/status`<br>`DELETE /api/v1/providers/me/products/{id}` | Paginación local de tabla (8 por página) y filtro client-side sobre la respuesta. |
| **Publicar Nuevo Producto** | `/panel/products/new` *(alias `/panel/productos/nuevo`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderProductFormComponent` + `ProductImageUploaderComponent` + `ProductPricingCalcComponent` | `GET /api/v1/categories`<br>`POST /api/v1/media/upload` *(folder=`products`)*<br>`POST /api/v1/providers/me/products` | El stock inicial se envía como especificación (`Stock Referencial`) porque `CrearProductoRequestDTO` no recibe campo numérico `stockDisponible`. |
| **Editar Producto** | `/panel/products/:id/edit` *(alias `/panel/productos/:id/editar`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderProductFormComponent` | `GET /api/v1/categories`<br>`GET /api/v1/providers/me/products/{id}`<br>`POST /api/v1/media/upload`<br>`PUT /api/v1/providers/me/products/{id}` | Misma consideración de stock y specs que en creación. |
| **Ficha de Producto (Proveedor)** | `/panel/products/:id` *(alias `/panel/productos/:id`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderProductDetailComponent` + `ProductMetricBadgesComponent` | `GET /api/v1/providers/me/products/{id}` | Vista interna de detalle y métricas del producto. |
| **Ventas Recibidas** | `/panel/sales` *(alias `/panel/ventas`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderSalesListComponent` + `SalesFilterTabsComponent` + `SalesTableComponent` + `PaginationBarComponent` | `GET /api/v1/providers/me/sales?page=0&size=10` | Lista subórdenes recibidas con filtro por estado y paginación. |
| **Detalle y Atención de Despacho** | `/panel/sales/:id` *(alias `/panel/ventas/:id`)* | `ROLE_PROVEEDOR` / `ROLE_ADMIN` | `ProviderSaleDetailComponent` + `DispatchStepperComponent` + `SaleClientCardComponent` | `GET /api/v1/providers/me/sales/{subordenId}`<br>`PATCH /api/v1/providers/me/sales/{subordenId}/status` | Transiciones válidas: `PENDIENTE_DESPACHO` → `EN_PREPARACION` / `CANCELADO` → `DESPACHADO` / `CANCELADO` → `ENTREGADO`. |

---

## 2. Resumen de Endpoints del Backend y Oportunidades de Mejora

| Controlador Backend | Endpoints | Estado en Frontend |
| :--- | :--- | :--- |
| `AuthController` (`/api/v1/auth`) | `POST /login`, `GET /me`, `PATCH /password`, `POST /register-company`, `POST /register` | Todos integrados excepto `POST /register` (se usa `register-company` + `providers/me/activate`). Falta recuperación de clave y edición de perfil de usuario. |
| `CategoriaController` (`/api/v1/categories`) | `GET /categories`, `GET /categories/{id}` | `GET /categories` integrado; `GET /categories/{id}` disponible si se quiere vista detalle de categoría. |
| `ProductoPublicoController` (`/api/v1/products`) | `GET /products`, `GET /products/{id}` | Integrados en Catálogo y Detalle de Producto. |
| `ProductoProveedorController` (`/api/v1/providers/me/products`) | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `PATCH /{id}/status`, `DELETE /{id}` | Todos integrados en el panel de proveedor. |
| `AdminProductoController` (`/api/v1/admin/products`) | `GET /admin/products`, `PATCH /admin/products/{id}/status` | **Sin pantalla en frontend** (`CatalogApiService` tiene métodos base, pero no existe módulo/vista Admin en `app.routes.ts`). |
| `ProviderProfileController` (`/api/v1/providers`) | `GET /me/profile`, `POST /me/activate` | Integrados; falta `PUT /me/profile` con `urlLogo` y `urlBanner` persistentes. |
| `OrderController` (`/api/v1/orders`) | `POST /checkout`, `GET /me`, `GET /me/{ordenId}` | Todos integrados; recomendable añadir `estado` en `OrdenResumenDTO` (`GET /orders/me`). |
| `ProviderSalesController` (`/api/v1/providers/me/sales`) | `GET`, `GET /{subordenId}`, `PATCH /{subordenId}/status` | Todos integrados. |
| `MediaController` (`/api/v1/media`) | `POST /upload`, `GET /files/{folder}/{filename}` | Integrados en subida de productos y perfil comercial. |
