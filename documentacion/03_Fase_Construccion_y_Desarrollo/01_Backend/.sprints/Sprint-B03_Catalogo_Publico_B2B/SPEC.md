# Sprint-B03 — Catálogo Público B2B y Ficha Técnica de Producto

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-public-catalog` hacia `develop`  
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
  * `RN-004`: Validación de precios y stocks en moneda PEN.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. DTOs de Salida
- [ ] `ProductoCardDTO`: `id`, `uuid`, `nombre`, `sku`, `precioUnitario`, `moneda`, `stockDisponible`, `proveedorNombre`, `urlImagenPrincipal`.
- [ ] `ProductoDetalleResponseDTO`: incluye la lista completa de `EspecificacionDTO` y `ImagenDTO`.
- [ ] Envoltorio de paginación estándar: `contenido`, `pagina`, `tamano`, `totalElementos`, `totalPaginas`, `esUltima`.

### 3.2. Repositorio con JPA Specification
- [ ] Implementar `ProductoSpecification.java`:
  * Predicado `fechaEliminacion IS NULL`.
  * Predicado `estado = ACTIVO`.
  * Filtro `nombre LIKE %search% OR sku LIKE %search%`.
  * Filtro `categoria_id = :categoryId`.
- [ ] Consulta optimizada para evitar N+1 en especificaciones e imágenes (`@BatchSize`).

### 3.3. Controlador y Pruebas
- [ ] Crear `ProductoPublicoController.java` con endpoints 18 y 19.
- [ ] Manejo de 404 Not Found si el ID de producto no existe o está eliminado.
- [ ] Tests con `MockMvc` probando filtros combinados y paginación.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] `GET /api/v1/products` pagina correctamente a 12 elementos por defecto.
- [ ] La búsqueda por texto es insensible a mayúsculas y filtra por nombre o SKU.
- [ ] Los productos eliminados lógicamente nunca son devueltos por el catálogo público.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=ProductoPublicoControllerTest
curl -i "http://localhost:8080/api/v1/products?search=laptop&page=0&size=5"
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-03`, `RF-04` | `RN-003`, `RN-004` | 18, 19 | `ProductoPublicoController.java`, `ProductoSpecification.java` |
