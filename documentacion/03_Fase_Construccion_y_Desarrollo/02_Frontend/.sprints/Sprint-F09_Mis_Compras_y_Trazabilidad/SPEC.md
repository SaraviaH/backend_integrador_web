# Sprint-F09 — Historial de Compras B2B y Detalle de Pedido

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-orders-history` hacia `develop`  
> **Dependencias Previas:** `Sprint-F08_Visor_Factura_y_Comprobantes`

---

## 1. Objetivo del Sprint
Construir las vistas de trazabilidad y gestión post-compra del cliente mayorista: pantalla de Mis Compras (`P-14`) con listado cronológico de órdenes paginadas y estado de procesamiento, y pantalla de Detalle de Compra (`P-15`) con desglose de paquetes por proveedor, estado de entrega individual y enlace a los comprobantes fiscales simulados.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-14`: Mis compras (Tabla paginada con código de orden, fecha de emisión, cantidad de subórdenes, total en PEN, badge de estado y botón "Ver Detalle").
  * `P-15`: Detalle de compra (Cabecera de la orden global, desglose por cada paquete de proveedor con sus subórdenes, estado de despacho y botón para ver la factura).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/orders/me?page=0&size=10` (Endpoint 21)
  * `GET /api/v1/orders/me/{ordenId}` (Endpoint 22)
* **Reglas de Negocio:**
  * `RN-005` y `RN-006`: Presentación de órdenes divididas por proveedor y comprobantes congelados.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-14: Mis Compras (`MyOrdersComponent`)
- [ ] Tabla responsiva con columnas: Código de Orden, Fecha, Proveedores involucrados, Monto Total (PEN), Estado general (`PENDIENTE`, `PROCESANDO`, `PAGADO`, `CANCELADO`).
- [ ] Controles de paginación previa/siguiente.
- [ ] 4 Estados: Skeletons de filas de tabla, Tabla poblada, Estado sin compras con CTA "Ir al Catálogo", Error de conexión.

### 3.2. Pantalla P-15: Detalle de Compra (`OrderDetailComponent`)
- [ ] Resumen de la orden: Código único, RUC receptor, Razón Social, Dirección de entrega.
- [ ] Tarjetas de subórdenes: Cada proveedor tiene su sección con:
  * Número de factura simulada (`F001-XXXXX`).
  * Estado de despacho del paquete (`PENDIENTE_DESPACHO`, `EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`).
  * Lista de productos con precio unitario, cantidad y total.
  * Botón directo "Ver Factura Simulada" hacia `/pedidos/:id/comprobante`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Ambas vistas son completamente responsivas y se adaptan a formato móvil mediante tarjetas colapsables.
- [ ] La navegación desde la lista al detalle y desde el detalle al comprobante funciona sin errores de enrutamiento.
- [ ] 4 estados de pantalla implementados y verificados.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/orders/**/*.spec.ts
# Navegar a http://localhost:4200/cuenta/mis-compras
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Pantallas | Componentes | Endpoints |
| :--- | :--- | :--- | :--- |
| `RF-06` | `P-14`, `P-15` | `MyOrdersComponent.ts`, `OrderDetailComponent.ts` | 21, 22 |
