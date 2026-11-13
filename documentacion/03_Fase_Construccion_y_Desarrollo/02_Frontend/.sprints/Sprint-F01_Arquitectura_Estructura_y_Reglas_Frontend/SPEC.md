# Sprint-F01 — Arquitectura Frontend por Capas, Estructura Kebab-Case, Patrones GoF y Reglas SOLID

> **Área Técnica:** Frontend (Angular 18 Standalone + SASS)  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-architecture-scaffold` hacia `develop`  
> **Dependencias Previas:** `Sprint-G01_Setup_y_Entorno` (consume Prism Mock Server `http://localhost:4010`)  
> **Fuente de Verdad Obligatoria:** [`02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md)

---

## 1. Objetivo del Sprint
Construir y blindar el andamiaje arquitectónico oficial del cliente web de COMPUNEX B2B, implementando la **Arquitectura Frontend por Capas orientada a Features** con estructura estricta en **`kebab-case`** bajo `src/app/`, estableciendo las reglas de uso de arquitectura, los principios **SOLID**, patrones de diseño **GoF** (Facade, Observer, Interceptor, Strategy), el sistema de tokens en **SASS (`.scss`)**, los contratos tipados en `core/models/` y los componentes de layout base (`store-navbar` y `panel-sidebar`) antes de construir cualquier vista específica.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Arquitectura de Frontend:** [`02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md)
* **Contratos de Entrada y Salida:** [`02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md`](file:///c:/Users/Edison/Downloads/Proyectos/Universidad/Desarrollo%20web%20Integrado/backend_integrador_web/documentacion/02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md)
* **Rúbrica de Evaluación Académica:**
  * **Ítem 1:** Nomenclatura estricta en `kebab-case` para todas las carpetas y archivos.
  * **Ítem 3:** Cero URLs quemadas; uso estricto de `environment.apiUrl`.

---

## 3. Definición de Reglas Claras de Arquitectura y Buenas Prácticas

### 3.1. Las 5 Capas de Angular y sus Reglas de Dependencia
1. **Capa 1: Presentación (`features/`, `shared/components/`, `layout/`):**
   * **Smart Components (Páginas):** Gestionan rutas, orquestan llamadas a servicios y señales de estado.
   * **Dumb Components (Presentacionales):** Reciben datos exclusivamente por `@Input()` y emiten eventos por `@Output()`. Cero llamadas HTTP dentro de componentes presentacionales.
2. **Capa 2: Estado Reactivo (`core/state/`):**
   * Servicios singleton (`providedIn: 'root'`) gestionados con Angular **Signals** (`signal()`, `computed()`, `effect()`).
   * Los componentes nunca acceden ni manipulan `localStorage` directamente; toda persistencia pasa por esta capa.
3. **Capa 3: Servicios API (`core/services/`):**
   * Fachadas de servicio tipadas con `HttpClient`. Consumen siempre `environment.apiUrl`. Prohibido quemar URLs directas.
4. **Capa 4: Transversal HTTP y Seguridad (`core/interceptors/`, `core/guards/`):**
   * Interceptores funcionales para inyectar JWT Bearer (`auth.interceptor.ts`) y captura uniforme de errores HTTP (`error.interceptor.ts`).
   * Guards funcionales (`auth.guard.ts`, `role.guard.ts`) que protegen rutas de comprador, proveedor y administrador.
5. **Capa 5: Dominio y Contratos (`core/models/`):**
   * Interfaces TypeScript espejo 1:1 de `CONTRATOS_JSON.md`. Cero uso de `any`.

### 3.2. Aplicación de Principios SOLID en Angular
* **S (Single Responsibility):** Un componente se encarga únicamente de renderizar UI o coordinar una vista. La lógica de negocio y llamadas a API residen en servicios.
* **O (Open/Closed):** Los componentes presentacionales son configurables mediante inputs y transclusión (`<ng-content>`) sin modificar su código interno.
* **L (Liskov Substitution):** Subcomponentes y variantes de botones/tarjetas respetan las interfaces base.
* **I (Interface Segregation):** Interfaces de contratos granulares (`ProductoCardDTO`, `ProductoDetalleDTO`, `SubordenDTO`), sin obligar a componentes a depender de datos que no usan.
* **D (Dependency Inversion):** Los componentes dependen de abstracciones y servicios inyectados por el inyector de dependencias de Angular (`inject(Service)`), nunca instancian clases con `new`.

### 3.3. Aplicación de Patrones de Diseño GoF
* **Facade Pattern:** La capa `core/services/` actúa como fachada simplificada sobre `HttpClient`, aislando a los componentes de los detalles del protocolo HTTP.
* **Observer / Reactive Pattern:** Angular Signals (`signal`, `computed`) para propagar cambios de estado en tiempo real hacia la vista sin suscripciones manuales propensas a memory leaks.
* **Interceptor Pattern:** Pipeline HTTP de Angular para manejo transversal de autorización (`Bearer token`) y errores globales.
* **Strategy Pattern:** Validadores personalizados de formularios reactivos (`rucValidator`, `passwordMatchValidator`).

---

## 4. Tareas Técnicas Detalladas (Paso a Paso)

### 4.1. Creación del Árbol de Carpetas en `kebab-case` (`src/app/`)
- [ ] Crear la estructura completa conforme a `ARCHITECTURE.md`:
  ```text
  src/app/
  ├── core/
  │   ├── guards/                    # auth.guard.ts, role.guard.ts
  │   ├── interceptors/              # auth.interceptor.ts, error.interceptor.ts
  │   ├── models/                    # auth.model.ts, catalog.model.ts, order.model.ts, provider.model.ts
  │   ├── services/                  # auth-api.service.ts, catalog-api.service.ts, order-api.service.ts, provider-api.service.ts
  │   └── state/                     # auth-state.service.ts, cart-state.service.ts, toast-state.service.ts
  ├── shared/
  │   └── components/                # product-card, pagination, status-badge, toast-alert, confirm-modal
  ├── layout/
  │   ├── store-navbar/              # Navbar superior de tienda B2B
  │   └── panel-sidebar/             # Sidebar lateral del Panel Proveedor / Admin
  └── features/
      ├── home/                      # P-01 Inicio
      ├── categories/                # P-02 Categorías y subcategorías
      ├── catalog/                   # P-03, P-04, P-05
      ├── auth/                      # P-06, P-07
      ├── cart/                      # P-09
      ├── checkout-billing/          # P-10, P-11, P-12, P-13
      ├── orders/                    # P-14, P-15
      ├── account/                   # P-16, P-17, P-18
      ├── provider-panel/            # P-19..P-26
      ├── forbidden/                 # P-36 (403)
      └── not-found/                 # P-37 (404)
  ```

### 4.2. Sistema de Tokens SASS (`src/styles/`)
- [ ] Crear `src/styles/_tokens.scss` con variables de color oficiales:
  * `$color-primary: #2456C6;` (Azul corporativo B2B)
  * `$color-secondary: #142238;` (Azul oscuro / texto principal)
  * `$color-background: #F5F7FA;` (Fondo neutro claro)
  * `$color-surface: #FFFFFF;`
  * `$color-success: #10B981;` | `$color-warning: #F59E0B;` | `$color-danger: #EF4444;`
- [ ] Crear `src/styles/_mixins.scss` con mixins para media queries (`@mixin mobile`, `@mixin desktop`) y elevaciones de sombras.
- [ ] Configurar `src/styles/styles.scss` importando tokens y mixins, y configurando la tipografía base (`Inter`).

### 4.3. Interfaces de Dominio y Contratos (`core/models/`)
- [ ] Crear `auth.model.ts`: `LoginRequest`, `AuthResponse`, `RegisterCompanyRequest`, `UserProfile`, `ChangePasswordRequest`.
- [ ] Crear `catalog.model.ts`: `Category`, `Subcategory`, `ProductCard`, `ProductDetail`, `ProductSpecification`, `ProductImage`.
- [ ] Crear `order.model.ts`: `CheckoutRequest`, `CheckoutResponse`, `OrderSummary`, `OrderDetail`, `SuborderInvoice`, `OrderItem`.
- [ ] Crear `provider.model.ts`: `ProviderProfile`, `ProviderProduct`, `ProviderSaleSummary`, `ProviderSaleDetail`.

### 4.4. Componentes de Layout Base
- [ ] `StoreNavbarComponent` (`layout/store-navbar`): Navbar superior con logo B2B, buscador, categorías, carrito con badge reactivo y menú de cuenta.
- [ ] `PanelSidebarComponent` (`layout/panel-sidebar`): Barra lateral para panel de proveedor y admin con enlaces a Dashboard, Productos, Ventas y Perfil.

---

## 5. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Todas las carpetas y archivos bajo `src/app/` respetan la nomenclatura estricta en `kebab-case`.
- [ ] Cero dependencias circulares entre capas (`Madge` o `ng build` sin advertencias).
- [ ] Las interfaces de `core/models/` cubren el 100% de los 24 contratos de `CONTRATOS_JSON.md`.
- [ ] `ng build` compila limpiamente sin errores de sintaxis en TypeScript ni SASS.

---

## 6. Plan de Verificación y Comandos
```bash
# Verificar compilación limpia de la arquitectura
ng build --configuration development

# Verificar ausencia de 'any' y reglas de tipado
npm run lint # O npx eslint src/app
```

---

## 7. Matriz de Trazabilidad
| Capa Arquitectónica | Patrón GoF / Regla SOLID | Ubicación Física |
| :--- | :--- | :--- |
| Presentación | Single Responsibility (Smart/Dumb) | `src/app/features/`, `src/app/shared/components/` |
| Estado Reactivo | Observer / Signals | `src/app/core/state/` |
| Servicios API | Facade Pattern / Dependency Inversion | `src/app/core/services/` |
| Seguridad HTTP | Interceptor Pattern | `src/app/core/interceptors/`, `src/app/core/guards/` |
| Dominio | Interface Segregation | `src/app/core/models/` |
