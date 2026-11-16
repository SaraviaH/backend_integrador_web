# AUDITORÍA FUNCIONAL DEL FRONTEND Y DOCUMENTACIÓN DE IMPLEMENTACIÓN — COMPUNEX B2B

> **Proyecto:** COMPUNEX B2B — Plataforma Mayorista de Hardware  
> **Aplicación Auditada:** `compunex-frontend` (Angular 18.2.0 Standalone + Tailwind CSS 3.4.19)  
> **Fuente de Verdad de API:** Controladores en `compunex-backend` + `documentacion/02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`  
> **Base URL Local:** `http://localhost:8080/api/v1` (`useMock: false` en `src/environments/environment.ts`)  
> **Fecha de Auditoría:** 2026-11-16  

---

## 1. Objetivo y Alcance

Realizar un diagnóstico técnico real y verificable del código fuente actual de `compunex-frontend`, contrastando cada pantalla, componente, formulario, filtro, tabla, botón y servicio contra los endpoints reales implementados en `compunex-backend`.

* **Alcance:** Exclusivamente el frontend (`compunex-frontend`): diseño, interfaz de usuario, navegación, manejo de estado, validaciones, estados de carga/vacío/éxito/error e integración HTTP con el contrato de endpoints vigente.
* **Restricciones respetadas:** No se modificó el backend, la base de datos ni ningún archivo de código; no se proponen endpoints inventados ni datos ficticios. Las funcionalidades sin soporte en el contrato actual quedan documentadas como **Bloqueado por falta de endpoint**.

---

## 2. Arquitectura Actual del Frontend

### 2.1 Estructura de Carpetas (`compunex-frontend/src/app/`)

```text
src/
├── environments/
│   ├── environment.ts              # useMock: false, apiUrl: http://localhost:8080/api/v1
│   └── environment.prod.ts         # apiUrl: https://api.compunex.com/api/v1 (sin fileReplacements en angular.json)
└── app/
    ├── app.config.ts               # HttpClient + authInterceptor + errorInterceptor + Router
    ├── app.routes.ts               # 27 rutas/alias en PublicLayoutComponent y PanelLayoutComponent
    ├── core/
    │   ├── guards/                 # auth.guard.ts, role.guard.ts
    │   ├── interceptors/           # auth.interceptor.ts, error.interceptor.ts
    │   ├── models/                 # api-response, auth, catalog, media, order, provider
    │   ├── services/               # auth-api, catalog-api, media-api, order-api, provider-api
    │   └── state/                  # auth-state, cart-state, catalog-state, checkout-state, home-search, toast-state
    ├── layout/                     # public-layout, store-navbar, panel-layout, panel-sidebar
    ├── shared/components/          # pagination-bar, product-card, status-badge, toast-container
    └── features/
        ├── home/                   # HomeViewComponent (/)
        ├── categories/             # CategoriesComponent (/categories)
        ├── catalog/                # CatalogComponent (/catalog)
        ├── product-detail/         # ProductDetailComponent + ProductContactModalComponent
        ├── cart/                   # CartComponent + CartGroupItemComponent
        ├── checkout/               # CheckoutWizardComponent + billing-step, review-step, confirmation-step
        ├── invoices/               # InvoiceViewerComponent
        ├── orders/                 # MyOrdersComponent, OrderDetailComponent
        ├── auth/                   # LoginComponent, RegisterCompanyComponent
        ├── account/                # ProfileComponent, ChangePasswordComponent, ActivateProviderComponent
        ├── provider/               # dashboard, company-profile, products (list/form/detail), sales (list/detail)
        ├── legal/                  # LegalViewComponent (/terminos, /privacidad)
        ├── forbidden/              # ForbiddenViewComponent (/forbidden, /403)
        └── not-found/              # NotFoundViewComponent (/404, **)
```

### 2.2 Hallazgos Transversales en Servicios, Guards e Interceptores

| Elemento | Archivo | Comportamiento Real Verificado | Hallazgo / Problema |
| :--- | :--- | :--- | :--- |
| **`AuthInterceptor`** | `core/interceptors/auth.interceptor.ts` | Adjunta `Authorization: Bearer <token>` desde `AuthStateService.token()` en toda petición. | Funcional. |
| **`ErrorInterceptor`** | `core/interceptors/error.interceptor.ts` | Extrae `mensaje`/`detail`/`message`; en `401` (fuera de `/auth/login`) limpia sesión y redirige a `/auth/login`; en `403` redirige a `/forbidden`; en `409` y `5xx` muestra toast. | Funcional, pero `404` no tiene manejo contextual centralizado y cada componente debe manejar su error localmente. |
| **`roleGuard`** | `core/guards/role.guard.ts` | Permite acceso a `/panel` para `['ROLE_PROVEEDOR', 'ROLE_ADMIN']`. | **Inconsistencia:** `AdminProductoController` es `ROLE_ADMIN`, mientras que `/providers/me/**` exige `@PreAuthorize("hasRole('PROVEEDOR')")`. Si un usuario `ROLE_ADMIN` entra a `/panel/dashboard`, las llamadas a `ProviderApiService` retornarán `403` y el interceptor lo expulsará a `/forbidden`. |
| **`AuthApiService.updateProfile`** | `core/services/auth-api.service.ts` | No realiza ninguna llamada HTTP; solo fusiona el objeto en `AuthStateService` (`localStorage`). | **Falta soporte en contrato** para persistir cambios del comprador. |
| **`CatalogApiService`** | `core/services/catalog-api.service.ts` | `getProducts()` filtra `precioMin`, `precioMax`, `soloConStock` y `sort` **en el cliente** sobre la página recibida; asigna `stockDisponible ?? 100`. Además define `createProduct()` (`POST /products`) y `updateProduct()` (`PUT /products/{id}`) hacia rutas que **no existen** en `ProductoPublicoController` (aunque actualmente no los invocan los formularios). | Limpiar métodos huérfanos en `CatalogApiService` y documentar que el filtro/ordenamiento del backend solo soporta `search`, `categoryId`, `page`, `size`. |
| **`ProviderApiService.updateProfile`** | `core/services/provider-api.service.ts` | Cuando `useMock: false`, llama a `POST /providers/me/activate` y luego `GET /providers/me/profile`, conservando `urlLogo` y `urlBanner` **solo en memoria** porque el backend no los persiste. | **Bloqueado parcialmente por falta de endpoint** `PUT /api/v1/providers/me/profile`. |
| **`angular.json`** | `compunex-frontend/angular.json` | La configuración `production` no declara `fileReplacements` para `environment.ts` → `environment.prod.ts`. | **Requiere corrección** en configuración de build de producción. |

---

## 3. Inventario de Páginas y Apartados

