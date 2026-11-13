# Sprint-F04 — Flujo de Checkout B2B, Split Order y Visor de Factura Simulada

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-checkout-invoice` hacia `develop`  
> **Dependencias Previas:** `Sprint-F03_Carrito_Reactivo`

---

## 1. Objetivo del Sprint
Construir el túnel completo de compra mayorista paso a paso (Wizard B2B: Datos de Facturación `P-10`, Revisión de Pedido con Split Order `P-11`, Confirmación `P-12`), el visor de facturas y comprobantes simulados con formato oficial `F001-XXXXX` (`P-13`), y las pantallas de historial y detalle de pedidos del comprador (`P-14` y `P-15`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-10`: Datos de facturación (RUC, Razón Social, Dirección fiscal).
  * `P-11`: Revisión del pedido (Visualización de N paquetes por proveedor).
  * `P-12`: Confirmación de compra (Simulación de pago mayorista).
  * `P-13`: Comprobantes simulados (Plantilla de factura electrónica simulada con desglose fiscal).
  * `P-14`: Mis compras (Listado cronológico de órdenes B2B).
  * `P-15`: Detalle de compra (Vista consolidada de orden y subórdenes).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `POST /api/v1/orders/checkout` (Endpoint 20)
  * `GET /api/v1/orders/me` (Endpoint 21)
  * `GET /api/v1/orders/me/{ordenId}` (Endpoint 22)
* **Reglas de Negocio:**
  * `RN-002`: Validación de RUC 11 dígitos.
  * `RN-005`: Visualización transparente de subórdenes por proveedor (Split Order).
  * `RN-006`: Renderizado de factura simulada (`F001-%08d`, IGV 18%).
  * `RN-007`: Manejo de error si se intenta comprar productos propios.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Asistente de Checkout B2B (Wizard `P-10` a `P-12`)
- [ ] `CheckoutBillingStepComponent` (`P-10`):
  * Formulario reactivo pre-poblado con los datos del perfil si el usuario es empresa registrada (`GET /api/v1/auth/me`).
  * Validación estricta de RUC (11 dígitos numéricos) y dirección fiscal.
- [ ] `CheckoutReviewStepComponent` (`P-11`):
  * Desglose explícito que informa al comprador mayorista: *"Su pedido contiene productos de N proveedores. Se generarán N subórdenes y facturas independientes para garantizar la trazabilidad de cada despacho"*.
- [ ] `CheckoutConfirmStepComponent` (`P-12`):
  * Selector de método de pago simulado ("Línea de Crédito Mayorista 30 días" o "Transferencia Bancaria").
  * Botón "Emitir Orden y Facturas Simuladas" que invoca `POST /api/v1/orders/checkout`.
  * Manejo de error: Si el backend rechaza por `RN-007` (auto-compra) o falta de stock, mostrar banner rojo informativo sin perder los datos del formulario.

### 3.2. Visor de Factura Simulada (`InvoiceViewerComponent` - `P-13`)
- [ ] Maquetación CSS de comprobante fiscal simulado (estilo factura electrónica SUNAT):
  * Cabecera con RUC y Razón Social del Proveedor emisor.
  * Número de comprobante: `F001-XXXXXXXX`.
  * Datos del Cliente receptor (RUC, Razón Social, Dirección).
  * Tabla de ítems con cantidad, descripción, precio unitario y subtotal.
  * Cuadro resumen: Operación Gravada, IGV (18%), Importe Total en Soles (`PEN`).
  * Botón para impresión directa o exportación simulada (`window.print()`).

### 3.3. Historial y Detalle de Compras (`P-14` y `P-15`)
- [ ] `MyOrdersComponent` (`P-14`): Tabla paginada de órdenes con código, fecha, cantidad de subórdenes, monto total y estado con badges de color.
- [ ] `OrderDetailComponent` (`P-15`): Acordeón o pestañas con cada una de las subórdenes y enlaces directos a sus comprobantes individuales.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El flujo de checkout guía al usuario en 3 pasos ordenados con barra de progreso.
- [ ] Al completar el checkout, el carrito de compras se vacía automáticamente (`CartService.clearCart()`).
- [ ] La factura simulada renderiza perfectamente en pantalla y en vista de impresión sin cortes de texto.
- [ ] Todas las vistas implementan los 4 estados (Carga, Vacío, Datos, Error).

---

## 5. Plan de Verificación y Comandos
```bash
# Probar checkout en frontend contra Prism Mock
ng test --include=src/app/features/checkout/**/*.spec.ts
# Navegar a http://localhost:4200/checkout/datos-facturacion y completar el flujo
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantallas | Componentes Angular |
| :--- | :--- | :--- | :--- |
| `RF-05` | `RN-005`, `RN-007` | `P-10`, `P-11`, `P-12` | `CheckoutStepsComponent.ts` |
| `RF-06` | `RN-006` | `P-13`, `P-14`, `P-15` | `InvoiceViewerComponent.ts`, `OrderDetailComponent.ts` |
