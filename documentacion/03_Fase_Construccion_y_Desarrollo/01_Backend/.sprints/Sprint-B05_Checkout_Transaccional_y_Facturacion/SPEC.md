# Sprint-B05 — Checkout Transaccional, Split Order ACID y Facturación

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`a8a8b03`, correlativos en `45479f7` y soporte SRP en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
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
  * `RN-006`: **Factura Simulada:** Generación de correlativo persistente único `SIM-F001-%08d` y código `PED-2026-%06d`, desglose fiscal (Base Imponible + IGV 18% = Total) y congelamiento de precio unitario en `orden_items`.
  * `RN-007`: **Prohibición de Auto-Compra:** Si el comprador es dueño de alguno de los productos, abortar con `400 Bad Request` (`AutoCompraException`).
  * `RN-008`: **Recálculo de Montos en Backend:** El backend ignora precios del cliente; toma el precio vigente en BD y valida/descuenta el inventario disponible.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs del Checkout
- [x] `CheckoutRequestDTO` + `DatosFacturacionDTO` + `CheckoutItemDTO`: `datosFacturacion` (`tipoComprobante`, `rucReceptor`, `razonSocialReceptor`, `direccionFiscal`, `metodoPagoSimulado`) y `items: List<CheckoutItemDTO>` (`productoId`, `cantidad`).
- [x] `CheckoutResponseDTO`: `ordenId`, `codigoOrden`, `fechaEmision`, `moneda`, `totalGeneral`, `esSimulado`, `facturasEmitidas: List<SubordenResumenDTO>`.

### 3.2. Lógica del Servicio (`OrderServiceImpl` + `SplitOrderCalculator` + `OrderResponseMapper`)
- [x] Validar comprador autenticado desde `Authentication.getName()`.
- [x] Bloque `@Transactional(rollbackFor = Exception.class)` + `@Auditable(accion = "ORDER_CHECKOUT_SPLIT")`:
  1. Validar `items` no vacío y existencia de productos en BD.
  2. Validar `RN-007` en `SplitOrderCalculator`: si el dueño coincide con el comprador -> `AutoCompraException`.
  3. Validar stock en `SplitOrderCalculator`: si `stockDisponible < cantidad` -> `StockInsuficienteException`.
  4. Descontar stock en `productos`.
  5. Agrupar ítems por proveedor (`proveedor_id`), calcular `subtotal`, `igv` (18% `RoundingMode.HALF_UP`) y `total`, generar correlativos `PED-2026-%06d` / `SIM-F001-%08d` vía `MAX(id)`, y construir `Orden` + `SubordenFactura` + `OrdenItem` con precio congelado.
  6. Persistir `Orden` maestra y mapear respuesta mediante `OrderResponseMapper`.

### 3.3. Controlador y Pruebas Unitarias / Integración
- [x] Creado `OrderController.java` con endpoint 20 (`POST /api/v1/orders/checkout` -> `201 Created`).
- [x] Pruebas en `OrderServiceSplitOrderTest` y `OrderControllerTest`:
  * Caso feliz multi-proveedor (genera 1 orden y N subórdenes).
  * Caso de auto-compra (`AutoCompraException` -> `400`).
  * Caso de stock insuficiente (`StockInsuficienteException` con rollback verificado).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] El checkout con productos de 2 proveedores genera exactamente 1 registro en `ordenes`, 2 en `subordenes_factura` y N en `orden_items`.
- [x] El stock de los productos comprados se descuenta en PostgreSQL / H2 modo PostgreSQL.
- [x] Ante cualquier falla (ej. stock), se ejecuta rollback completo sin registros huérfanos.
- [x] Auto-compra rechazada con `400 Bad Request`.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=OrderServiceSplitOrderTest,OrderControllerTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Reglas de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-05`, `RF-06` | `RN-005`, `RN-006`, `RN-007`, `RN-008` | 20 | `OrderController.java`, `OrderServiceImpl.java`, `SplitOrderCalculator.java`, `OrderResponseMapper.java` |
