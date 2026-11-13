# Sprint-F06 — Carrito Reactivo B2B y Agrupación por Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-cart-service` hacia `develop`  
> **Dependencias Previas:** `Sprint-F05_Ficha_Detalle_Producto`

---

## 1. Objetivo del Sprint
Construir el módulo y vista de carrito de compras B2B (`P-09`), gestionado de forma reactiva con Angular Signals y persistido en `localStorage`, implementando la **agrupación visual de productos por proveedor** (anticipando el Split Order), controles de incremento/decremento de cantidades mayoristas y resumen financiero en tiempo real.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-09`: Carrito (Ítems agrupados por proveedor comercial con subtotales independientes, panel sticky de liquidación contable, botón CTA hacia el checkout).
* **Reglas de Negocio:**
  * `RN-004`: Validación de stock mayorista disponible.
  * `RN-005` (UX): Agrupación transparente por proveedor en la UI.
  * `RN-008`: Cálculo en cliente de subtotales, IGV 18% y totales.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Servicio Reactivo del Carrito (`CartService.ts`)
- [ ] Estado reactivo principal: `items = signal<CartItem[]>(this.readStorage())`.
- [ ] Signals computadas:
  * `groupedByProvider = computed(...)`: Agrupa la lista plana en objetos `{ proveedorId, proveedorNombre, items, subtotal, igv, total }`.
  * `totalGeneral = computed(...)`
  * `totalCount = computed(...)`
- [ ] Operaciones: `addItem()`, `updateQuantity()`, `removeItem()`, `clearCart()`.
- [ ] Efecto `effect()` para sincronizar automáticamente cualquier cambio en `localStorage`.

### 3.2. Pantalla P-09: Carrito (`CartComponent`)
- [ ] Bloques por proveedor: Cada proveedor aparece en una tarjeta visual independiente ("Paquete A: TechnoNova Mayoristas S.A.C." con su subtotal parcial).
- [ ] Tarjeta de producto: miniatura, nombre, precio unitario, selector numérico `+`/`-`, alerta visual si la cantidad llega al tope de stock, botón de eliminar con confirmación.
- [ ] Panel lateral de resumen (Sticky): Subtotal imponible, IGV (18%), Importe total en Soles (`PEN`), botón "Iniciar Compra Mayorista" hacia `/checkout/datos-facturacion`.
- [ ] 4 Estados: Skeleton, Carrito vacío con botón "Ver Catálogo", Grid poblada, Error.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El carrito agrupa nítidamente los productos por proveedor en tarjetas independientes.
- [ ] Modificar cantidades actualiza al instante todos los montos y el badge del Header sin recarga.
- [ ] La persistencia en `localStorage` asegura que el carrito no se pierda al recargar la página.
- [ ] Cero cantidades menores a 1 o superiores al stock en base de datos.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/core/services/cart.service.spec.ts
# Abrir http://localhost:4200/carrito y verificar la agrupación multi-proveedor
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente |
| :--- | :--- | :--- | :--- |
| `RF-05` | `RN-004`, `RN-005`, `RN-008` | `P-09` | `CartComponent.ts`, `CartService.ts` |
