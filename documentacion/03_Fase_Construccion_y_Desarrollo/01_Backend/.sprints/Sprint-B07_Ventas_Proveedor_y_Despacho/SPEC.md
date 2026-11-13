# Sprint-B07 — Ventas Recibidas y Gestión de Despacho de Proveedores

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`e91833a`, alineado en `45479f7`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B06_Historial_Compras_y_Detalle_Orden`

---

## 1. Objetivo del Sprint
Implementar los endpoints de gestión de ventas y logística para proveedores comerciales: consulta paginada de subórdenes asignadas resultantes de compras con Split Order (`GET /api/v1/providers/me/sales`), detalle de la venta (`GET /api/v1/providers/me/sales/{subordenId}`), y la capacidad de transicionar el estado del despacho logístico (`PENDIENTE_DESPACHO` -> `EN_PREPARACION` -> `DESPACHADO` -> `ENTREGADO`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 23: `GET /api/v1/providers/me/sales?page=0&size=10` (Requiere `ROLE_PROVEEDOR`)
  * Endpoint 24: `GET /api/v1/providers/me/sales/{subordenId}` (Requiere `ROLE_PROVEEDOR`)
  * Endpoint 24b: `PATCH /api/v1/providers/me/sales/{subordenId}/status` (Requiere `ROLE_PROVEEDOR`)
* **Tablas de Base de Datos:** `subordenes_factura`, `orden_items`, `ordenes`, `usuarios`.
* **Reglas de Negocio:**
  * `RN-001`: Acceso estricto restringido al rol `ROLE_PROVEEDOR`.
  * `RN-005`: Aislamiento multi-tenant (un proveedor solo puede consultar o modificar subórdenes donde `proveedor_id == usuarioAutenticado.id`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Proveedor
- [x] `VentaPaginadaResponseDTO` + `VentaResumenDTO`: `subordenId`, `ordenId`, `codigoOrden`, `numeroComprobante`, `fechaEmision`, `compradorNombre`, `rucComprador`, `total`, `estado`.
- [x] `SubordenDetalleProveedorDTO`: datos del receptor (`ReceptorFacturaDTO`), desglose de ítems despachados (`subtotalLinea`) y comprobante.
- [x] `CambiarEstadoDespachoDTO`: `nuevoEstado` (`EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`, etc.).

### 3.2. Servicio de Ventas (`ProviderSalesServiceImpl.java`)
- [x] `obtenerMisVentas(String correoProveedor, Pageable pageable)`: Consulta paginada a `SubordenFacturaRepository`.
- [x] `obtenerDetalleVenta(String correoProveedor, Long subordenId)`: Valida aislamiento multi-tenant entre proveedores.
- [x] `actualizarEstadoDespacho(String correoProveedor, Long subordenId, EstadoSuborden nuevoEstado)`: Valida transición válida y persiste el cambio de estado.

### 3.3. Controlador y Pruebas
- [x] Creado `ProviderSalesController.java` con endpoints 23, 24 y `PATCH /{subordenId}/status`.
- [x] Pruebas de integración en `ProviderSalesControllerTest` con roles `PROVEEDOR` y validación multi-tenant.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] Un proveedor no puede ver ni alterar ventas pertenecientes a otro proveedor.
- [x] La actualización del estado de despacho se persiste en base de datos.
- [x] Pruebas de integración pasando con código `200 OK`.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=ProviderSalesControllerTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-08` | `RN-001`, `RN-005` | 23, 24, 24b | `ProviderSalesController.java`, `ProviderSalesServiceImpl.java` |