| ID | Página / Apartado | Ruta(s) | Guard / Acceso | Componente Principal |
| :-: | :--- | :--- | :--- | :--- |
| **P-01** | Portada / Inicio | `/` | Público | `HomeViewComponent` |
| **P-02** | Explorador de Categorías | `/categories`, `/categorias` | Público | `CategoriesComponent` |
| **P-03** | Catálogo B2B | `/catalog`, `/catalogo` | Público | `CatalogComponent` |
| **P-04** | Detalle de Producto | `/catalog/:id`, `/productos/:id` | Público | `ProductDetailComponent` |
| **P-05** | Modal Contacto Proveedor | *(Modal en P-04)* | Público | `ProductContactModalComponent` |
| **P-06** | Iniciar Sesión | `/auth/login` | Público | `LoginComponent` |
| **P-07** | Registrar Empresa Compradora | `/auth/registro-empresa` | Público | `RegisterCompanyComponent` |
| **P-08** | Navbar y Layouts | *(Shells globales)* | Público / Panel | `StoreNavbarComponent`, `PanelSidebarComponent` |
| **P-09** | Carrito B2B | `/carrito`, `/cart` | Público | `CartComponent` |
| **P-10** | Checkout Paso 1: Facturación | `/checkout/datos-facturacion`, `/checkout` | `authGuard` | `CheckoutWizardComponent` + `BillingStepComponent` |
| **P-11** | Checkout Paso 2: Revisión | `/checkout/revision` | `authGuard` | `CheckoutWizardComponent` + `ReviewStepComponent` |
| **P-12** | Checkout Paso 3: Confirmación | `/checkout/confirmacion` | `authGuard` | `CheckoutWizardComponent` + `ConfirmationStepComponent` |
| **P-13** | Visor de Factura / Comprobante | `/pedidos/:id/comprobante`, `/comprobantes/:id` | `authGuard` | `InvoiceViewerComponent` |
| **P-14** | Mis Órdenes de Compra | `/cuenta/mis-compras` | `authGuard` | `MyOrdersComponent` |
| **P-15** | Detalle de Orden y Trazabilidad | `/cuenta/mis-compras/:id` | `authGuard` | `OrderDetailComponent` |
| **P-16** | Mi Cuenta y Perfil Corporativo | `/cuenta/perfil`, `/cuenta` | `authGuard` | `ProfileComponent` |
| **P-17** | Seguridad y Contraseña | `/cuenta/seguridad` | `authGuard` | `ChangePasswordComponent` |
| **P-18** | Activar Perfil Proveedor | `/cuenta/activar-proveedor` | `authGuard` | `ActivateProviderComponent` |
| **P-19** | Dashboard Proveedor | `/panel/dashboard`, `/panel`, `/proveedor` | `roleGuard` | `ProviderDashboardComponent` |
| **P-20** | Mis Productos (Listado) | `/panel/products`, `/panel/productos` | `roleGuard` | `ProviderProductsListComponent` |
| **P-21** | Publicar Nuevo Producto | `/panel/products/new`, `/panel/productos/nuevo` | `roleGuard` | `ProviderProductFormComponent` |
| **P-22** | Ficha de Producto (Proveedor) | `/panel/products/:id`, `/panel/productos/:id` | `roleGuard` | `ProviderProductDetailComponent` |
| **P-23** | Editar Producto | `/panel/products/:id/edit`, `/panel/productos/:id/editar` | `roleGuard` | `ProviderProductFormComponent` |
| **P-24** | Ventas Recibidas | `/panel/sales`, `/panel/ventas` | `roleGuard` | `ProviderSalesListComponent` |
| **P-25** | Detalle y Atención de Despacho | `/panel/sales/:id`, `/panel/ventas/:id` | `roleGuard` | `ProviderSaleDetailComponent` |
| **P-26** | Perfil Comercial y Branding | `/panel/profile`, `/panel/perfil-comercial` | `roleGuard` | `ProviderCompanyProfileComponent` |
| **P-27** | Legales y Páginas de Error | `/terminos`, `/privacidad`, `/forbidden`, `/404`, `**` | Público | `LegalViewComponent`, `ForbiddenViewComponent`, `NotFoundViewComponent` |

---

## 4. Auditoría Individual de Cada Página y Apartado

### P-01 · Portada / Inicio (`/` — `HomeViewComponent`)

* **A. Estado actual:**
  * Renderiza carrusel hero, sección de 6 categorías, sección "Comunidad" (proveedores y novedades), sección "Cómo funciona", "Productos destacados" y banner "¿Quieres vender?".
  * **Problema crítico:** Casi todo el contenido es **estático/ficticio** y no navega a las rutas reales existentes:
    * Categorías hardcoded (`categories[]`) en `<article>` sin enlace a `/catalog?categoryId=...`.
    * Etiquetas `"Catálogo próximamente"`, `"Contenido de muestra"`, `"Productos de ejemplo"`, `"Ficha próximamente"` y `"Registro de proveedores próximamente →"` en texto plano sin enlace, a pesar de que `/categories`, `/catalog`, `/catalog/:id` y `/cuenta/activar-proveedor` ya existen.
    * `providers[]` (`AndesTech Mayorista`, etc.) y `communityPosts[]` son datos ficticios sin endpoint en backend.
    * `featuredProducts[]` son 4 productos hardcoded que solo se filtran localmente con `HomeSearchService`.
* **B. Funcionalidades necesarias:**
  * Cargar categorías reales desde el backend y enlazar cada tarjeta a `/catalog?categoryId={id}`.
  * Cargar productos destacados reales (`size=4` o `8`) desde el backend y enlazar cada tarjeta a `/catalog/{id}` usando `ProductCardComponent` o navegación real + botón "Agregar al carrito".
  * Enlazar el CTA de "¿Quieres vender?" a `/cuenta/activar-proveedor` (si autenticado) o `/auth/registro-empresa` (si visitante).
  * Eliminar los bloques de datos ficticios (`providers[]` y `communityPosts[]`) o reemplazarlos por información institucional real de la plataforma sin inventar empresas/publicaciones.
* **C. Integración:**
  * `GET /api/v1/categories` (categorías reales).
  * `GET /api/v1/products?page=0&size=8` (productos reales para destacados).
  * Manejo de estados de carga (skeletons), vacío y error con reintento.
* **D. Resultado esperado:** La portada deja de ser un mockup estático; muestra categorías y productos reales desde PostgreSQL, y cada botón/tarjeta navega a los flujos operativos reales.

---

### P-02 · Explorador de Categorías (`/categories` — `CategoriesComponent`)

* **A. Estado actual:**
  * Consume `GET /api/v1/categories` mediante `CatalogApiService.getCategories()`.
  * Implementa los 4 estados UI (carga, error, vacío, datos) y filtro local por texto.
  * **Problema detectado:** Renderiza `cat.subcategorias`, pero `GET /api/v1/categories` (`CategoriaResponseDTO`) **no devuelve** `subcategorias` (solo `GET /api/v1/categories/{id}` devuelve `subcategorias[]`). Además, cuando el usuario hace clic en una subcategoría envía `?categoriaId=...&subcategoria=...`, parámetro que `CatalogComponent` y el backend ignoran.
* **B. Funcionalidades necesarias:**
  * Mantener el listado de categorías reales con su contador `totalProductos` y enlace directo a `/catalog?categoryId={cat.id}`.
  * Si se desean mostrar subcategorías, consultar `GET /api/v1/categories/{id}` bajo demanda (o quitar la sección muerta si el catálogo público no filtra por subcategoría).
* **C. Integración:** `GET /api/v1/categories` (y opcionalmente `GET /api/v1/categories/{id}`).
* **D. Resultado esperado:** Listado limpio de categorías reales con enlaces consistentes usando `?categoryId={id}`.

---

### P-03 · Catálogo B2B (`/catalog` — `CatalogComponent`)

* **A. Estado actual:**
  * Conectado a `GET /api/v1/categories` y `GET /api/v1/products?search=&categoryId=&page=&size=`.
  * Implementa debounce de 300 ms en búsqueda, chips de filtros activos, paginación y botón "Agregar al carrito".
  * **Problemas detectados:**
    1. Los filtros laterales **Rango de Precio (min/max)**, **Solo con stock** y **Ordenar por (`sort`)** se aplican **solo en memoria** sobre la página actual (`CatalogApiService.getProducts` líneas 114–129), lo que produce resultados engañosos cuando hay más de una página.
    2. `ProductoPublicoItemDTO` del backend no siempre incluye `stockDisponible` (y `CatalogApiService` le asigna `?? 100` ficticio).
    3. Al navegar desde `NotFoundViewComponent`, este envía `?q=...`, mientras que `CatalogComponent` sincroniza `?search=...` (aunque lee `params['search'] || params['q']`, al limpiar/paginar escribe `search`).
* **B. Funcionalidades necesarias:**
  * Mantener búsqueda (`search`), categoría (`categoryId`) y paginación (`page`, `size`) 100% respaldadas por el backend.
  * Documentar/ajustar la UI de filtros locales (precio/stock/sort) para no simular filtrado global del catálogo si el endpoint `GET /api/v1/products` solo acepta `search`, `categoryId`, `page`, `size`.
  * Eliminar el fallback `stockDisponible ?? 100` en `CatalogApiService` cuando el backend no envíe ese campo.
* **C. Integración:** `GET /api/v1/products?search=&categoryId=&page=&size=` y `GET /api/v1/categories`.
* **D. Resultado esperado:** Catálogo B2B fiel a los datos del servidor, sin valores de stock inventados ni filtros parciales engañosos.

---

### P-04 y P-05 · Detalle de Producto y Modal de Contacto (`/catalog/:id` — `ProductDetailComponent` + `ProductContactModalComponent`)

* **A. Estado actual:**
  * `ProductDetailComponent` consulta `GET /api/v1/products/{id}` y muestra galería, precio, especificaciones técnicas, datos del proveedor, relacionados (`getFeaturedProducts()`) y selector de cantidad para agregar al carrito.
  * **Problemas detectados:**
    1. `CatalogApiService.getProductDetail()` asigna `stockDisponible: d.stockDisponible ?? 100` (valor ficticio si no viene del backend).
    2. `ProductContactModalComponent` (`P-05`) tiene un formulario completo que en `onSubmit()` ejecuta un **`setTimeout(..., 700)` simulado** y muestra "¡Solicitud de Contacto Enviada!" sin enviar nada a ningún servidor.
    3. El modal muestra `"★ 4.9 Calificación"` hardcoded (`product.proveedorCalificacion || '4.9'`), dato que no existe en `ProductoPublicoDetalleDTO`.
