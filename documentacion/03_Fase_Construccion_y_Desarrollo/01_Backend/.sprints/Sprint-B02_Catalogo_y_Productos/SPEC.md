# Sprint-B02 — Catálogo B2B y Consulta Pública de Productos

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-catalog-products` hacia `develop`  
> **Dependencias Previas:** `Sprint-B01_Auth_y_Seguridad`

---

## 1. Objetivo del Sprint
Implementar los servicios y endpoints públicos del catálogo B2B, permitiendo la exploración de categorías tecnológicas, búsqueda facetada por texto y categoría con paginación optimizada, y la consulta de la ficha técnica detallada de cada producto con sus especificaciones y galería de imágenes, excluyendo productos eliminados o inactivos.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Contratos Afectados (`CONTRATOS_JSON.md`):**
  * Endpoint 5: `GET /api/v1/categories` (Público)
  * Endpoint 6: `GET /api/v1/categories/{id}` (Público)
  * Endpoint 18: `GET /api/v1/products?search=&categoryId=&page=0&size=12` (Público)
  * Endpoint 19: `GET /api/v1/products/{id}` (Público)
* **Tablas de Base de Datos:** `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`.
* **Reglas de Negocio:**
  * `RN-003`: Soft Delete (los productos con `fecha_eliminacion != null` o `estado != 'ACTIVO'` no deben mostrarse en el catálogo público).
  * `RN-004`: Validación de precios y stocks mayores a cero en moneda PEN.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Entidades JPA y Mapeos Relacionales
- [ ] Entidad `Categoria.java`: Mapeo de `categorias` con relación 1:N hacia `Subcategoria`.
- [ ] Entidad `Subcategoria.java`: Mapeo de `subcategorias`.
- [ ] Entidad `Producto.java`: Mapeo de `productos` con `@ManyToOne` a `Usuario` (proveedor), `@ManyToOne` a `Categoria`, `@OneToMany` a `ProductoEspecificacion` y `@OneToMany` a `ImagenProducto` con `@BatchSize(size = 20)`.
- [ ] Entidades `ProductoEspecificacion.java` e `ImagenProducto.java`.

### 3.2. Repositorios y Consultas Paginadas
- [ ] `CategoriaRepository.java`: `findAllByActivoTrueOrderByOrdenAsc()`.
- [ ] `ProductoRepository.java`: Consulta con `Specification` o `@Query` dinámica:
  ```java
  Page<Producto> findByEstadoAndFechaEliminacionIsNullAndFiltros(
      EstadoProducto estado, String search, String categoryId, Pageable pageable
  );
  ```
- [ ] Configuración de índices en BD para optimizar búsquedas por `nombre`, `sku` y `categoria_id`.

### 3.3. DTOs y Mappers
- [ ] DTOs de salida: `CategoriaResponseDTO`, `CategoriaDetalleResponseDTO`, `ProductoCardDTO`, `ProductoDetalleResponseDTO`, `EspecificacionDTO`, `ImagenProductoDTO`.
- [ ] DTO envoltorio de paginación estándar:
  ```json
  {
    "contenido": [...],
    "pagina": 0,
    "tamano": 12,
    "totalElementos": 48,
    "totalPaginas": 4,
    "esUltima": false
  }
  ```

### 3.4. Servicios y Controladores
- [ ] `CategoriaService.java` y `CategoriaController.java`: Endpoints 5 y 6.
- [ ] `ProductoPublicoService.java` y `ProductoPublicoController.java`: Endpoints 18 y 19.
- [ ] Manejo de `ResourceNotFoundException` -> 404 cuando el ID de producto o categoría no existe.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] `GET /api/v1/categories` devuelve la lista ordenada de categorías activas con subcategorías anidadas.
- [ ] `GET /api/v1/products` filtra correctamente por texto (insensible a mayúsculas) y por categoría, paginando a 12 elementos por defecto.
- [ ] Los productos en estado `INACTIVO` o marcados con soft-delete no aparecen en los resultados del catálogo público.
- [ ] `GET /api/v1/products/{id}` incluye la lista completa de especificaciones clave-valor y la lista de imágenes con `esPrincipal` destacado.
- [ ] Respuestas con tiempos de ejecución menores a 150ms en base local.

---

## 5. Plan de Verificación y Comandos
```bash
# Pruebas automatizadas de catálogo
cd compunex-backend
mvn test -Dtest=ProductoPublicoControllerTest,CategoriaControllerTest

# Verificación manual con curl
curl -i "http://localhost:8080/api/v1/categories"
curl -i "http://localhost:8080/api/v1/products?search=thinkpad&page=0&size=10"
curl -i "http://localhost:8080/api/v1/products/1"
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoints | Clases Clave |
| :--- | :--- | :--- | :--- |
| `RF-03` (Explorar Catálogo) | `RN-003`, `RN-004` | 5, 6, 18 | `CategoriaController.java`, `ProductoPublicoController.java` |
| `RF-04` (Ficha Técnica) | `RN-004` | 19 | `ProductoDetalleResponseDTO.java`, `ProductoPublicoService.java` |
