# Sprint-B07 — Ventas Recibidas y Gestión de Despacho de Proveedores

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-provider-sales` hacia `develop`  
> **Dependencias Previas:** `Sprint-B06_Historial_Compras_y_Detalle_Orden`

---

## 1. Objetivo del Sprint
Implementar los 2 endpoints de gestión de ventas y logística para proveedores comerciales: consulta paginada de subórdenes asignadas resultantes de compras con Split Order (`GET /api/v1/providers/me/sales`), detalle de la venta (`GET /api/v1/providers/me/sales/{subordenId}`), y la capacidad de transicionar el estado del despacho logístico (`PENDIENTE_DESPACHO` -> `EN_PREPARACION` -> `DESPACHADO` -> `ENTREGADO`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 23: `GET /api/v1/providers/me/sales?page=0&size=10` (Requiere `ROLE_PROVEEDOR`)
  * Endpoint 24: `GET /api/v1/providers/me/sales/{subordenId}` (Requiere `ROLE_PROVEEDOR`)
* **Tablas de Base de Datos:** `subordenes_factura`, `orden_items`, `ordenes`, `usuarios`.
* **Reglas de Negocio:**
  * `RN-001`: Acceso estricto restringido al rol `ROLE_PROVEEDOR`.
  * `RN-005`: Aislamiento multi-tenant (un proveedor solo puede consultar o modificar subórdenes donde `proveedor_id == usuarioAutenticado.id`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Proveedor
- [ ] `SubordenResumenDTO`: `subordenId`, `ordenId`, `codigoOrden`, `numeroComprobante`, `fechaCreacion`, `compradorNombre`, `total`, `estado`.
- [ ] `SubordenDetalleProveedorDTO`: datos de entrega del comprador, desglose de ítems despachados y comprobante.
- [ ] `CambiarEstadoDespachoDTO`: `nuevoEstado` (`EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`).

### 3.2. Servicio de Ventas (`ProviderSalesServiceImpl.java`)
- [ ] `obtenerMisVentas(Long proveedorId, Pageable pageable)`: Consulta paginada a `SubordenFacturaRepository`.
- [ ] `obtenerDetalleVenta(Long proveedorId, Long subordenId)`: Valida aislamiento; si la suborden pertenece a otro proveedor, lanzar `AccessDeniedException`.
- [ ] `actualizarEstadoDespacho(Long proveedorId, Long subordenId, EstadoSuborden nuevoEstado)`: Valida transición válida de estados y actualiza la fila en MySQL.

### 3.3. Controlador y Pruebas
- [ ] Crear `ProviderSalesController.java` con endpoints 23 y 24 (más endpoint PATCH para actualizar estado de despacho).
- [ ] Pruebas unitarias y con `@WithMockUser(roles = "PROVEEDOR")`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Un proveedor no puede ver ventas pertenecientes a otro proveedor.
- [ ] La actualización del estado de despacho se persiste en base de datos.
- [ ] Pruebas de integración pasando con código 200 OK.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=ProviderSalesControllerTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-08` | `RN-001`, `RN-005` | 23, 24 | `ProviderSalesController.java`, `ProviderSalesServiceImpl.java` |