* **B. Funcionalidades necesarias:**
  * Mostrar información real del producto y proveedor sin calificaciones ni stocks inventados.
  * Enlazar o deshabilitar el flujo de contacto directo según disponibilidad real: como no existe endpoint de mensajería/cotizaciones en el backend, **no debe simular envío exitoso**. Mostrar canales reales de contacto del proveedor (`correoContacto`, `telefonoContacto` que sí devuelve `GET /api/v1/products/{id}`, ej. `mailto:` / `tel:`) o marcar el envío de formulario como bloqueado por falta de endpoint.
* **C. Integración:** `GET /api/v1/products/{id}`. Modal de formulario: **Bloqueado por falta de endpoint**.
* **D. Resultado esperado:** Ficha técnica 100% real; sin respuestas simuladas en el modal de contacto.

---

### P-06 · Iniciar Sesión (`/auth/login` — `LoginComponent`)

* **A. Estado actual:**
  * Conectado a `POST /api/v1/auth/login`, seguido de `GET /api/v1/auth/me` (y `GET /api/v1/providers/me/profile` si es `ROLE_PROVEEDOR`).
  * Valida correo y contraseña (mín. 6 caracteres), muestra errores HTTP y redirige a `returnUrl` o `/`.
  * **Problemas detectados:**
    * El checkbox `"Recordar mi sesión en este equipo"` (`recordarSesion`) no altera el almacenamiento (siempre persiste en `localStorage`).
    * El botón `"¿Olvidaste tu contraseña?"` muestra un aviso de que no hay recuperación automática (limitación del backend: no existe endpoint de recuperación).
* **B. Funcionalidades necesarias:** Login real, redirección por `returnUrl`, toggle de visibilidad de contraseña y manejo de errores `401`.
* **C. Integración:** `POST /api/v1/auth/login`, `GET /api/v1/auth/me`, `GET /api/v1/providers/me/profile`.
* **D. Resultado esperado:** Autenticación funcional con JWT persistido y perfil hidratado desde el servidor.

---

### P-07 · Registrar Empresa Compradora (`/auth/registro-empresa` — `RegisterCompanyComponent`)

* **A. Estado actual:**
  * Conectado a `POST /api/v1/auth/register-company`. Valida RUC (11 dígitos), razón social, nombre, correo, teléfono, contraseña y confirmación, y términos.
  * **Problemas detectados:**
    1. `AuthApiService.registerCompany()` envía `direccionFiscal: data.direccion`, pero el formulario de `RegisterCompanyComponent` **no tiene campo `direccion`**, por lo que siempre envía `undefined`.
    2. `RegistroEmpresaRequestDTO` en `CONTRATOS_JSON.md` requiere `nombre`, `correo`, `contrasena`, `ruc`, `razonSocial` (verificar si `direccionFiscal` y `telefono` son opcionales o requeridos en el DTO Java real).
    3. Al registrarse redirige a `/auth/login` en lugar de aprovechar el `token` que devuelve `POST /api/v1/auth/register-company` (comportamiento aceptable si es intencional, pero debe ser claro).
* **B. Funcionalidades necesarias:** Agregar campo de dirección fiscal opcional/requerido si se desea precargar luego en checkout, y alinear el payload exacto con `RegistroEmpresaRequestDTO`.
* **C. Integración:** `POST /api/v1/auth/register-company`.
* **D. Resultado esperado:** Registro corporativo completo con validación inline y feedback de errores (`400`/`409`).

---

### P-08 · Navbar y Navegación (`StoreNavbarComponent` y `PanelSidebarComponent`)

* **A. Estado actual:**
  * `StoreNavbarComponent`: buscador conectado a `/catalog?search=...`, contador del carrito en tiempo real, botones condicionales por autenticación/rol y menú móvil.
  * **Problemas detectados:**
    * En `StoreNavbarComponent`, cuando el usuario **no** está autenticado, muestra enlaces a `#comunidad`, `#productos` y `#como-funciona`, alineados con las secciones estáticas de `HomeViewComponent`.
    * `PanelSidebarComponent` muestra `RUC: {{ authState.currentUser()?.ruc || '20601234567' }}` (RUC ficticio por defecto si no está cargado) y permite acceso a `ROLE_ADMIN` aunque las rutas del panel consumen `/providers/me/**`.
* **B. Funcionalidades necesarias:** Eliminar RUCs/valores fallback ficticios en el sidebar y ajustar enlaces del navbar según la refactorización de `HomeViewComponent`.
* **C. Integración:** `AuthStateService`, `CartStateService`.
* **D. Resultado esperado:** Navegación coherente sin valores quemados de ejemplo.

---

### P-09 · Carrito B2B (`/carrito` — `CartComponent` + `CartGroupItemComponent`)

* **A. Estado actual:**
  * Agrupa ítems por `proveedorId` en `CartStateService` (`localStorage`), calcula subtotal, IGV 18% y total por proveedor y consolidado.
  * **Problemas detectados:**
    * El botón principal muestra texto técnico interno: `"Continuar al Checkout (P-10)"`.
    * Usa confirmación nativa (`showClearConfirm`) y valida cantidades en memoria contra `stockDisponible` (que podía venir con `?? 100` desde `CatalogApiService`).
* **B. Funcionalidades necesarias:** Remover etiquetas internas `(P-10)` de la UI visible y validar que las cantidades sean enteros positivos (`>= 1`).
* **C. Integración:** Estado local en `CartStateService` previo a `POST /api/v1/orders/checkout`.
* **D. Resultado esperado:** Carrito multi-proveedor limpio, sin códigos internos en botones.

---

### P-10, P-11 y P-12 · Checkout Wizard (3 Pasos) (`/checkout/*`)

* **A. Estado actual:**
  * **Paso 1 (`BillingStepComponent`):** Precarga RUC, razón social, dirección, departamento, contacto y método de pago desde `AuthStateService.currentUser()`.
  * **Paso 2 (`ReviewStepComponent`):** Mapea métodos de pago (`TRANSFERENCIA_BANCARIA` → `TRANSFERENCIA_B2B`, `TARJETA_EMPRESARIAL` → `TARJETA_CORPORATIVA`, `LINEA_CREDITO_B2B` → `LINEA_CREDITO_B2B`) y llama a `POST /api/v1/orders/checkout`.
  * **Paso 3 (`ConfirmationStepComponent`):** Muestra `codigoOrden`, subórdenes y enlaces a comprobantes.
  * **Problemas detectados:**
    * En Paso 1 (`BillingStepComponent`), los campos `departamento`, `contactoNombre`, `contactoTelefono`, `contactoCorreo` y `notasPedido` **no se envían** al backend porque `CheckoutRequestDTO` solo recibe `datosFacturacion` (`tipoComprobante`, `rucReceptor`, `razonSocialReceptor`, `direccionFiscal`, `metodoPagoSimulado`) e `items`.
    * Etiquetas internas expuestas en UI: `"Confirmar Compra y Generar Órdenes B2B (P-12)"` en `ReviewStepComponent` y `"Ver en Mis Compras (P-14)"` en `ConfirmationStepComponent`.
* **B. Funcionalidades necesarias:** Limpiar etiquetas `(P-12)` / `(P-14)`, manejar explícitamente error `400/409` de auto-compra (`AutoCompraException`) o stock insuficiente con mensajes claros, y aclarar en UI qué datos son fiscales enviados a la orden.
* **C. Integración:** `POST /api/v1/orders/checkout`.
* **D. Resultado esperado:** Flujo transaccional Split Order fluido y sin texto de prototipo.

---

### P-13 · Visor de Factura Electrónica (`/pedidos/:id/comprobante` — `InvoiceViewerComponent`)

* **A. Estado actual:**
  * Consume `GET /api/v1/orders/me/{ordenId}`, soporta cambio de pestaña entre subórdenes de distintos proveedores y soporta `window.print()`.
  * **Problemas detectados:**
    * Líneas 150–152: dirección (`Av. Central Industrial 1450`), teléfono (`(01) 680-9900`) y correo (`facturacion@...`) del **emisor** están **hardcoded**, porque `EmisorFacturaDTO` solo devuelve `proveedorId`, `ruc` y `razonSocial`.
    * Línea 223: muestra `PROD-{{ item.productoId }}` en lugar de un SKU real (el DTO de ítem de orden no incluye SKU).
