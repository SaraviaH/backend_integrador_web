# Sprint-B06 — Historial de Compras B2B y Detalle de Comprobantes

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-orders-history` hacia `develop`  
> **Dependencias Previas:** `Sprint-B05_Checkout_Transaccional_y_Facturacion`

---

## 1. Objetivo del Sprint
Implementar los 2 endpoints de consulta y trazabilidad para compradores mayoristas: listado paginado de órdenes realizadas (`GET /api/v1/orders/me`), y consulta en profundidad de una orden específica (`GET /api/v1/orders/me/{ordenId}`) con el desglose de sus subórdenes, estados de despacho por paquete y comprobantes fiscales simulados emitidos.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 21: `GET /api/v1/orders/me?page=0&size=10` (Autenticado)
  * Endpoint 22: `GET /api/v1/orders/me/{ordenId}` (Autenticado)
* **Tablas de Base de Datos:** `ordenes`, `subordenes_factura`, `orden_items`, `perfiles_proveedor`.
* **Reglas de Negocio:**
  * `RN-001`: Acceso restringido al comprador dueño de la orden.
  * `RN-006`: Exposición de datos de facturas simuladas con precios históricos congelados.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Respuesta
- [ ] `OrdenResumenDTO`: `ordenId`, `codigoOrden`, `fechaCreacion`, `cantidadSubordenes`, `montoTotal`, `estado`.
- [ ] `OrdenDetalleResponseDTO`: datos fiscales del receptor, cabecera de la orden y lista de `SubordenDetalleDTO`:
  * `subordenId`, `proveedorNombre`, `proveedorRuc`, `numeroComprobante`, `subtotal`, `igv`, `total`, `estado`, `items: List<OrdenItemDetalleDTO>`.

### 3.2. Lógica del Servicio
- [ ] En `OrderServiceImpl`:
  * `obtenerMisOrdenes(Long compradorId, Pageable pageable)`: Consulta paginada ordenada descendente por fecha.
  * `obtenerDetalleOrden(Long compradorId, Long ordenId)`: Valida que la orden pertenezca al usuario autenticado; si no coincide, lanzar `ResourceNotFoundException` o `AccessDeniedException`.

### 3.3. Endpoints en `OrderController.java` y Pruebas
- [ ] Agregar endpoints 21 y 22.
- [ ] Tests con `MockMvc` validando el formato de respuesta JSON y la seguridad por token.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Un usuario no puede consultar órdenes pertenecientes a otro comprador.
- [ ] La respuesta incluye los datos completos de los comprobantes simulados para renderizar en el visor de facturas.
- [ ] Tiempos de respuesta inferiores a 100ms en local.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=OrderHistoryTest,OrderSecurityTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-06` | `RN-001`, `RN-006` | 21, 22 | `OrderController.java`, `OrderServiceImpl.java` |
