# Sprint-F05 — Paneles de Proveedor, Cuenta y Páginas de Error

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-provider-panels` hacia `develop`  
> **Dependencias Previas:** `Sprint-F04_Checkout_y_Facturacion`

---

## 1. Objetivo del Sprint
Implementar los tableros de gestión privada para proveedores comerciales y usuarios autenticados: gestión de cuenta y seguridad (`P-16`, `P-17`), activación de rol proveedor (`P-18`), panel de métricas B2B (`P-19`), CRUD completo de catálogo propio (`P-20` a `P-23`), administración de ventas recibidas y despacho de subórdenes (`P-24`, `P-25`), perfil comercial (`P-26`), y las pantallas estándar de error del sistema (`P-36` 403 Forbidden y `P-37` 404 Not Found).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-16`: Mi cuenta | `P-17`: Cambiar contraseña | `P-18`: Activar perfil proveedor
  * `P-19`: Panel del proveedor | `P-20`: Mis productos | `P-21`: Crear producto
  * `P-22`: Detalle de producto propio | `P-23`: Editar producto
  * `P-24`: Ventas recibidas | `P-25`: Detalle de venta y despacho
  * `P-26`: Perfil comercial
  * `P-36`: Acceso denegado (403) | `P-37`: Página no encontrada (404)
* **Contratos Consumidos (vía Prism Mock Server):**
  * Perfil: `GET /api/v1/auth/me` (3), `PATCH /api/v1/auth/password` (4)
  * Proveedor: `POST /api/v1/providers/me/activate` (17), `GET /api/v1/providers/me/profile` (16)
  * Catálogo propio: Endpoints 7, 8, 9, 10, 11, 12
  * Ventas/Despacho: Endpoints 23, 24
* **Reglas de Negocio:**
  * `RN-001`: Control de rutas con `RoleGuard` (requiere `ROLE_PROVEEDOR`).
  * `RN-002`: Validación de RUC para activación de proveedor.
  * `RN-003`: Soft-delete visual en listado de productos propios.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Gestión de Cuenta y Seguridad (`P-16`, `P-17`, `P-18`)
- [ ] `AccountProfileComponent` (`P-16`): Visualización de datos de cuenta y botón para activar perfil de proveedor si el usuario aún es cliente.
- [ ] `ChangePasswordComponent` (`P-17`): Formulario reactivo con contraseña actual, nueva contraseña y confirmación.
- [ ] `ActivateProviderComponent` (`P-18`): Formulario con RUC (11 dígitos), Razón Social y dirección para convertirse en proveedor.

### 3.2. Panel y Dashboard del Proveedor (`P-19`, `P-26`)
- [ ] `ProviderDashboardComponent` (`P-19`): Tarjetas de métricas (Total ingresos en PEN, subórdenes pendientes de preparación, total productos activos) y accesos directos.
- [ ] `ProviderCompanyProfileComponent` (`P-26`): Edición de datos comerciales, logotipo y teléfonos de contacto mayorista.

### 3.3. CRUD de Catálogo del Proveedor (`P-20` a `P-23`)
- [ ] `ProviderProductsListComponent` (`P-20`): Tabla con buscador interno, paginación, switch para alternar estado (`ACTIVO`/`INACTIVO`) y acción de eliminación con diálogo de confirmación.
- [ ] `ProductFormComponent` (`P-21` y `P-23`):
  * Formulario reactivo con validaciones para SKU, nombre, categoría, subcategoría, precio mayorista, stock disponible y stock mínimo de alerta.
  * FormArray dinámico para agregar/quitar especificaciones clave-valor (`clave`, `valor`).
  * Manejo de URLs de imágenes con previsualización en vivo.
- [ ] `ProviderProductDetailComponent` (`P-22`): Ficha de inspección de producto con historial y métricas de venta.

### 3.4. Ventas y Control de Despacho (`P-24`, `P-25`)
- [ ] `ProviderSalesListComponent` (`P-24`): Listado de subórdenes asignadas por el Split Order con filtros por estado de despacho.
- [ ] `ProviderSaleDetailComponent` (`P-25`):
  * Datos de entrega del comprador mayorista.
  * Desglose de ítems despachados.
  * Selector interactivo de estado de despacho con confirmación (`PENDIENTE_DESPACHO` -> `EN_PREPARACION` -> `DESPACHADO` -> `ENTREGADO`).

### 3.5. Páginas de Error y Fallback (`P-36`, `P-37`)
- [ ] `AccessDeniedComponent` (`P-36`): Ilustración 403 corporativa, mensaje claro y botón de redirección segura.
- [ ] `NotFoundComponent` (`P-37`): Ilustración 404, buscador integrado y enlaces sugeridos.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Las 13 pantallas cumplen los lineamientos de diseño B2B y cuentan con diseño responsivo.
- [ ] El cambio de estado de despacho actualiza la suborden y refresca la vista del proveedor.
- [ ] La adición dinámica de especificaciones en el formulario de producto funciona sin fugas de memoria.
- [ ] Intentos de acceder a `/proveedor/**` sin estar autenticado o sin rol redirigen a `/403` o `/auth/login`.

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas de componentes de proveedor
ng test --include=src/app/features/provider/**/*.spec.ts
# Navegar a http://localhost:4200/proveedor/dashboard
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantallas | Componentes Angular |
| :--- | :--- | :--- | :--- |
| `RF-02`, `RF-10` | `RN-001`, `RN-002` | `P-16`, `P-17`, `P-18`, `P-26` | `ProfileComponents.ts` |
| `RF-07` | `RN-003`, `RN-004` | `P-19`, `P-20`, `P-21`, `P-22`, `P-23` | `ProviderProductComponents.ts` |
| `RF-08` | `RN-005`, `RN-006` | `P-24`, `P-25` | `ProviderSalesComponents.ts` |
| `RF-Transversal` | N/A | `P-36`, `P-37` | `ErrorPagesComponents.ts` |