* **B. Funcionalidades necesarias:** No mostrar teléfonos ni direcciones inventadas del emisor si el endpoint no los provee; mostrar los campos reales devueltos por `EmisorFacturaDTO` (`razonSocial`, `ruc`) y `ReceptorFacturaDTO`.
* **C. Integración:** `GET /api/v1/orders/me/{ordenId}`.
* **D. Resultado esperado:** Comprobante imprimible fiel al `CheckoutResponseDTO` real.

---

### P-14 · Mis Órdenes de Compra (`/cuenta/mis-compras` — `MyOrdersComponent`)

* **A. Estado actual:**
  * Consume `GET /api/v1/orders/me?page=0&size=10`.
  * **Problemas detectados:**
    1. **Sin paginación en UI:** `MyOrdersComponent` solo pide la primera página (`page=0, size=10`) y no renderiza `PaginationBarComponent`, por lo que a partir de la orden 11 el usuario no puede ver sus compras anteriores.
    2. **Búsqueda limitada:** `searchFilter` filtra en memoria solo los primeros 10 resultados.
    3. **Estado general ausente:** `OrdenResumenDTO` en backend no devuelve campo `estado` (nota ya conocida).
    4. `title="Ver Comprobante Electrónico (P-13)"` expone código interno.
* **B. Funcionalidades necesarias:** Conectar `PaginationBarComponent` con `getMyOrders(page, size)` usando `totalElements` y `totalPages` del backend; limpiar `(P-13)`.
* **C. Integración:** `GET /api/v1/orders/me?page=&size=`.
* **D. Resultado esperado:** Historial paginado contra el servidor que permita navegar todas las páginas de órdenes.

---

### P-15 · Detalle de Orden y Trazabilidad (`/cuenta/mis-compras/:id` — `OrderDetailComponent`)

* **A. Estado actual:**
  * Consume `GET /api/v1/orders/me/{ordenId}`, deriva estado general en frontend y muestra timeline de 4 hitos por suborden.
  * **Problemas detectados:**
    * Línea 204: texto hardcoded `"Guía: T001-000492"` en el hito 3 ("En Ruta"), dato ficticio que no existe en el backend.
    * Línea 89: botón dice `"Ver Comprobante SUNAT (P-13)"`.
    * Si una suborden está en estado `CANCELADO`, el timeline sigue pintando los hitos normales (el hito 2 aparece en azul `"En Preparación"` si `sub.estado !== 'PENDIENTE_DESPACHO'`? No, `sub.estado === 'CANCELADO'` entraría en `!== 'PENDIENTE_DESPACHO'` y marcaría `"2. En Preparación"` como completado `✓`!).
* **B. Funcionalidades necesarias:**
  * Manejar explícitamente el estado `CANCELADO` en el timeline de cada suborden.
  * Eliminar el número de guía ficticio `"Guía: T001-000492"` y el código `(P-13)`.
* **C. Integración:** `GET /api/v1/orders/me/{ordenId}`.
* **D. Resultado esperado:** Trazabilidad precisa por suborden incluyendo cancelaciones y sin textos ficticios.

---

### P-16 · Mi Cuenta y Perfil Corporativo (`/cuenta/perfil` — `ProfileComponent`)

* **A. Estado actual:**
  * Carga datos desde `GET /api/v1/auth/me` (y `GET /api/v1/providers/me/profile` si es proveedor).
  * **Problemas críticos:**
    1. **Edición simulada en `localStorage`:** Al enviar el formulario, `AuthApiService.updateProfile()` **no llama a ningún endpoint** (no existe `PUT /api/v1/auth/me` ni similar en `AuthController`). Sin embargo, la UI muestra un toast de éxito `"Los datos fiscales de tu empresa han sido guardados"`.
    2. `populateForm()` rellena valores ficticios por defecto (`20601234567`, `Carlos Mendoza`, `cmendoza@ciatecperu.pe`, etc.) si algún campo viene vacío.
    3. Botón dice `"Vender como Proveedor (P-18)"`.
* **B. Funcionalidades necesarias:**
  * Dejar los campos en modo **solo lectura** (o deshabilitar el guardado) mientras no exista endpoint de actualización de usuario comprador en el backend, evitando engañar al usuario con un guardado falso en `localStorage`.
  * Eliminar los valores por defecto ficticios (`Carlos Mendoza`, `ciatecperu.pe`) y el código `(P-18)`.
* **C. Integración:** `GET /api/v1/auth/me` (lectura). **Edición bloqueada por falta de endpoint**.
* **D. Resultado esperado:** Visualización fiel de los datos de sesión reales sin guardado simulado.

---

### P-17 · Seguridad y Contraseña (`/cuenta/seguridad` — `ChangePasswordComponent`)

* **A. Estado actual:**
  * Conectado a `PATCH /api/v1/auth/password`. Valida contraseña actual, nueva contraseña (mín. 8 caracteres) y confirmación.
  * **Problema menor:** En las pestañas superiores de navegación (`ChangePasswordComponent` líneas 45–52) falta el enlace a `"Mi Panel Proveedor"` cuando `authState.isProveedor()` es `true` (a diferencia de `ProfileComponent` que sí lo muestra).
* **B. Funcionalidades necesarias:** Alinear la barra de pestañas con `ProfileComponent` y mostrar mensaje de error específico del backend (`err?.error?.mensaje`) en lugar de un mensaje genérico fijo.
* **C. Integración:** `PATCH /api/v1/auth/password`.
* **D. Resultado esperado:** Cambio de contraseña funcional con feedback exacto del servidor.

---

### P-18 · Activar Perfil Proveedor (`/cuenta/activar-proveedor` — `ActivateProviderComponent`)

* **A. Estado actual:**
  * Conectado a `POST /api/v1/providers/me/activate`. Actualiza el JWT en `AuthStateService.setProviderRole(res.data.token)`.
  * **Problema detectado:** El formulario incluye el campo `categoriaPrincipal` (`Línea Principal de Distribución`), pero no se envía ni se persiste en `ActivarProveedorRequestDTO`.
* **B. Funcionalidades necesarias:** Revisar si `categoriaPrincipal` debe eliminarse o mapearse a `descripcion`/`politicaComercial`, y asegurar que `ruc`, `razonSocial`, `nombreComercial`, `telefonoContacto`, `direccion`, `ciudad` y `descripcion` coincidan con `ActivarProveedorRequestDTO`.
* **C. Integración:** `POST /api/v1/providers/me/activate`.
* **D. Resultado esperado:** Activación de rol `PROVEEDOR` sin campos muertos en el formulario.

---

### P-19 · Dashboard Proveedor (`/panel/dashboard` — `ProviderDashboardComponent`)

* **A. Estado actual:**
  * Calcula métricas KPI agregando en frontend `getMyCatalog(0, 100)` + `getMySales(0, 100)` y vuelve a llamar `getMySales(0, 5)` para ventas recientes.
  * **Problemas detectados:**
    1. **Códigos internos en UI:** `"Perfil de Tienda (P-26)"`, `"Publicar Producto (P-21)"`, `"Mis Productos (P-20)"`, `"Despacho de Ventas (P-24)"`, `"Perfil de Marca (P-26)"`.
    2. **Doble llamada:** `getMySales` se invoca dos veces al cargar el dashboard (una con `size=100` para KPIs y otra con `size=5` para la tabla de recientes), pudiendo reutilizar los primeros 5 ítems de la primera llamada.
    3. **Límite de 100 registros:** Si el proveedor supera 100 productos o 100 ventas, las métricas calculadas en frontend quedarán truncadas (limitación por falta de endpoint `/providers/me/metrics`).
    4. **Acceso `ROLE_ADMIN`:** Si entra un usuario `ADMIN`, las llamadas a `/providers/me/**` fallan con `403`.
* **B. Funcionalidades necesarias:** Eliminar códigos `(P-XX)`, evitar la llamada duplicada a `getMySales(0, 5)` y restringir el acceso del dashboard de proveedor a `ROLE_PROVEEDOR` (o crear vista separada si se requiere Admin).
* **C. Integración:** `GET /api/v1/providers/me/products`, `GET /api/v1/providers/me/sales`.
* **D. Resultado esperado:** Dashboard limpio, sin llamadas duplicadas ni etiquetas internas.

---

### P-20 · Mis Productos (`/panel/products` — `ProviderProductsListComponent`)

