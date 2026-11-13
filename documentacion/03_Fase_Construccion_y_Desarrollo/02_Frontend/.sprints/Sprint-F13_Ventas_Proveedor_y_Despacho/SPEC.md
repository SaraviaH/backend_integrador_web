# Sprint-F13 — Control de Ventas Recibidas y Gestión de Despacho del Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-provider-sales` hacia `develop`  
> **Dependencias Previas:** `Sprint-F12_Gestion_Catalogo_Proveedor`

---

## 1. Objetivo del Sprint
Construir el flujo operativo de atención de pedidos para proveedores comerciales: pantalla de Ventas Recibidas (`P-24`) con listado de subórdenes asignadas como resultado del Split Order y filtros por estado logístico, y pantalla de Detalle de Venta y Despacho (`P-25`) para consultar los ítems a enviar, datos del cliente y actualizar el estado de despacho (`PENDIENTE_DESPACHO` -> `EN_PREPARACION` -> `DESPACHADO` -> `ENTREGADO`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-24`: Ventas recibidas (Tabla paginada con ID de suborden, código de orden global, comprobante simulado, comprador, total en PEN, fecha y estado de despacho con badges de color).
  * `P-25`: Detalle de venta y despacho (Datos de facturación del cliente, dirección de entrega, lista de productos a despachar con cantidades, y selector interactivo para cambiar el estado de despacho).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/providers/me/sales?page=0&size=10` (Endpoint 23)
  * `GET /api/v1/providers/me/sales/{subordenId}` (Endpoint 24)
* **Reglas de Negocio:**
  * `RN-005`: Trazabilidad individual de cada suborden del Split Order.
  * `RN-006`: Vinculación con el comprobante fiscal correlativo de la venta.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-24: Ventas Recibidas (`ProviderSalesListComponent`)
- [ ] Tabla responsiva con columnas: N° Suborden, Comprobante (`F001-XXXXX`), Orden Global, Comprador Mayorista, Monto Total Suborden, Fecha, Estado.
- [ ] Filtros rápidos por estado: "Todos", "Pendientes", "En Preparación", "Despachados".
- [ ] 4 Estados: Skeletons de filas, Tabla con ventas, Estado sin ventas con mensaje motivacional, Error de conexión.

### 3.2. Pantalla P-25: Detalle de Venta y Despacho (`ProviderSaleDetailComponent`)
- [ ] Tarjeta de datos del comprador: Razón Social, RUC, Dirección de entrega y teléfono de contacto.
- [ ] Tabla de ítems asignados a este proveedor: Cantidad requerida, SKU, nombre del producto, precio unitario e importe subtotal.
- [ ] Panel de Control de Despacho:
  * Barra de progreso visual con los 4 estados: `PENDIENTE_DESPACHO` ➔ `EN_PREPARACION` ➔ `DESPACHADO` ➔ `ENTREGADO`.
  * Selector / botones de acción para transicionar al siguiente estado logístico con confirmación.
  * Al actualizar: refresca el estado en pantalla y muestra notificación toast de éxito.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El proveedor solo visualiza las subórdenes asignadas a su catálogo (garantizado por el mock/backend).
- [ ] La transición de estado logístico actualiza la barra de progreso sin recargar la página.
- [ ] Las 2 pantallas son responsivas y accesibles.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/provider/pages/sales/**/*.spec.ts
# Navegar a http://localhost:4200/proveedor/ventas y /proveedor/ventas/1
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantallas | Componentes | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-08` | `RN-005`, `RN-006` | `P-24`, `P-25` | `ProviderSalesListComponent.ts`, `ProviderSaleDetailComponent.ts` | 23, 24 |
