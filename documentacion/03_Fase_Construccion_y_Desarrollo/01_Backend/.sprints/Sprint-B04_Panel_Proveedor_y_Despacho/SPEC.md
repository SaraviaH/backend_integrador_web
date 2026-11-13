# Sprint-B04 — Gestión de Proveedor y Panel de Despacho

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-provider-management` hacia `develop`  
> **Dependencias Previas:** `Sprint-B03_Carrito_y_Split_Order`

---

## 1. Objetivo del Sprint
Implementar los endpoints privados para proveedores autenticados (`ROLE_PROVEEDOR`), permitiendo el CRUD completo de su catálogo de productos propio con soft-delete, la visualización de sus ventas recibidas (subórdenes asignadas resultantes de órdenes Split-Order) y el flujo de despacho y actualización de estados (`PENDIENTE_DESPACHO` -> `EN_PREPARACION` -> `DESPACHADO` -> `ENTREGADO`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 7: `GET /api/v1/providers/me/products?search=&page=0&size=10`
  * Endpoint 8: `GET /api/v1/providers/me/products/{id}`
  * Endpoint 9: `POST /api/v1/providers/me/products`
  * Endpoint 10: `PUT /api/v1/providers/me/products/{id}`
  * Endpoint 11: `PATCH /api/v1/providers/me/products/{id}/status`
  * Endpoint 12: `DELETE /api/v1/providers/me/products/{id}` (Soft Delete)
  * Endpoint 23: `GET /api/v1/providers/me/sales?page=0&size=10`
  * Endpoint 24: `GET /api/v1/providers/me/sales/{subordenId}`
* **Tablas de Base de Datos:** `productos`, `producto_especificaciones`, `imagenes_producto`, `subordenes_factura`, `orden_items`.
* **Reglas de Negocio:**
  * `RN-001`: Control de acceso por rol (`ROLE_PROVEEDOR`).
  * `RN-003`: Borrado lógico (Soft delete) mediante `fecha_eliminacion` y `eliminado_por`.
  * `RN-004`: Validación de precio y stock mayor a cero.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Aislamiento y Seguridad Multitenant de Proveedor
- [ ] Implementar verificación en capa de servicio: un proveedor solo puede ver, modificar o eliminar productos cuyo `proveedor_id == usuarioAutenticado.id`.
- [ ] Si intenta acceder a un producto o suborden ajena, lanzar `AccessDeniedException` o `ResourceNotFoundException`.

### 3.2. CRUD de Productos Propios
- [ ] `POST /api/v1/providers/me/products`: Creación de producto con generación de SKU único, persistencia en cascada de especificaciones clave-valor y URLs de imágenes.
- [ ] `PUT /api/v1/providers/me/products/{id}`: Actualización integral de datos, precios y stock.
- [ ] `PATCH /api/v1/providers/me/products/{id}/status`: Activación/desactivación manual de disponibilidad (`ACTIVO` / `INACTIVO`).
- [ ] `DELETE /api/v1/providers/me/products/{id}`: Aplicar soft delete: `producto.setFechaEliminacion(LocalDateTime.now())` y `producto.setEliminadoPor(usuario.getCorreo())`.

### 3.3. Panel de Ventas y Gestión de Despacho
- [ ] `GET /api/v1/providers/me/sales`: Consulta paginada de las `SubordenFactura` asociadas al proveedor logueado, ordenadas cronológicamente de la más reciente a la más antigua.
- [ ] `GET /api/v1/providers/me/sales/{subordenId}`: Detalle de suborden con datos del receptor, desglose de ítems, precio unitario congelado y comprobante simulado.
- [ ] Endpoint de transición de estado de suborden (`PENDIENTE_DESPACHO` a `EN_PREPARACION` a `DESPACHADO`).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Un proveedor no puede ver ni modificar productos pertenecientes a otro proveedor.
- [ ] La eliminación de un producto no borra la fila física de MySQL; establece `fecha_eliminacion` y no rompe la integridad referencial de compras históricas.
- [ ] Las ventas recibidas muestran únicamente los productos de ese proveedor, respetando el Split Order.
- [ ] Pruebas `@WithMockUser(roles = "PROVEEDOR")` pasan al 100%.

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas automatizadas de proveedor
cd compunex-backend
mvn test -Dtest=ProviderProductControllerTest,ProviderSalesControllerTest

# Probar soft delete
curl -X DELETE http://localhost:8080/api/v1/providers/me/products/1 \
  -H "Authorization: Bearer <token_proveedor>"
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-07` (Catálogo Proveedor) | `RN-003`, `RN-004` | 7, 8, 9, 10, 11, 12 | `ProviderProductController.java` |
| `RF-08` (Despacho Proveedor) | `RN-005`, `RN-006` | 23, 24 | `ProviderSalesController.java` |
