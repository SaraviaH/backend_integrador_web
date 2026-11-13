# Sprint-B03 — Catálogo Público B2B y Ficha Técnica de Producto

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`2e576f7`, alineado en `45479f7` y refactorizado en `03107f8`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B02_Auth_Aditivo_Empresa_y_Activacion`

---

## 1. Objetivo del Sprint
Implementar los 2 endpoints aditivos de consulta pública del catálogo comercial B2B: búsqueda paginada y facetada de productos con filtros dinámicos (`GET /api/v1/products`), y consulta de la ficha técnica detallada de cada producto (`GET /api/v1/products/{id}`) con especificaciones e imágenes, excluyendo productos eliminados (soft delete).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 18: `GET /api/v1/products?search=&categoryId=&page=0&size=12` (Público)
  * Endpoint 19: `GET /api/v1/products/{id}` (Público)
* **Tablas de Base de Datos:** `productos`, `categorias`, `producto_especificaciones`, `imagenes_producto`.
* **Reglas de Negocio:**
  * `RN-003`: Soft Delete (excluir de la consulta pública productos con `fecha_eliminacion != null` o `estado != 'ACTIVO'`).
  * `RN-004`: Validación de precios en PEN/moneda configurada y exposición de `stockDisponible`.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Salida
- [x] `ProductoPublicoItemDTO`: `id`, `uuid`, `titulo`, datos comerciales, `precioUnitario`, `moneda`, `stockDisponible`, `proveedor` e imagen principal.
- [x] `ProductoPublicoDetalleDTO`: ficha técnica completa con lista de especificaciones, galería de imágenes e información del proveedor.
- [x] `ProductoPublicoPaginadoResponseDTO`: envoltorio `contenido`, `pagina`, `tamano`, `totalElementos`, `totalPaginas`, `esUltima`.

### 3.2. Repositorio con JPA Specification y Servicio Público
- [x] Implementado `ProductoSpecification.java`:
  * Predicado `fechaEliminacion IS NULL`.
  * Predicado `estado = ACTIVO`.
  * Filtro insensible a mayúsculas sobre `titulo` o `descripcion` (`LIKE %search%`).
  * Filtro `categoria.id = :categoryId`.
- [x] Servicio dedicado `ProductoPublicoService` / `ProductoPublicoServiceImpl` (segregado bajo Opción B SRP).

### 3.3. Controlador y Pruebas
- [x] Creado `ProductoPublicoController.java` con endpoints 18 y 19.
- [x] Manejo de `404 Not Found` cuando el producto no existe o está eliminado.
- [x] Tests con `MockMvc` en `ProductoPublicoControllerTest` probando filtros, paginación y ocultamiento de eliminados.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] `GET /api/v1/products` pagina correctamente a 12 elementos por defecto.
- [x] La búsqueda por texto es insensible a mayúsculas y filtra por título o descripción.
- [x] Los productos eliminados lógicamente nunca son devueltos por el catálogo público.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=ProductoPublicoControllerTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-03`, `RF-04` | `RN-003`, `RN-004` | 18, 19 | `ProductoPublicoController.java`, `ProductoPublicoServiceImpl.java`, `ProductoSpecification.java` |
