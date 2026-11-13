# Sprint-F04 — Catálogo B2B, Búsqueda Reactiva y Paginación

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-catalog-search` hacia `develop`  
> **Dependencias Previas:** `Sprint-F03_Home_y_Categorias`

---

## 1. Objetivo del Sprint
Construir la pantalla principal de exploración comercial de COMPUNEX B2B: Catálogo y búsqueda (`P-03`), implementando un motor reactivo de filtrado facetado basado en Angular Signals, búsqueda por texto con debounce de 300ms, paginador dinámico y visualización de tarjetas de producto con soporte para los 4 estados de pantalla.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-03`: Catálogo y búsqueda (Barra de búsqueda superior, panel lateral de filtros por categoría y proveedor, selector de ordenamiento, grilla de productos a 3-4 columnas, paginación numérica).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/products?search=&categoryId=&page=0&size=12` (Endpoint 18)
  * `GET /api/v1/categories` (Endpoint 5)
* **Reglas de Negocio:**
  * `RN-003`: Los productos en estado no activo o eliminados no se renderizan en el catálogo.
  * `RN-004`: Visualización de stock mayorista y precio en Soles (`PEN`).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Estado Reactivo del Catálogo (`CatalogStateService.ts`)
- [ ] Signals reactivas: `searchTerm = signal('')`, `selectedCategory = signal<string | null>(null)`, `page = signal(0)`, `pageSize = signal(12)`.
- [ ] Computed resource que reacciona a los cambios de señales y dispara la consulta HTTP con debounce.

### 3.2. Pantalla P-03: Catálogo (`CatalogComponent`)
- [ ] Panel lateral de filtros: checkboxes de categorías y selectores de rango.
- [ ] Barra superior: campo de búsqueda en vivo con botón para limpiar término, selector de orden (Menor precio, Mayor precio, Nombre A-Z).
- [ ] Grilla de productos:
  * `ProductCardComponent`: imagen, nombre, SKU, precio unitario PEN + desglose IGV, badge de stock, nombre del proveedor mayorista y botón rápido "Añadir al Carrito".
- [ ] Controles de paginación: "Anterior", números de página, "Siguiente", contador "Mostrando X de Y productos".
- [ ] 4 Estados: Skeletons de 12 tarjetas, Grid con datos, Estado vacío con mensaje "No se encontraron productos con los filtros aplicados" y botón "Limpiar filtros", Error de conexión.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Escribir en la barra de búsqueda filtra automáticamente los resultados tras 300ms sin recargar la página.
- [ ] Cambiar de página o filtro actualiza los parámetros en la URL (`queryParams: { search, categoryId, page }`).
- [ ] Los 4 estados visuales se implementan y prueban con éxito contra Prism Mock.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/catalog/**/*.spec.ts
# Navegar a http://localhost:4200/catalogo y probar filtros y búsqueda
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-03` | `RN-003`, `RN-004` | `P-03` | `CatalogComponent.ts`, `ProductCardComponent.ts` | 5, 18 |