* **A. Estado actual:**
  * Conectado a `GET /api/v1/providers/me/products`, `PATCH /api/v1/providers/me/products/{id}/status` y `DELETE /api/v1/providers/me/products/{id}`.
  * **Problemas detectados:**
    1. **Paginación inconsistente:** `loadCatalog()` llama `getMyCatalog()` con valores por defecto (`page=0, size=10`), pero luego pagina en el cliente de a `8` ítems (`pageSize = 8`). Cualquier producto a partir del #11 **nunca se muestra**.
    2. **Pestaña `LOW_STOCK` (`stock <= 5`):** Depende de la especificación `Stock Referencial` (o fallback `100` en `ProviderApiService` línea 214), no de un campo real de inventario.
    3. **Confirmación nativa:** Usa `window.confirm(...)` para eliminar productos.
    4. **Error al cambiar estado/eliminar:** `onToggleProductStatus` y `onDeleteProduct` no manejan el callback `error` para mostrar feedback contextual si falla.
* **B. Funcionalidades necesarias:** Conectar `PaginationBarComponent` y `ProductFilterBarComponent` (búsqueda) directamente a los parámetros `?search=&page=&size=` de `GET /api/v1/providers/me/products`, reemplazando la paginación truncada en cliente; sustituir `confirm()` por modal de confirmación consistente.
* **C. Integración:** `GET /api/v1/providers/me/products`, `PATCH /api/v1/providers/me/products/{id}/status`, `DELETE /api/v1/providers/me/products/{id}`.
* **D. Resultado esperado:** Listado paginado y buscado contra el backend sin límite oculto de 10 productos.

---

### P-21 y P-23 · Publicar y Editar Producto (`/panel/products/new` y `/panel/products/:id/edit` — `ProviderProductFormComponent`)

* **A. Estado actual:**
  * Carga categorías desde `GET /api/v1/categories`, sube imagen con `POST /api/v1/media/upload` (`ProductImageUploaderComponent`) y crea/actualiza con `POST/PUT /api/v1/providers/me/products`.
  * **Problemas detectados:**
    1. **Códigos internos en breadcrumbs:** `'Editar Producto (P-23)'` y `'Nuevo Producto (P-21)'`.
    2. **Errores de codificación UTF-8 en template:** Líneas 229 y 233 muestran `"Automǭtico"` y `"vaco"`.
    3. **Limitación del contrato para stock:** `CrearProductoRequestDTO` no tiene campo `stockDisponible`; el frontend lo guarda dentro de `especificaciones` como `"Stock Referencial"`.
    4. **`updateProduct()` en `ProviderApiService`:** Devuelve `...this.getFallbackProductDetail(id)` mezclado con la respuesta del PUT, lo cual es innecesario cuando `useMock: false`.
* **B. Funcionalidades necesarias:** Corregir texto UTF-8 y quitar `(P-21)`/`(P-23)`; limpiar `updateProduct` de fallbacks mock; validar todos los campos obligatorios con mensajes de error visibles.
* **C. Integración:** `GET /api/v1/categories`, `POST /api/v1/media/upload`, `GET /api/v1/providers/me/products/{id}`, `POST /api/v1/providers/me/products`, `PUT /api/v1/providers/me/products/{id}`.
* **D. Resultado esperado:** Formulario limpio, sin textos corruptos ni datos de fallback en respuestas.

---

### P-22 · Ficha de Producto del Proveedor (`/panel/products/:id` — `ProviderProductDetailComponent`)

* **A. Estado actual:**
  * Conectado a `GET /api/v1/providers/me/products/{id}` y muestra `ProductMetricBadgesComponent` + especificaciones.
  * **Problema detectado:** Título expone `"Ficha Técnica del Producto (P-22)"`.
* **B. Funcionalidades necesarias:** Remover `(P-22)` del título.
* **C. Integración:** `GET /api/v1/providers/me/products/{id}`.
* **D. Resultado esperado:** Ficha interna limpia y coherente.

---

### P-24 · Ventas Recibidas (`/panel/sales` — `ProviderSalesListComponent`)

* **A. Estado actual:**
  * Conectado a `GET /api/v1/providers/me/sales`.
  * **Problema detectado:** Igual que en productos, `loadSales()` llama a `getMySales()` sin argumentos (`page=0, size=10`) y pagina en cliente con `pageSize = 8`. Las ventas a partir de la #11 **no son accesibles**.
* **B. Funcionalidades necesarias:** Conectar la paginación (`page`, `size`) de `ProviderSalesListComponent` directamente con `GET /api/v1/providers/me/sales?page=&size=` usando `totalElements` y `totalPages` del backend.
* **C. Integración:** `GET /api/v1/providers/me/sales?page=&size=`.
* **D. Resultado esperado:** Listado de ventas paginado contra el servidor sin truncamiento.

---

### P-25 · Detalle y Atención de Despacho (`/panel/sales/:id` — `ProviderSaleDetailComponent` + `DispatchStepperComponent`)

* **A. Estado actual:**
  * Conectado a `GET /api/v1/providers/me/sales/{subordenId}` y `PATCH /api/v1/providers/me/sales/{subordenId}/status`.
  * **Problemas detectados:**
    1. `DispatchStepperComponent` no ofrece botón para **Cancelar suborden (`CANCELADO`)** desde `PENDIENTE_DESPACHO` o `EN_PREPARACION`, aunque el backend sí soporta esa transición.
    2. Si una suborden ya está en `CANCELADO`, el `@else` de `DispatchStepperComponent` (línea 52) muestra `"✓ Proceso Completado"`, lo cual es incorrecto.
    3. `onStatusUpdated` en `ProviderSaleDetailComponent` no tiene handler `error` con estado visual/loading mientras se ejecuta el `PATCH`.
* **B. Funcionalidades necesarias:** Agregar soporte visual y acción de cancelación (con confirmación) cuando `estado` es `PENDIENTE_DESPACHO` o `EN_PREPARACION`, manejar estado `CANCELADO` en el stepper y bloquear botones mientras se envía la petición.
* **C. Integración:** `GET /api/v1/providers/me/sales/{subordenId}`, `PATCH /api/v1/providers/me/sales/{subordenId}/status`.
* **D. Resultado esperado:** Control completo de todas las transiciones válidas del backend (`PENDIENTE_DESPACHO` → `EN_PREPARACION` / `CANCELADO` → `DESPACHADO` / `CANCELADO` → `ENTREGADO`).

---

### P-26 · Perfil Comercial y Branding (`/panel/profile` — `ProviderCompanyProfileComponent`)

* **A. Estado actual:**
  * Carga datos desde `GET /api/v1/providers/me/profile` y sube archivos a `POST /api/v1/media/upload` (`folder='profiles'`).
  * **Problemas críticos:**
    1. Para guardar, `ProviderApiService.updateProfile()` invoca `POST /api/v1/providers/me/activate` (endpoint de activación inicial).
    2. **Falta de persistencia de logo y banner:** `ActivarProveedorRequestDTO` no tiene campos `urlLogo` ni `urlBanner`, por lo que las imágenes subidas al servidor **se pierden al recargar la página**.
    3. Los formularios de `ProviderCompanyProfileComponent` no muestran mensajes de validación inline por campo ni controlan adecuadamente el estado cuando `politicaComercial` está disponible.
* **B. Funcionalidades necesarias:**
  * Mantener la subida de archivos a `/api/v1/media/upload`, pero advertir o bloquear la persistencia de `urlLogo`/`urlBanner` mientras el backend no implemente `PUT /api/v1/providers/me/profile` con soporte para ambos campos.
* **C. Integración:** `GET /api/v1/providers/me/profile`, `POST /api/v1/media/upload`. **Persistencia de branding bloqueada por falta de endpoint `PUT /api/v1/providers/me/profile`**.
* **D. Resultado esperado:** Honestidad funcional en la actualización del perfil comercial sin simular persistencia de logo/banner en BD.

---

### P-27 · Legales y Páginas de Error (`/terminos`, `/privacidad`, `/forbidden`, `/404`)

* **A. Estado actual:**
  * `LegalViewComponent`: contenido estático informativo funcional.
  * `ForbiddenViewComponent` (`/403`, `/forbidden`): funcional con enlaces a inicio, login y activación de proveedor.
  * `NotFoundViewComponent` (`/404`, `**`): funcional, aunque su buscador navega a `/catalog?q=...` mientras `CatalogComponent` estandariza `?search=...`.
