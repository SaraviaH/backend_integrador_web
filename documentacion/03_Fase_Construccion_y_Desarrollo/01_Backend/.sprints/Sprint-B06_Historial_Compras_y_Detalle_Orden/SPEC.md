# Sprint-B06 — Historial de Compras B2B y Detalle de Comprobantes

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`6463c36`, alineado en `45479f7` y soporte SRP en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
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
- [x] `OrdenPaginadaResponseDTO` + `OrdenResumenDTO`: `ordenId`, `codigoOrden`, `fechaEmision`, `cantidadComprobantes`, `totalGeneral`, `moneda`, `estado`.
- [x] `CheckoutResponseDTO` (reutilizado para detalle consolidado): cabecera de orden + `facturasEmitidas: List<SubordenResumenDTO>` con datos fiscales del emisor y receptor, `subtotal`, `igv`, `total`, `estado` e `items: List<OrdenItemDetalleDTO>`.

### 3.2. Lógica del Servicio
- [x] En `OrderServiceImpl` + `OrderResponseMapper`:
  * `obtenerMisOrdenes(String correoComprador, Pageable pageable)`: Consulta paginada ordenada descendente por `fechaCreacion`.
  * `obtenerDetalleOrden(String correoComprador, Long ordenId)`: Valida que la orden pertenezca al usuario autenticado; si no coincide o no existe, lanza excepción controlada.

### 3.3. Endpoints en `OrderController.java` y Pruebas
- [x] Agregados endpoints 21 y 22 en `OrderController.java`.
- [x] Tests en `OrderHistoryTest` y `OrderSecurityTest` validando contrato JSON y aislamiento entre compradores.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] Un usuario no puede consultar órdenes pertenecientes a otro comprador.
- [x] La respuesta incluye los datos completos de los comprobantes simulados para renderizar en el visor de facturas.
- [x] Tiempos de respuesta verificados bajo carga local H2/PostgreSQL dentro del objetivo de rendimiento.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=OrderHistoryTest,OrderSecurityTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-06` | `RN-001`, `RN-006` | 21, 22 | `OrderController.java`, `OrderServiceImpl.java`, `OrderResponseMapper.java` |
