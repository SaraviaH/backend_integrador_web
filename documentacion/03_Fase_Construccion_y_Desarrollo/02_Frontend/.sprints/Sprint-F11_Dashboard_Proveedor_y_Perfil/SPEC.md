# Sprint-F11 — Panel Principal del Proveedor y Perfil Comercial

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-provider-dashboard` hacia `develop`  
> **Dependencias Previas:** `Sprint-F10_Mi_Cuenta_Seguridad_y_Activacion`

---

## 1. Objetivo del Sprint
Construir el centro de control operativo del proveedor comercial: Panel del Proveedor (`P-19`) con indicadores clave de rendimiento (KPIs de ventas, pedidos pendientes de despacho y catálogo activo) y la pantalla de Perfil Comercial (`P-26`) para gestionar la información pública, comercial y fiscal de la empresa mayorista.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-19`: Panel del proveedor (Dashboard con tarjetas de KPIs: Total facturado PEN, Órdenes por despachar, Catálogo publicado, accesos directos a "Publicar Producto" y "Ver Ventas", tabla rápida de últimas ventas).
  * `P-26`: Perfil comercial (Edición de Razón Social, Nombre comercial, logotipo corporativo, canales de contacto comercial y condiciones de venta).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/providers/me/profile` (Endpoint 16)
  * `GET /api/v1/providers/me/sales?page=0&size=5` (Endpoint 23)
  * `GET /api/v1/providers/me/products?page=0&size=5` (Endpoint 7)
* **Reglas de Negocio:**
  * `RN-001`: Acceso restringido exclusivamente a usuarios con rol `PROVEEDOR` (`RoleGuard`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Protección de Rutas de Proveedor
- [ ] Configurar `roleGuard.ts` para que `/proveedor/**` sea accesible únicamente si el usuario autenticado tiene el rol `PROVEEDOR`.
- [ ] En caso contrario, redirigir a `/403`.

### 3.2. Pantalla P-19: Panel del Proveedor (`ProviderDashboardComponent`)
- [ ] Tarjetas de métricas (KPIs):
  * **Ventas Acumuladas:** Suma de subtotales facturados en Soles (`PEN`).
  * **Subórdenes Pendientes:** Cantidad de paquetes en estado `PENDIENTE_DESPACHO` o `EN_PREPARACION`.
  * **Productos en Catálogo:** Total de ítems activos en tienda.
- [ ] Botones de acción rápida: "Publicar Nuevo Producto", "Gestionar Despachos".
- [ ] Tabla rápida de "Últimos Pedidos Asignados" con código de orden, cliente, monto y estado.
- [ ] 4 Estados: Skeletons de KPIs y tabla, Vista con datos, Vista para proveedor nuevo sin ventas con guía de inicio, Error.

### 3.3. Pantalla P-26: Perfil Comercial (`ProviderCompanyProfileComponent`)
- [ ] Formulario con datos de la empresa proveedora:
  * RUC (campo de solo lectura para evitar desalineación fiscal).
  * Razón Social y Nombre Comercial.
  * Dirección fiscal y teléfonos de contacto para compradores mayoristas.
- [ ] Botón "Guardar Cambios" con confirmación de actualización exitosa.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El acceso está protegido por `RoleGuard`; usuarios sin rol reciben bloqueo 403.
- [ ] Las métricas del dashboard se calculan y visualizan de forma atractiva y responsiva.
- [ ] El formulario de perfil comercial pre-carga los datos existentes y permite editarlos.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/provider/pages/dashboard/**/*.spec.ts
# Navegar a http://localhost:4200/proveedor/dashboard y /proveedor/perfil-comercial
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Pantallas | Componentes | Endpoints |
| :--- | :--- | :--- | :--- |
| `RF-07`, `RF-08`, `RF-10` | `P-19`, `P-26` | `ProviderDashboardComponent.ts`, `ProviderCompanyProfileComponent.ts` | 7, 16, 23 |
