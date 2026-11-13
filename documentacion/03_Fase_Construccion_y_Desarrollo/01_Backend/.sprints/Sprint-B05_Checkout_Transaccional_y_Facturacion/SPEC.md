# Sprint-B05 — Checkout Transaccional, Split Order ACID y Facturación

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-checkout-split-order` hacia `develop`  
> **Dependencias Previas:** `Sprint-B04_Persistencia_Ordenes_y_Split_Order`

---

## 1. Objetivo del Sprint
Implementar el motor transaccional de compras B2B: el endpoint `POST /api/v1/orders/checkout` bajo el patrón **Split Order ACID**, asegurando que un pedido con productos de múltiples proveedores se descomponga atómicamente en N subórdenes/facturas simuladas individuales con recálculo estricto en servidor (IGV 18%), validación de stock, congelamiento de precios históricos y prohibición de auto-compra.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 20: `POST /api/v1/orders/checkout`
* **Tablas de Base de Datos:** `ordenes`, `subordenes_factura`, `orden_items`, `productos`.
* **Reglas de Negocio:**
  * `RN-005`: **Split Order ACID:** Creación atómica de 1 `Orden` y N `SubordenFactura` con `@Transactional(rollbackFor = Exception.class)`. Si falla un ítem, toda la orden hace rollback.
  * `RN-006`: **Factura Simulada:** Generación de correlativo único `F001-%08d`, desglose fiscal (Base Imponible + IGV 18% = Total) y congelamiento de precio unitario en `orden_items`.
  * `RN-007`: **Prohibición de Auto-Compra:** Si el comprador es dueño de alguno de los productos, abortar con `400 Bad Request` y mensaje claro.
  * `RN-008`: **Recálculo de Montos en Backend:** El backend ignora precios del cliente; toma el precio vigente en BD y valida/descuenta el inventario disponible.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs del Checkout
- [ ] `CheckoutRequestDTO`: `rucReceptor`, `razonSocialReceptor`, `direccionFiscal`, `items: List<CheckoutItemDTO>` (`productoId`, `cantidad`).
- [ ] `CheckoutResponseDTO`: `ordenId`, `codigoOrden`, `montoTotal`, `subordenes: List<SubordenResumenDTO>`.

### 3.2. Lógica del Servicio (`OrderServiceImpl.java`)
- [ ] Validar comprador autenticado desde `SecurityContext`.
- [ ] Bloque `@Transactional`:
  1. Validar `items` no vacío.
  2. Para cada ítem: cargar `Producto` de BD.
  3. Validar `RN-007`: Si `producto.getProveedor().getId().equals(comprador.getId())` -> lanzar `AutoCompraException`.
  4. Validar stock: Si `producto.getStockDisponible() < item.getCantidad()` -> lanzar `StockInsuficienteException`.
  5. Descontar stock: `producto.setStockDisponible(stock - cantidad)`.
  6. Agrupar ítems por `proveedor_id`.
  7. Por cada proveedor:
     * Generar correlativo de factura simulada (`F001-%08d`).
     * Calcular `subtotal = SUM(precioUnitario * cantidad)`.
     * Calcular `igv = subtotal * 0.18` (redondeo `HALF_UP`).
     * Calcular `total = subtotal + igv`.
     * Crear `SubordenFactura` y sus `OrdenItem` congelando el `precioUnitario`.
  8. Sumar totales y persistir la `Orden` maestra vinculada a sus subórdenes.

### 3.3. Controlador y Pruebas Unitarias / Integración
- [ ] Crear `OrderController.java` con endpoint 20.
- [ ] Pruebas unitarias de `OrderService`:
  * Caso feliz multi-proveedor (genera 1 orden y 2 subórdenes).
  * Caso de auto-compra (lanza excepción y responde 400).
  * Caso de stock insuficiente (lanza excepción y verifica que nada se guarde en BD).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El checkout con productos de 2 proveedores genera exactamente 1 registro en `ordenes`, 2 en `subordenes_factura` y N en `orden_items`.
- [ ] El stock de los productos comprados se descuenta en MySQL.
- [ ] Ante cualquier falla (ej. stock), se ejecuta rollback completo sin registros huérfanos.
- [ ] Auto-compra es rechazada con `400 Bad Request`.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=OrderServiceSplitOrderTest,OrderControllerTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Reglas de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-05`, `RF-06` | `RN-005`, `RN-006`, `RN-007`, `RN-008` | 20 | `OrderController.java`, `OrderServiceImpl.java` |
