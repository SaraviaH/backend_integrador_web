# Sprint-B03 — Pedidos, Split Order ACID y Facturación Simulada

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-orders-split-order` hacia `develop`  
> **Dependencias Previas:** `Sprint-B02_Catalogo_y_Productos`

---

## 1. Objetivo del Sprint
Implementar el motor transaccional de compras B2B y el patrón arquitectural **Split Order**, garantizando que una orden global con productos de múltiples proveedores se descomponga atómicamente en N subórdenes/facturas simuladas individuales (una por cada proveedor), con recálculo estricto de montos en servidor (IGV 18%), validación de stock, congelamiento histórico de precios y prohibición de auto-compra.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 20: `POST /api/v1/orders/checkout`
  * Endpoint 21: `GET /api/v1/orders/me?page=0&size=10`
  * Endpoint 22: `GET /api/v1/orders/me/{ordenId}`
* **Tablas de Base de Datos:** `ordenes`, `subordenes_factura`, `orden_items`, `productos`.
* **Reglas de Negocio:**
  * `RN-005`: **Split Order ACID:** Creación atómica de 1 `Orden` y N `SubordenFactura` dentro de `@Transactional(rollbackFor = Exception.class)`. Si un producto falla, todo el pedido hace rollback.
  * `RN-006`: **Factura Simulada:** Generación de correlativo único `F001-%08d`, desglose contable (Base Imponible + IGV 18% = Total) y congelamiento del precio unitario en `orden_items`.
  * `RN-007`: **Prohibición de Auto-Compra:** Si el comprador es proveedor de alguno de los productos del carrito, la transacción se aborta con `400 Bad Request`.
  * `RN-008`: **Recálculo de Montos en Backend:** El backend ignora cualquier precio enviado por el cliente; consulta el precio oficial en BD, valida stock disponible y descuenta el inventario de forma segura.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Entidades JPA de Pedidos
- [ ] Entidad `Orden.java`: Mapeo de `ordenes` (`id`, `uuid`, `codigoOrden`, `comprador`, `estado`, `montoSubtotal`, `montoIgv`, `montoTotal`, `rucReceptor`, `razonSocialReceptor`, `direccionFiscal`, `fechaCreacion`).
- [ ] Entidad `SubordenFactura.java`: Mapeo de `subordenes_factura` (`orden`, `proveedor`, `numeroComprobante`, `estado`, `subtotal`, `igv`, `total`).
- [ ] Entidad `OrdenItem.java`: Mapeo de `orden_items` (`suborden`, `producto`, `cantidad`, `precioUnitario`, `subtotal`).

### 3.2. Lógica del Servicio de Checkout (`OrderServiceImpl.java`)
- [ ] Validar usuario comprador autenticado desde el `SecurityContext`.
- [ ] Para cada ítem del `CheckoutRequestDTO`:
  * Cargar `Producto` desde la BD con bloqueo pesimista o verificación de versión para evitar condiciones de carrera.
  * Validar `RN-007`: `producto.getProveedor().getId().equals(comprador.getId())` -> lanzar `AutoCompraException`.
  * Validar stock: `producto.getStockDisponible() >= item.getCantidad()` -> lanzar `StockInsuficienteException`.
  * Descontar stock disponible: `producto.setStockDisponible(stock - cantidad)`.
- [ ] Agrupar ítems por `proveedor_id` (Map<Long, List<ItemDTO>>).
- [ ] Calcular montos por proveedor:
  * `subtotalSuborden = SUM(precioUnitario * cantidad)`
  * `igvSuborden = subtotalSuborden * 0.18`
  * `totalSuborden = subtotalSuborden + igvSuborden`
- [ ] Generar correlativo de factura simulada (`F001-00000001`, etc.).
- [ ] Persistir la entidad `Orden` maestra y las `SubordenFactura` con sus respectivos `OrdenItem`.

### 3.3. Consultas e Historial de Pedidos
- [ ] `GET /api/v1/orders/me`: Consulta paginada de órdenes del comprador autenticado.
- [ ] `GET /api/v1/orders/me/{ordenId}`: Detalle de orden con la lista completa de comprobantes simulados y productos comprados.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Carrito con 3 productos de 2 proveedores genera en MySQL:
  * 1 fila en `ordenes`.
  * 2 filas en `subordenes_factura` (cada una con su `numero_comprobante` único).
  * 3 filas en `orden_items`.
- [ ] El stock de los productos comprados se descuenta exactamente en la cantidad adquirida.
- [ ] Si un ítem excede el stock, la transacción falla completa y no se persiste ninguna orden ni se descuenta inventario (Rollback total).
- [ ] Intento de auto-compra devuelve `400 Bad Request` con mensaje descriptivo `{"mensaje": "No puede adquirir sus propios productos publicados"}`.
- [ ] El desglose matemático de IGV es exacto con redondeo bancario a 2 decimales (`RoundingMode.HALF_UP`).

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas de integración transaccional
cd compunex-backend
mvn test -Dtest=OrderServiceSplitOrderTest,OrderControllerTest

# Prueba con curl de checkout multi-proveedor
curl -X POST http://localhost:8080/api/v1/orders/checkout \
  -H "Authorization: Bearer <token_cliente>" \
  -H "Content-Type: application/json" \
  -d '{
    "rucReceptor": "20456789012",
    "razonSocialReceptor": "Corporación Digital Mayorista S.A.C.",
    "direccionFiscal": "Av. República de Panamá 3055, San Isidro, Lima",
    "items": [
      {"productoId": 1, "cantidad": 5},
      {"productoId": 2, "cantidad": 2}
    ]
  }'
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Reglas de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-05` (Carrito y Checkout) | `RN-005`, `RN-007`, `RN-008` | 20 | `OrderController.java`, `OrderServiceImpl.java` |
| `RF-06` (Comprobantes Simulados) | `RN-006` | 21, 22 | `SubordenFactura.java`, `OrdenItem.java` |
