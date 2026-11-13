# Sprint-F01 — Setup UI, Shell Base, Autenticación y Catálogo Inicial

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-shell-auth` hacia `develop`  
> **Dependencias Previas:** `Sprint-G01_Setup_y_Entorno` (consume Prism Mock Server)

---

## 1. Objetivo del Sprint
Construir la estructura base de navegación y layout de COMPUNEX B2B (Header, Footer, Navbar por roles), implementar la gestión de autenticación con Angular Signals e interceptor HTTP para JWT, y desarrollar las primeras 5 pantallas MVP: Inicio (`P-01`), Categorías (`P-02`), Catálogo y búsqueda shell (`P-03`), Iniciar sesión (`P-06`) y Registro de empresa (`P-07`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-01`: Inicio (Hero B2B, grid de categorías, productos destacados).
  * `P-02`: Categorías (Listado visual con total de productos por categoría).
  * `P-03`: Catálogo y búsqueda (Estructura de grilla y barra de filtros).
  * `P-06`: Iniciar sesión (Formulario B2B con validación reactiva).
  * `P-07`: Registro de empresa (Formulario con validación de RUC 11 dígitos y razón social).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `POST /api/v1/auth/login` (Endpoint 1)
  * `POST /api/v1/auth/register-company` (Endpoint 15)
  * `GET /api/v1/categories` (Endpoint 5)
  * `GET /api/v1/products` (Endpoint 18)
* **Reglas de Negocio:**
  * `RN-001`: Gestión de sesión y roles (`ADMIN`, `PROVEEDOR`, `CLIENTE`).
  * `RN-002`: Validación de RUC (11 dígitos, obligatorio para empresa).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Shell Layout y Navegación Principal
- [ ] Componente `HeaderComponent` (standalone): Logo COMPUNEX B2B, buscador rápido, badge dinámico del carrito, menú de usuario/login.
- [ ] Componente `FooterComponent` (standalone): Enlaces corporativos, datos fiscales, soporte B2B.
- [ ] Componente `ShellComponent`: Envoltorio principal con `<router-outlet>`.
- [ ] Sistema de rutas `app.routes.ts` con carga perezosa (`loadComponent`).

### 3.2. Infraestructura de Seguridad en Frontend
- [ ] `AuthService.ts`: Estado reactivo con Signals (`currentUser = signal<User | null>(null)`, `isAuthenticated = computed(...)`, `token = signal<string | null>(null)`).
- [ ] `authInterceptor.ts`: Interceptor funcional que adjunta `Authorization: Bearer <token>` a cada solicitud HTTP.
- [ ] `authGuard.ts` y `roleGuard.ts`: Protección de rutas según sesión y roles.

### 3.3. Implementación de Pantallas F01
- [ ] `LoginComponent` (`P-06`): Formulario reactivo con correo y contraseña, manejo de estado de carga, alerta de error ante credenciales inválidas y redirección pos-login.
- [ ] `RegisterCompanyComponent` (`P-07`): Formulario reactivo con RUC (11 dígitos numéricos), razón social, nombre comercial, correo, teléfono y contraseña.
- [ ] `HomeComponent` (`P-01`): Hero banner mayorista, carrusel/grid de categorías destacadas y productos en oferta con 4 estados.
- [ ] `CategoriesComponent` (`P-02`): Grid de tarjetas de categoría con contador de productos.
- [ ] `CatalogShellComponent` (`P-03`): Layout con panel lateral de filtros y área de resultados.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Las 5 pantallas renderizan fielmente el diseño B2B corporativo y son totalmente responsivas.
- [ ] El login contra Prism Mock devuelve token y actualiza el Header mostrando el nombre y rol del usuario.
- [ ] El formulario de registro valida que el RUC tenga exactamente 11 dígitos numéricos antes de permitir el envío.
- [ ] Cada pantalla implementa esqueleto de carga y manejo de error visual.
- [ ] `ng test` ejecuta pruebas de componentes sin errores.

---

## 5. Plan de Verificación y Comandos
```bash
# Arrancar servidor Mock
npm run mock:api # Puerto 4010

# Arrancar aplicación Angular
ng serve
# Navegar a http://localhost:4200, http://localhost:4200/auth/login, etc.
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente Angular |
| :--- | :--- | :--- | :--- |
| `RF-01` | `RN-001` | `P-06` | `LoginComponent.ts` |
| `RF-02` | `RN-002` | `P-07` | `RegisterCompanyComponent.ts` |
| `RF-03` | N/A | `P-01`, `P-02`, `P-03` | `HomeComponent.ts`, `CategoriesComponent.ts` |