* **B. Funcionalidades necesarias:** Unificar el query param de `NotFoundViewComponent` a `?search=...`.
* **C. Integración:** Sin endpoints.
* **D. Resultado esperado:** Navegación consistente desde errores hacia el catálogo.

---

## 5. Matriz de Funcionalidades, Endpoints y Seguimiento

| Página / Apartado | Funcionalidad | Estado actual | Endpoint | Trabajo realizado / Pendiente | Criterio de aceptación |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **P-01 Inicio** | Categorías y productos destacados reales | `Implementado y verificado` | `GET /api/v1/categories`<br>`GET /api/v1/products` | Conectado a `GET /categories` y `GET /products?page=0&size=8` con `<app-product-card>`, skeletons, reintento y CTA vendedor por rol; removidos bloques ficticios y `"próximamente"`. | Al cargar `/`, se muestran categorías y productos reales de BD y todas las tarjetas navegan a rutas reales. |
| **P-02 Categorías** | Listado de categorías | `Implementado y verificado` | `GET /api/v1/categories`<br>`GET /api/v1/categories/{id}` | Unificado query param a `?categoryId=` y agregada carga bajo demanda de subcategorías vía `GET /categories/{id}` (`loadSubcategories`). | Categorías cargan desde BD y redirigen correctamente a `/catalog?categoryId=...`. |
| **P-03 Catálogo** | Búsqueda, categoría y paginación | `Implementado y verificado` | `GET /api/v1/products` | Unificado `syncFromQueryParams`, debounce de búsqueda (300ms), `<app-pagination-bar>` y panel de filtros responsive móvil. | Búsqueda, filtro por categoría y cambio de página consultan al backend en una sola ronda. |
| **P-03 Catálogo** | Filtros de precio, stock y ordenamiento | `Implementado y verificado` | `GET /api/v1/products` | Eliminado fallback ficticio `stockDisponible ?? 100` en `CatalogApiService`; acotado explícitamente en UI que orden/rango/stock aplican a los ítems de la página actual. | No hay filtros que simulen filtrado global ni stock inventado en `CatalogApiService`. |
| **P-04 Detalle Producto** | Ficha técnica y agregar al carrito | `Implementado y verificado` | `GET /api/v1/products/{id}` | Removido fallback `stockDisponible ?? 100`, calificación `4.9` y `(P-05)`; ciudad real del proveedor y `@defer (on viewport)` en relacionados. | Ficha muestra exactamente los datos devueltos por el backend. |
| **P-05 Modal Contacto** | Envío de consulta/cotización al proveedor | `Bloqueado por falta de endpoint` | *No existe en backend* | Eliminado `setTimeout` simulado y calificación `4.9`; muestra datos reales (`correoContacto`, `telefonoContacto`, `ciudad`), copia de solicitud al portapapeles, `mailto:` y aviso honesto. | El modal no simula envíos falsos ni muestra calificaciones inexistentes. |
| **P-06 Login** | Autenticación JWT e hidratación de sesión | `Implementado y verificado` | `POST /api/v1/auth/login`<br>`GET /api/v1/auth/me` | Checkbox `recordarSesion` conectado a `localStorage` vs `sessionStorage` en `AuthStateService` y autocompletado por `?email=`. | Login emite JWT, carga perfil real y redirige correctamente. |
| **P-06 Login** | Recuperación de contraseña | `Bloqueado por falta de endpoint` | *No existe en backend* | Mantiene aviso informativo honesto hasta contar con endpoint en backend. | Usuario informado sin formularios rotos. |
| **P-07 Registro Empresa** | Registro de cuenta compradora | `Implementado y verificado` | `POST /api/v1/auth/register-company` | Agregado campo obligatorio `direccion` alineado con `RegistroEmpresaRequestDTO` y control accesible para mostrar/ocultar contraseña. | Registro crea cuenta `CLIENTE` en BD con todos los campos del contrato. |
| **P-08 Navbar / Sidebar** | Navegación y sesión por rol | `Implementado y verificado` | `AuthStateService` | Removidos fallbacks ficticios (`Distribuidora Tech`, `20601234567`, `CompuNex Partner`), rutas convertidas a `loadComponent` lazy y `/panel` restringido a `ROLE_PROVEEDOR`. | No aparecen datos ficticios en el sidebar y las rutas respetan permisos reales. |
| **P-09 Carrito** | Agrupación Split Order y cálculo IGV | `Implementado y verificado` | *Local (`localStorage`)* | `stockDisponible` opcional en `CartItem`, saneamiento de cantidades enteras `>= 1` y limpieza de `(P-10)`. | Carrito agrupa por proveedor, calcula IGV 18% y muestra textos limpios. |
| **P-10/11/12 Checkout** | Flujo de compra en 3 pasos | `Implementado y verificado` | `POST /api/v1/orders/checkout` | Paleta corporativa unificada (`#142238`/`#2456C6`), limpieza de `(P-12)`/`(P-14)`, aclaración de campos persistidos en `DatosFacturacionDTO` y alerta inline de error. | Checkout descuenta stock, crea orden/subórdenes reales y limpia carrito. |
| **P-13 Factura** | Visor A4 e impresión | `Implementado y verificado` | `GET /api/v1/orders/me/{ordenId}` | Eliminados dirección, teléfono, correo y hash SUNAT hardcoded y fallback de ID `10001`. | Comprobante muestra únicamente datos reales de `EmisorFacturaDTO` y `ReceptorFacturaDTO`. |
| **P-14 Mis Compras** | Listado paginado de órdenes | `Implementado y verificado` | `GET /api/v1/orders/me` | Conectado `<app-pagination-bar>` a `page`/`size` del backend con `totalElements` y limpiado `(P-13)`. | Todas las páginas de órdenes son navegables contra el servidor. |
| **P-15 Detalle Orden** | Trazabilidad por suborden | `Implementado y verificado` | `GET /api/v1/orders/me/{ordenId}` | Agregado estado explícito `CANCELADO` en el stepper, `<app-status-badge>`, quitada guía ficticia `"Guía: T001-000492"`, fallback `10001` y `(P-13)`. | Timeline refleja estados reales incluyendo cancelación sin textos inventados. |
| **P-16 Mi Cuenta / Perfil** | Visualización de perfil | `Implementado y verificado` | `GET /api/v1/auth/me` | Eliminados valores fallback ficticios (`Carlos Mendoza`, `ciatecperu.pe`, `20601234567`) y `(P-18)`. | Muestra datos reales del usuario autenticado. |
| **P-16 Mi Cuenta / Perfil** | Edición de perfil comprador | `Bloqueado por falta de endpoint` | *No existe en backend* | Eliminado `AuthApiService.updateProfile()` simulado en `localStorage`; vista en modo solo lectura con aviso honesto hasta existir `PUT/PATCH` en `AuthController`. | No se engaña al usuario simulando persistencia en BD. |
| **P-17 Seguridad** | Cambio de contraseña | `Implementado y verificado` | `PATCH /api/v1/auth/password` | Muestra mensaje de error real del backend inline y toast, iconos SVG y pestaña `"Mi Panel Proveedor"` condicional a `isProveedor()`. | Contraseña se actualiza en BD con validación de clave actual. |
| **P-18 Activar Proveedor** | Promoción a `ROLE_PROVEEDOR` | `Implementado y verificado` | `POST /api/v1/providers/me/activate` | Reemplazado campo inexistente `categoriaPrincipal` por `anosMercado` y `politicaComercial` alineados a `ActivarProveedorRequestDTO`. | Activación envía exactamente los campos de `ActivarProveedorRequestDTO`. |
| **P-19 Dashboard Prov.** | KPIs y ventas recientes | `Implementado y verificado` | `GET /providers/me/products`<br>`GET /providers/me/sales` | Eliminada llamada duplicada mediante `getDashboardOverview()`, moneda corregida a `S/`, quitada tendencia ficticia y códigos `(P-20)`/`(P-21)`/`(P-24)`/`(P-26)`. | Dashboard carga en una sola ronda de peticiones y sin textos internos. |
| **P-20 Mis Productos** | Listado, búsqueda, pausa y borrado | `Implementado y verificado` | `GET/PATCH/DELETE /providers/me/products` | Búsqueda con debounce y `<app-pagination-bar>` conectados al servidor (`?search=&page=&size=`), modal inline de confirmación (sin `window.confirm()`) y manejo de errores. | Proveedor puede buscar y paginar todo su catálogo real sin límite de 10. |
| **P-21/23 Form Producto** | Crear, editar y subir imagen | `Implementado y verificado` | `POST/PUT /providers/me/products`<br>`POST /api/v1/media/upload` | Corregidos typos UTF-8 (`Automático`, `vacío`), quitados `(P-21)`/`(P-23)`, removido fallback ficticio de categorías y `getFallbackProductDetail()` en `updateProduct`. | Creación/edición persiste en BD e imagen se sube a `/api/v1/media/upload`. |
| **P-22 Detalle Prov.** | Ficha técnica interna | `Implementado y verificado` | `GET /providers/me/products/{id}` | Quitados códigos `(P-22)`/`(P-23)` y manejo seguro de `stockDisponible` opcional. | Ficha muestra datos reales sin texto de prototipo. |
| **P-24 Ventas Prov.** | Listado paginado de ventas | `Implementado y verificado` | `GET /providers/me/sales` | Conectado `<app-pagination-bar>` a `page`/`size` del backend, agregado filtro/estado `CANCELADO`, quitada columna engañosa `0 prod.` y paleta unificada. | Todas las páginas de ventas son accesibles desde la tabla. |
| **P-25 Detalle Venta** | Transiciones de despacho | `Implementado y verificado` | `GET/PATCH /providers/me/sales/{id}` | Agregada acción `CANCELADO` con confirmación inline desde `PENDIENTE_DESPACHO`/`EN_PREPARACION`, corregida vista `CANCELADO` en `DispatchStepperComponent`, bloqueo `isUpdating` y manejo de error. | Todas las transiciones del backend funcionan y `CANCELADO` se muestra correctamente. |
| **P-26 Perfil Comercial** | Subida de logo/banner y edición | `Bloqueado por falta de endpoint` | `GET /providers/me/profile`<br>`POST /media/upload` | Removidos fallbacks ficticios (`10+ años`, `01 000-0000`) y `purple-*`, agregado `politicaComercial` y aviso explícito de que `urlLogo`/`urlBanner` solo previsualizan en sesión hasta existir `PUT /api/v1/providers/me/profile`. | Documentado como bloqueado para persistencia de logo/banner. |
| **P-27 Legales y Error** | Legales, 403 y 404 | `Implementado y verificado` | *Ninguno* | Estandarizado buscador de `404` a `/catalog?search=...` y mensaje `403` alineado al rol `ROLE_PROVEEDOR`. | Rutas de error y legales operan de forma consistente. |
| **Módulo Admin** | Moderación global de productos | `Pendiente` *(Fuera de alcance vigente)* | `GET/PATCH /api/v1/admin/products` | Sin vista en `app.routes.ts`. Retirado del alcance objetivo actual. | Confirmar con equipo si permanece excluido del MVP. |

