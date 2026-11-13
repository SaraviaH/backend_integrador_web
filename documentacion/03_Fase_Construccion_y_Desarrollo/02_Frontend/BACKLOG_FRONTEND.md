# BACKLOG_FRONTEND.md — Backlog Detallado del Track Frontend (Angular 18 Standalone)

> **Área Técnica:** Frontend  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Línea Base:** Angular 18 (Standalone Components, Signals, Reactive Forms, Tailwind CSS, SASS)  
> **Total Pantallas MVP:** 27 pantallas (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`)  
> **Estrategia Desacoplada:** Desarrollo inicial 100% contra Prism Mock Server (`http://localhost:4010`) sobre `compunex-openapi.yaml`

---

## 1. Visión y Estrategia del Track Frontend

El Agente de Frontend es responsable de construir la interfaz de usuario moderna, reactiva, accesible y de alta fidelidad visual para COMPUNEX B2B. Su trabajo se ejecuta de forma **completamente paralela y desacoplada del Backend**, consumiendo el servidor mock Prism durante los sprints F01 a F05:
1. **Arquitectura Standalone y Señales (Signals):** Eliminación de `NgModule` tradicionales; uso de componentes standalone y gestión de estado con `signal()`, `computed()` y `effect()`.
2. **Los 4 Estados de Pantalla Obligatorios:** Cada vista que consuma datos asíncronos debe implementar explícitamente:
   * Estado de Carga (*Skeleton / Loading Spinner*).
   * Estado Vacío (*Empty State* amigable con call-to-action).
   * Estado con Datos (*Data populated* con tipografía y espaciado B2B).
   * Estado de Error (*Error banner / Retry button*).
3. **Accesibilidad WCAG 2.1 AA:** Contraste mínimo de 4.5:1, etiquetas ARIA en controles interactivos y navegación completa por teclado.
4. **Interconexión con Contratos:** Los servicios Angular consumen interfaces TypeScript generadas o alineadas 1:1 con `CONTRATOS_JSON.md`.

---

## 2. Mapa de Sprints del Track Frontend

| ID Sprint | Título | Pantallas Cubiertas | Componentes Clave | Estado |
| :--- | :--- | :--- | :--- | :---: |
| `Sprint-F01` | Shell, Auth y Catálogo Base | P-01, P-02, P-03, P-06, P-07 | `ShellComponent`, `LoginComponent`, `RegisterCompanyComponent`, `AuthService` | `PENDIENTE` |
| `Sprint-F02` | Catálogo Reactivo y Detalle | P-04, P-05 | `CatalogComponent`, `ProductDetailComponent`, `ProviderContactModalComponent` | `PENDIENTE` |
| `Sprint-F03` | Carrito Reactivo y Proveedores | P-09 | `CartComponent`, `CartGroupItemComponent`, `CartService` (Signals) | `PENDIENTE` |
| `Sprint-F04` | Checkout, Split Order y Factura | P-10, P-11, P-12, P-13, P-14, P-15 | `CheckoutStepOneComponent`, `OrderReviewComponent`, `InvoiceViewerComponent`, `OrderHistoryComponent` | `PENDIENTE` |
| `Sprint-F05` | Paneles Proveedor y Perfiles | P-16, P-17, P-18, P-19..P-26, P-36, P-37 | `ProviderDashboardComponent`, `ProductCrudComponent`, `ProviderSalesComponent`, `ProfileComponent`, `ErrorPages` | `PENDIENTE` |
| `Sprint-F_Audit` | **Quality Gate 2: Certificación Frontend** | Todas las 27 pantallas | Suite completa UI contra Prism Mock | `BLOQUEADO` |

---

## 3. Matriz Exhaustiva de Pantallas vs Sprints

| # Pantalla | Nombre de Pantalla | Sprint | Ruta Angular | Endpoint Consumido (Mock / Real) |
| :---: | :--- | :---: | :--- | :--- |
| `P-01` | Inicio | F01 | `/` | `GET /api/v1/categories`, `GET /api/v1/products` |
| `P-02` | Categorías | F01 | `/categorias` | `GET /api/v1/categories`, `GET /api/v1/categories/{id}` |
| `P-03` | Catálogo y búsqueda | F01 | `/catalogo` | `GET /api/v1/products?search=&categoryId=` |
| `P-04` | Detalle de producto | F02 | `/productos/:id` | `GET /api/v1/products/{id}` |
| `P-05` | Contacto del proveedor | F02 | `/productos/:id/contacto` | `GET /api/v1/products/{id}` |
| `P-06` | Iniciar sesión | F01 | `/auth/login` | `POST /api/v1/auth/login` |
| `P-07` | Registro de empresa | F01 | `/auth/registro-empresa` | `POST /api/v1/auth/register-company` |
| `P-09` | Carrito | F03 | `/carrito` | `CartService` (Signals + LocalStorage) |
| `P-10` | Datos de facturación | F04 | `/checkout/datos-facturacion` | `GET /api/v1/auth/me` |
| `P-11` | Revisión del pedido | F04 | `/checkout/revision` | `CartService` (Agrupación por proveedor) |
| `P-12` | Confirmación de compra | F04 | `/checkout/confirmacion` | `POST /api/v1/orders/checkout` |
| `P-13` | Comprobantes simulados | F04 | `/pedidos/:id/comprobante` | `GET /api/v1/orders/me/{ordenId}` |
| `P-14` | Mis compras | F04 | `/cuenta/mis-compras` | `GET /api/v1/orders/me` |
| `P-15` | Detalle de compra | F04 | `/cuenta/mis-compras/:id` | `GET /api/v1/orders/me/{ordenId}` |
| `P-16` | Mi cuenta | F05 | `/cuenta/perfil` | `GET /api/v1/auth/me` |
| `P-17` | Cambiar contraseña | F05 | `/cuenta/seguridad` | `PATCH /api/v1/auth/password` |
| `P-18` | Activar perfil proveedor | F05 | `/cuenta/activar-proveedor` | `POST /api/v1/providers/me/activate` |
| `P-19` | Panel del proveedor | F05 | `/proveedor/dashboard` | `GET /api/v1/providers/me/sales`, `GET /api/v1/providers/me/products` |
| `P-20` | Mis productos | F05 | `/proveedor/productos` | `GET /api/v1/providers/me/products` |
| `P-21` | Crear producto | F05 | `/proveedor/productos/nuevo` | `POST /api/v1/providers/me/products` |
| `P-22` | Detalle de producto propio | F05 | `/proveedor/productos/:id` | `GET /api/v1/providers/me/products/{id}` |
| `P-23` | Editar producto | F05 | `/proveedor/productos/:id/editar` | `PUT /api/v1/providers/me/products/{id}` |
| `P-24` | Ventas recibidas | F05 | `/proveedor/ventas` | `GET /api/v1/providers/me/sales` |
| `P-25` | Detalle de venta | F05 | `/proveedor/ventas/:id` | `GET /api/v1/providers/me/sales/{subordenId}` |
| `P-26` | Perfil comercial | F05 | `/proveedor/perfil-comercial` | `GET /api/v1/providers/me/profile` |
| `P-36` | Acceso denegado | F05 | `/403` | N/A (Error de Router Guard) |
| `P-37` | Página no encontrada | F05 | `/**` | N/A (Wildcard Router) |

---

## 4. Definición de Hecho (Definition of Done) para el Track Frontend
Para considerar un sprint de frontend como completado:
1. `ng build` compila al 100% sin errores de tipado en TypeScript.
2. Cada pantalla implementa los 4 estados visuales (Carga, Vacío, Datos, Error).
3. Todas las llamadas a API se realizan mediante servicios inyectables tipados usando `HttpClient`.
4. Los componentes son standalone y utilizan Signals para la reactividad.
5. Los formularios usan `ReactiveFormsModule` con validaciones sincronizadas con `RN-001` y `RN-002`.
