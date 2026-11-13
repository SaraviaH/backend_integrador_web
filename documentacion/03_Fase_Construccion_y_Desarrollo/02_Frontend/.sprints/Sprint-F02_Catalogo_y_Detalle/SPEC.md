# Sprint-F02 — Catálogo Reactivo B2B y Ficha Técnica de Producto

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-catalog-detail` hacia `develop`  
> **Dependencias Previas:** `Sprint-F01_Setup_UI_y_Auth`

---

## 1. Objetivo del Sprint
Desarrollar la experiencia completa de búsqueda, filtrado facetado y ficha detallada de productos en COMPUNEX B2B, implementando componentes reactivos basados en Angular Signals para la exploración del catálogo mayorista, galería interactiva de imágenes, tabla de especificaciones técnicas y contacto directo con el proveedor (`P-04` y `P-05`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-04`: Detalle de producto (Galería con miniatura activa, desglose de precio mayorista en PEN + IGV, stock disponible, selector de cantidad y ficha técnica).
  * `P-05`: Contacto del proveedor (Modal interactivo con datos de contacto comercial y formulario de mensaje).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/products?search=&categoryId=&page=0&size=12` (Endpoint 18)
  * `GET /api/v1/products/{id}` (Endpoint 19)
* **Reglas de Negocio:**
  * `RN-003`: Ocultamiento en UI de productos no disponibles o eliminados.
  * `RN-004`: Validación de cantidades mínimas y visualización de stock mayorista.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Servicio de Catálogo Reactivo (`CatalogService.ts`)
- [ ] Implementar `CatalogService` con Signals para filtros activos:
  * `searchTerm = signal<string>('')`
  * `selectedCategoryId = signal<string | null>(null)`
  * `currentPage = signal<number>(0)`
  * `productsResource = computed(...)` que dispara la consulta HTTP con debounce de 300ms.

### 3.2. Ficha de Detalle de Producto (`ProductDetailComponent` - `P-04`)
- [ ] Galería de imágenes interactiva: imagen principal con zoom/previsualización y carrusel de miniaturas (`ImagenProductoDTO`).
- [ ] Ficha técnica estructurada: tabla con especificaciones clave-valor (`cpu`, `ram`, `garantia`, etc.).
- [ ] Caja de compra B2B:
  * Desglose visual: Precio unitario base + IGV (18%) = Precio final.
  * Indicador visual de stock: Verde (>10 unid.), Amarillo (1-9 unid.), Rojo (Agotado - botón deshabilitado).
  * Selector numérico de cantidad mayorista con validación de límite de stock.
  * Botón reactivo "Añadir al Carrito" que interactúa con `CartService`.

### 3.3. Modal de Contacto con Proveedor (`ProviderContactModalComponent` - `P-05`)
- [ ] Diálogo modal accesible (WCAG con `aria-modal="true"`):
  * Muestra Razón Social del proveedor, RUC, nombre comercial y correo de contacto.
  * Formulario reactivo para enviar consulta técnica o solicitud de cotización por volumen.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Ambas pantallas implementan los 4 estados visuales (Skeleton de carga, Estado con datos, Estado vacío y Estado de error con botón de reintento).
- [ ] El cambio de imagen en miniatura actualiza de inmediato la vista principal sin saltos de layout (CLS = 0).
- [ ] Si el stock es 0, el botón de añadir al carrito se deshabilita y se muestra el badge "Agotado".
- [ ] Pruebas unitarias de componentes pasando con Karma/Jasmine o Jest.

---

## 5. Plan de Verificación y Comandos
```bash
# Probar navegación a ficha de producto en frontend
ng test --include=src/app/features/catalog/**/*.spec.ts
# Abrir http://localhost:4200/productos/1 y verificar galería y modal de contacto
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente Angular |
| :--- | :--- | :--- | :--- |
| `RF-03` | `RN-004` | `P-03` | `CatalogGridComponent.ts`, `ProductCardComponent.ts` |
| `RF-04` | `RN-004` | `P-04`, `P-05` | `ProductDetailComponent.ts`, `ProviderContactModalComponent.ts` |