---

## 6. Detalle de Requests, Responses, Validaciones y Reglas de Negocio

Los contratos vigentes verificados en `CONTRATOS_JSON.md` y en los DTOs de `compunex-backend` son:

1. **Autenticación (`AuthController` — `/api/v1/auth`):**
   * `POST /login`: `{ correo, contrasena }` → `200` `{ token, tipoToken, expiraEnSegundos }` | `401` `{ mensaje }`.
   * `POST /register-company`: `{ nombre, correo, contrasena, ruc, razonSocial, ... }` → `201` `{ usuarioId, correo, nombre, rol, tienePerfilProveedor, token, tipoToken, expiraEnSegundos }`.
   * `GET /me`: Bearer → `200` `{ correo, nombre, rol, valido }`.
   * `PATCH /password`: `{ contrasenaActual, nuevaContrasena }` → `200` `{ mensaje, fechaActualizacion }` | `400`.
2. **Categorías y Catálogo Público (`CategoriaController`, `ProductoPublicoController`):**
   * `GET /categories`: `200` `CategoriaResponseDTO[]` (`id`, `nombre`, `icono`, `descripcion`, `estado`, `totalProductos`).
   * `GET /categories/{id}`: `200` `CategoriaDetalleResponseDTO` (incluye `subcategorias[]`).
   * `GET /products?search=&categoryId=&page=0&size=12`: `200` `{ contenido[], pagina, tamano, totalElementos, totalPaginas, esUltima }`.
   * `GET /products/{id}`: `200` `ProductoPublicoDetalleDTO`.
3. **Órdenes y Checkout (`OrderController` — `/api/v1/orders`):**
   * `POST /checkout`: `{ datosFacturacion: { tipoComprobante, rucReceptor, razonSocialReceptor, direccionFiscal, metodoPagoSimulado }, items: [{ productoId, cantidad }] }` → `201` `CheckoutResponseDTO`. **Reglas:** RUC de 11 dígitos, carrito no vacío, prohibición de auto-compra (`RN-007`, `400`/`409`).
   * `GET /me?page=0&size=10`: `200` `OrdenPaginadaResponseDTO`.
   * `GET /me/{ordenId}`: `200` `CheckoutResponseDTO` | `404`.
4. **Proveedor (`ProviderProfileController`, `ProductoProveedorController`, `ProviderSalesController`, `MediaController`):**
   * `GET /providers/me/profile`: `200` `ProveedorPerfilResponseDTO`.
   * `POST /providers/me/activate`: `ActivarProveedorRequestDTO` → `201` `{ proveedorId, rol, token, tipoToken, expiraEnSegundos, mensaje }`.
   * `GET /providers/me/products?search=&page=0&size=10`, `GET /{id}`, `POST`, `PUT /{id}`, `PATCH /{id}/status` (`{ estado }`), `DELETE /{id}` (`204`).
   * `GET /providers/me/sales?page=0&size=10`, `GET /{subordenId}`, `PATCH /{subordenId}/status` (`{ nuevoEstado }`). **Transiciones válidas:** `PENDIENTE_DESPACHO` → `EN_PREPARACION` | `CANCELADO`; `EN_PREPARACION` → `DESPACHADO` | `CANCELADO`; `DESPACHADO` → `ENTREGADO`.
   * `POST /media/upload` (`multipart/form-data`: `file` máx. 5MB `.jpg`/`.png`/`.webp`, `folder`: `products`|`profiles`) → `201` `{ url, nombreArchivo, contentType, tamanoBytes }`.

---

## 7. Mejoras de Diseño, UX, Accesibilidad y Consistencia

1. **Eliminar códigos de prototipo en la UI:** Retirar `(P-10)`, `(P-12)`, `(P-13)`, `(P-14)`, `(P-18)`, `(P-20)`, `(P-21)`, `(P-22)`, `(P-23)`, `(P-24)`, `(P-26)` de botones, títulos y tooltips en `CartComponent`, `ReviewStepComponent`, `ConfirmationStepComponent`, `MyOrdersComponent`, `OrderDetailComponent`, `ProfileComponent`, `ProviderDashboardComponent`, `ProviderProductFormComponent` y `ProviderProductDetailComponent`.
2. **Corregir textos con codificación dañada:** Reemplazar `"Automǭtico"` y `"vaco"` en `ProviderProductFormComponent`.
3. **Reemplazar `window.confirm()`:** En `ProviderProductsListComponent` (eliminación de producto), usar un modal de confirmación consistente con el diseño Tailwind de la app (similar al de `CartComponent`).
4. **Unificar barra de pestañas en `/cuenta/*`:** Agregar el enlace condicional a `/panel` en `ChangePasswordComponent` igual que en `ProfileComponent`.
5. **Mantener identidad visual existente:** Conservar la paleta (`#142238`, `#2456C6`, `slate-*`, `emerald-*`, `rose-*`), tipografía y componentes `shared/*` (`PaginationBarComponent`, `ProductCardComponent`, `StatusBadgeComponent`, `ToastContainerComponent`).

---

## 8. Problemas y Limitaciones Bloqueantes Identificados (Sin Endpoint en Backend)

1. **Edición de perfil del comprador (`P-16`):** No existe `PUT`/`PATCH` en `AuthController` para actualizar nombre, razón social, teléfono o dirección del usuario comprador.
2. **Persistencia de logo, banner y edición dedicada de proveedor (`P-26`):** No existe `PUT /api/v1/providers/me/profile` y `ActivarProveedorRequestDTO` no contempla `urlLogo` ni `urlBanner`.
3. **Formulario de contacto/cotización (`P-05`):** No existe endpoint para enviar mensajes/cotizaciones al proveedor.
4. **Recuperación de contraseña (`P-06`):** No existe endpoint de restablecimiento de clave en `AuthController`.
5. **Filtrado por rango de precio, stock y ordenamiento en catálogo (`P-03`) y métricas KPI dedicadas (`P-19`):** `GET /api/v1/products` solo soporta `search`, `categoryId`, `page`, `size`; `CrearProductoRequestDTO` no tiene campo `stockDisponible`; `OrdenResumenDTO` no incluye `estado`.

