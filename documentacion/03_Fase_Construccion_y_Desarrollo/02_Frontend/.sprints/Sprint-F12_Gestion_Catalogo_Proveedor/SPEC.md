# Sprint-F12 — CRUD y Gestión del Catálogo de Productos del Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-provider-catalog` hacia `develop`  
> **Dependencias Previas:** `Sprint-F11_Dashboard_Proveedor_y_Perfil`

---

## 1. Objetivo del Sprint
Construir el módulo integral de gestión de catálogo de productos para proveedores comerciales: pantalla de inventario propio (`P-20`), formulario de creación de producto con especificaciones técnicas dinámicas (`P-21`), vista de inspección de producto propio (`P-22`), y formulario de edición y actualización (`P-23`), con soporte para activación/desactivación y borrado lógico (soft delete).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-20`: Mis productos (Tabla de inventario con buscador, filtro de estado, switch activo/inactivo, botón crear producto, acciones ver/editar/eliminar).
  * `P-21`: Crear producto (Formulario con SKU, nombre, categoría, subcategoría, precio PEN, stock, imágenes y FormArray de especificaciones técnicas clave-valor).
  * `P-22`: Detalle de producto propio (Ficha técnica del producto con métricas internas y botón editar).
  * `P-23`: Editar producto (Mismo formulario reactivo pre-cargado para actualización).
* **Contratos Consumidos (vía Prism Mock Server):**
  * Endpoints 7, 8, 9, 10, 11, 12
* **Reglas de Negocio:**
  * `RN-003`: Soft Delete (la eliminación cambia el estado y oculta el producto sin borrar el registro histórico de compras).
  * `RN-004`: Validación de precio mayorista y stock mayores a cero.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-20: Mis Productos (`ProviderProductsListComponent`)
- [ ] Tabla con buscador en vivo y paginación.
- [ ] Switch interactivo para alternar estado (`ACTIVO` / `INACTIVO`) mediante `PATCH /api/v1/providers/me/products/{id}/status`.
- [ ] Botón de eliminación que abre modal de confirmación antes de disparar `DELETE /api/v1/providers/me/products/{id}`.
- [ ] 4 Estados: Skeletons, Tabla con datos, Estado vacío con CTA "Publicar tu primer producto", Error.

### 3.2. Formulario de Creación y Edición (`P-21` y `P-23` - `ProductFormComponent`)
- [ ] Formulario reactivo con campos: `sku`, `nombre`, `categoriaId`, `subcategoriaId`, `precioUnitario`, `stockDisponible`, `stockMinimoAlerta`.
- [ ] FormArray dinámico para especificaciones técnicas: botones "+ Agregar Especificación" y botón eliminar fila (`clave`, `valor`).
- [ ] FormArray de imágenes con input para URL y previsualización inmediata.
- [ ] Validaciones en tiempo real: Precios > 0, Stock entero >= 0.

### 3.3. Pantalla P-22: Detalle de Producto Propio (`ProviderProductDetailComponent`)
- [ ] Vista de solo lectura con ficha completa, estado actual y enlace a edición (`P-23`).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] El FormArray permite agregar y remover especificaciones dinámicas sin errores en consola.
- [ ] La eliminación aplica soft delete y actualiza la tabla de inmediato.
- [ ] Formularios con validación visual clara de campos requeridos y numéricos.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/provider/pages/products/**/*.spec.ts
# Probar http://localhost:4200/proveedor/productos y /proveedor/productos/nuevo
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantallas | Componentes | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-07` | `RN-003`, `RN-004` | `P-20`, `P-21`, `P-22`, `P-23` | `ProviderProductsComponent.ts`, `ProductFormComponent.ts` | 7 a 12 |
