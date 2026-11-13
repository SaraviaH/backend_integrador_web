# Sprint-F03 — Carrito Reactivo B2B y Agrupación por Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-reactive-cart` hacia `develop`  
> **Dependencias Previas:** `Sprint-F02_Catalogo_y_Detalle`

---

## 1. Objetivo del Sprint
Construir el módulo de carrito de compras B2B (`P-09`), gestionado de forma reactiva con Angular Signals y persistido en `localStorage`, implementando la **agrupación visual automática de ítems por proveedor** (preparando la experiencia del Split Order), controles de incremento/decremento de cantidades mayoristas con validación de stock y resumen financiero en tiempo real.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-09`: Carrito (Listado de ítems agrupados por proveedor comercial, panel lateral de resumen financiero, botones de acción mayorista).
* **Servicios e Interfaces:**
  * `CartItem`: `{ productoId, sku, nombre, precioUnitario, cantidad, stockDisponible, proveedorId, proveedorNombre, urlImagen }`.
  * `CartGroup`: `{ proveedorId, proveedorNombre, items: CartItem[], subtotal, igv, total }`.
* **Reglas de Negocio:**
  * `RN-004`: Validación de stock mayorista.
  * `RN-005` (UX): Agrupación transparente por proveedor comercial para anticipar la generación de comprobantes independientes.
  * `RN-008`: Cálculo en frontend de subtotales para visualización interactiva.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Servicio Reactivo del Carrito (`CartService.ts`)
- [ ] Estado reactivo principal:
  ```typescript
  items = signal<CartItem[]>(this.loadFromStorage());
  ```
- [ ] Signals computadas derivadas:
  * `totalItemsCount = computed(() => this.items().reduce((acc, item) => acc + item.cantidad, 0))`: actualiza el badge del Header.
  * `groupedByProvider = computed(() => this.groupItemsByProvider(this.items()))`: agrupa la lista por `proveedorId`.
  * `subtotalGeneral = computed(...)`
  * `igvGeneral = computed(() => this.subtotalGeneral() * 0.18)`
  * `totalGeneral = computed(() => this.subtotalGeneral() + this.igvGeneral())`
- [ ] Métodos del servicio: `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`.
- [ ] Persistencia sincronizada mediante `effect()` hacia `localStorage.getItem('compunex_cart')`.

### 3.2. Componente de Vista de Carrito (`CartComponent` - `P-09`)
- [ ] Componente standalone con los 4 estados:
  * **Carga:** Skeleton de bloques mientras se hidrata el estado.
  * **Vacío:** Ilustración amigable de carrito vacío con mensaje "Tu carrito mayorista no tiene productos" y botón CTA "Explorar Catálogo" hacia `/catalogo`.
  * **Con Datos:**
    * Grilla izquierda: Tarjetas separadas por cada proveedor ("Despacho de: TechnoNova Mayoristas S.A.C." con su subtotal de paquete).
    * Dentro de cada proveedor: lista de productos, miniatura, precio unitario, botones `+` / `-`, input numérico, botón eliminar ítem.
    * Panel derecho flotante (Sticky): Desglose contable (Subtotal, IGV 18%, Total PEN) y botón "Continuar al Checkout" hacia `/checkout/datos-facturacion`.
  * **Error:** Alerta en caso de inconsistencia con acción de restablecer.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El carrito agrupa claramente los productos por proveedor en bloques visualmente independientes.
- [ ] Modificar una cantidad actualiza instantáneamente el subtotal del proveedor, el total general y el badge del Header sin recargar la página.
- [ ] El estado del carrito sobrevive a recargas completas de página (`F5`) gracias a `localStorage`.
- [ ] No permite seleccionar cantidades menores a 1 ni superiores al stock disponible del producto.
- [ ] La eliminación del último ítem transiciona limpiamente a la vista de carrito vacío.

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas unitarias de CartService
ng test --include=src/app/core/services/cart.service.spec.ts

# Prueba visual en navegador
# Agregar 2 productos de TechnoNova y 1 de Innova PC desde el catálogo
# Navegar a http://localhost:4200/carrito y verificar que existan 2 bloques de proveedor
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente Angular |
| :--- | :--- | :--- | :--- |
| `RF-05` | `RN-004`, `RN-005`, `RN-008` | `P-09` | `CartComponent.ts`, `CartGroupComponent.ts`, `CartService.ts` |
