# Sprint-F07 — Asistente de Checkout B2B y Split Order en 3 Pasos

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-checkout-wizard` hacia `develop`  
> **Dependencias Previas:** `Sprint-F06_Carrito_Reactivo_y_Agrupacion`

---

## 1. Objetivo del Sprint
Construir el túnel de compra mayorista paso a paso (Wizard B2B): pantalla de datos fiscales de facturación (`P-10`), revisión detallada del pedido con aviso transparente de división por proveedor (Split Order) (`P-11`), y pantalla de confirmación con selección de medio de pago mayorista simulado (`P-12`), conectando con `POST /api/v1/orders/checkout`.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-10`: Datos de facturación (Formulario con RUC receptor, Razón Social, Dirección fiscal, pre-llenado si el usuario es empresa).
  * `P-11`: Revisión del pedido (Desglose de paquetes por proveedor con subtotales independientes).
  * `P-12`: Confirmación de compra (Selector de pago simulado: Transferencia bancaria o Crédito a 30 días, botón de confirmación).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `POST /api/v1/orders/checkout` (Endpoint 20)
  * `GET /api/v1/auth/me` (Endpoint 3)
* **Reglas de Negocio:**
  * `RN-002`: RUC de 11 dígitos numéricos obligatorio para facturación.
  * `RN-005`: Desglose visual de Split Order por proveedor.
  * `RN-007`: Manejo de error si se intenta comprar productos propios.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Infraestructura del Wizard de Checkout
- [ ] Componente contenedor `CheckoutWizardComponent` con barra de progreso superior en 3 pasos:
  * Paso 1: Facturación (`P-10`)
  * Paso 2: Revisión (`P-11`)
  * Paso 3: Confirmación (`P-12`)
- [ ] Guard `checkoutGuard.ts` que redirige a `/carrito` si el carrito está vacío.

### 3.2. Paso 1: Datos de Facturación (`P-10`)
- [ ] Formulario reactivo pre-poblado con los datos del usuario logueado (`GET /api/v1/auth/me`).
- [ ] Validación de RUC (11 dígitos), Razón Social y Dirección Fiscal.
- [ ] Botón "Continuar a Revisión".

### 3.3. Paso 2: Revisión del Pedido y Split Order (`P-11`)
- [ ] Alerta destacada: *"Su pedido contiene productos de múltiples proveedores. Se generarán facturas independientes por cada proveedor para garantizar la trazabilidad de sus despachos"*.
- [ ] Visualización de cada paquete con sus ítems, cantidades y subtotales.

### 3.4. Paso 3: Confirmación y Emisión (`P-12`)
- [ ] Selector de método de pago B2B (Transferencia Bancaria o Crédito 30 días).
- [ ] Botón "Emitir Orden y Facturas Simuladas".
- [ ] Disparo de `POST /api/v1/orders/checkout`.
- [ ] Al completarse exitosamente: vaciar carrito (`CartService.clearCart()`) y redirigir a `P-13` (Comprobantes simulados).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El asistente guía en 3 pasos fluidos sin pérdida de estado entre pantallas.
- [ ] Si el backend devuelve error de auto-compra (`RN-007`), se muestra alerta informativa en rojo sin recargar el wizard.
- [ ] El carrito se vacía tras el checkout exitoso.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/checkout/**/*.spec.ts
# Navegar a http://localhost:4200/checkout/datos-facturacion y completar el wizard
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-05` | `RN-002`, `RN-005`, `RN-007` | `P-10`, `P-11`, `P-12` | `CheckoutWizardComponent.ts` | 3, 20 |