---

## 9. Plan de Implementación por Fases *(Estado de Ejecución)*

### Fase 1 — Limpieza de Datos Ficticios y Conexión Real de Portada y Catálogo (Prioridad Crítica) — `[COMPLETADO]`
* **Tarea 1.1: Conectar `HomeViewComponent` (`P-01`) a API real** — `[COMPLETADO]`
  * *Archivos:* `features/home/home-view.component.ts`, `core/services/catalog-api.service.ts`.
  * *Implementación:* Consume `GET /api/v1/categories` y `GET /api/v1/products?page=0&size=8`; enlaza categorías a `/catalog?categoryId={id}`, destacados con `<app-product-card>` a `/catalog/{id}` y CTA vendedor según rol (`/panel/dashboard`, `/cuenta/activar-proveedor` o `/auth/registro-empresa`); removidos bloques ficticios `providers[]`, `communityPosts[]` y textos `"próximamente"`.
* **Tarea 1.2: Corregir `CatalogApiService` y `CatalogComponent` (`P-02`, `P-03`, `P-04`)** — `[COMPLETADO]`
  * *Archivos:* `core/services/catalog-api.service.ts`, `core/state/catalog-state.service.ts`, `features/categories/categories.component.ts`, `features/catalog/catalog.component.ts`, `features/product-detail/product-detail.component.ts`, `features/not-found/not-found-view.component.ts`.
  * *Implementación:* Removido fallback `stockDisponible ?? 100` y métodos huérfanos `createProduct`/`updateProduct` de `CatalogApiService`; unificada la sincronización URL con `syncFromQueryParams` y debounce 300ms en `CatalogComponent`; `<app-pagination-bar>` y drawer móvil de filtros; `@defer (on viewport)` en relacionados y datos reales de proveedor en `P-04`; carga bajo demanda `GET /categories/{id}` en `P-02`; unificado `?search=` en `NotFoundViewComponent`.

### Fase 2 — Paginación Real y Correcciones en Panel de Proveedor y Órdenes (Prioridad Alta) — `[COMPLETADO]`
* **Tarea 2.1: Paginación contra servidor en `MyOrdersComponent` (`P-14`), `ProviderProductsListComponent` (`P-20`) y `ProviderSalesListComponent` (`P-24`)** — `[COMPLETADO]`
  * *Archivos:* `features/orders/my-orders/my-orders.component.ts`, `features/provider/products/products-list/provider-products-list.component.ts`, `.../product-table/product-table.component.ts`, `features/provider/sales/sales-list/provider-sales-list.component.ts`, `.../sales-table/sales-table.component.ts`.
  * *Endpoints:* `GET /api/v1/orders/me?page=&size=`, `GET /api/v1/providers/me/products?search=&page=&size=`, `GET /api/v1/providers/me/sales?page=&size=`.
  * *Implementación:* Paginación base 0 contra el servidor usando `totalElements` y `totalPages` en `<app-pagination-bar>`; búsqueda servidor en `P-20` con debounce; reemplazado `window.confirm()` por modal inline en `P-20`; eliminada columna engañosa `0 prod.` y agregado estado/filtro `CANCELADO` en `P-24`.
* **Tarea 2.2: Completar transiciones y estado `CANCELADO` en `ProviderSaleDetailComponent` (`P-25`) y `OrderDetailComponent` (`P-15`)** — `[COMPLETADO]`
  * *Archivos:* `features/provider/sales/sale-detail/provider-sale-detail.component.ts`, `.../dispatch-stepper/dispatch-stepper.component.ts`, `.../dispatch-actions/dispatch-actions.component.ts`, `features/orders/order-detail/order-detail.component.ts`.
  * *Endpoints:* `PATCH /api/v1/providers/me/sales/{subordenId}/status`, `GET /api/v1/orders/me/{ordenId}`.
  * *Implementación:* Agregada transición `CANCELADO` con confirmación inline desde `PENDIENTE_DESPACHO` / `EN_PREPARACION`, vista corregida para `CANCELADO` en ambos steppers, quitada guía ficticia `"Guía: T001-000492"`, quitado fallback `10001`, bloqueo `isUpdating` y manejo de error inline/toast.
* **Tarea 2.3: Optimizar `ProviderDashboardComponent` (`P-19`), rutas lazy y corregir `roleGuard`** — `[COMPLETADO]`
  * *Archivos:* `features/provider/dashboard/provider-dashboard.component.ts`, `.../kpi-cards/provider-kpi-cards.component.ts`, `.../recent-sales/provider-recent-sales.component.ts`, `core/services/provider-api.service.ts`, `core/state/auth-state.service.ts`, `app.routes.ts`, `layout/panel-sidebar/panel-sidebar.component.ts`, `layout/panel-layout/panel-layout.component.ts`, `layout/store-navbar/store-navbar.component.ts`.
  * *Implementación:* Eliminada llamada duplicada mediante `getDashboardOverview()`, moneda `S/`, quitado KPI ficticio, RUC/nombre fallback del sidebar, rutas hijas convertidas a `loadComponent` lazy y `/panel` restringido a `ROLE_PROVEEDOR`.

### Fase 3 — Sinceramiento de Funcionalidades Bloqueadas, Limpieza UX, Paleta y Build de Producción (Prioridad Media) — `[COMPLETADO]`
* **Tarea 3.1: Sincerar `ProductContactModalComponent` (`P-05`), `ProfileComponent` (`P-16`) y `ProviderCompanyProfileComponent` (`P-26`)** — `[COMPLETADO]`
  * *Implementación:* Eliminado `setTimeout` simulado y calificación `4.9` en `P-05` (muestra datos reales de contacto del proveedor, copia de solicitud al portapapeles, `mailto:` y aviso honesto); deshabilitado guardado falso en `localStorage` y removidos defaults ficticios en `P-16`; agregado `politicaComercial` y aviso explícito en `P-26` de que `urlLogo`/`urlBanner` solo previsualizan en sesión hasta contar con `PUT /api/v1/providers/me/profile`; eliminada dirección/teléfono/correo/hash hardcoded en `InvoiceViewerComponent` (`P-13`).
* **Tarea 3.2: Limpieza de textos, UTF-8, `Login` (`P-06`), `RegisterCompany` (`P-07`), `ActivateProvider` (`P-18`), `Checkout` (`P-09..12`), `angular.json` y verificación** — `[COMPLETADO]`
  * *Implementación:* Removidos todos los códigos visibles `(P-XX)` e `indigo-*`/`purple-*`; corregidos `"Automático"`/`"vacío"` en `ProviderProductFormComponent`; conectado `recordarSesion` a `sessionStorage`/`localStorage` en `P-06`; agregado `direccion` obligatoria en `P-07`; alineados `anosMercado` y `politicaComercial` en `P-18`; agregada alerta de error inline en Checkout y limpieza de cantidades en Carrito; agregados `fileReplacements` en `angular.json` (`production`); alineada pestaña `"Mi Panel Proveedor"` en `P-17`.
  * *Verificación ejecutada:* `npm run build` exitoso (`0` errores, 32 chunks lazy generados) y `npx ng test --watch=false --browsers=ChromeHeadless` exitoso (`TOTAL: 6 SUCCESS`).

---

## 10. Criterios de Aceptación Globales y Pruebas Funcionales Requeridas

1. **Cero datos ficticios o simulados:** Ninguna pantalla muestra productos, proveedores, guías, calificaciones, RUCs o respuestas simuladas (`setTimeout`, fallbacks hardcoded con `useMock: false`).
2. **Build limpio:** `npm run build` en `compunex-frontend` finaliza con `0` errores de TypeScript/Angular.
3. **Pruebas funcionales E2E contra backend real:**
   * Navegación desde `/` → `/categories` → `/catalog` → `/catalog/:id` → `/carrito` con datos de PostgreSQL.
   * Registro (`P-07`) → Login (`P-06`) → Checkout 3 pasos (`P-10..P-12`) → Mis Compras paginado (`P-14`) → Detalle y Factura (`P-15`, `P-13`).
   * Activación de proveedor (`P-18`) → Crear/Editar producto con subida de imagen (`P-21`, `P-23`) → Paginación y búsqueda en Mis Productos (`P-20`) → Paginación y despacho completo/cancelación en Ventas (`P-24`, `P-25`).
   * Verificación responsive en `375px` (móvil), `768px` (tablet) y desktop.
