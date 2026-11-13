# Sprint-F05 — Ficha Detallada de Producto y Contacto con Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-product-detail` hacia `develop`  
> **Dependencias Previas:** `Sprint-F04_Catalogo_B2B_y_Busqueda`

---

## 1. Objetivo del Sprint
Implementar la experiencia de inspección técnica profunda y contacto comercial en COMPUNEX B2B: Ficha detallada de producto (`P-04`) con galería interactiva de imágenes, tabla de especificaciones técnicas clave-valor, caja de compra con desglose fiscal B2B, y el diálogo modal accesible de contacto directo con el proveedor comercial (`P-05`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-04`: Detalle de producto (Galería de imágenes con miniaturas, nombre, SKU, marca, precio mayorista neto y con IGV, badge de stock, selector de cantidad por bulto, tabla de especificaciones técnicas).
  * `P-05`: Contacto del proveedor (Modal accesible con RUC, Razón Social, teléfono de contacto y formulario para consulta mayorista).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/products/{id}` (Endpoint 19)
* **Reglas de Negocio:**
  * `RN-004`: Validación de stock disponible y desglose de precio unitario en PEN.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-04: Detalle de Producto (`ProductDetailComponent`)
- [ ] Galería de imágenes: visualizador principal de alta resolución y tira de miniaturas navegable con teclado.
- [ ] Datos de producto: título, SKU, categoría breadcrumb, descripción corta y detallada.
- [ ] Caja de compra B2B:
  * Precio unitario base en Soles (`PEN`) + cálculo explícito de IGV 18% = Precio total.
  * Semáforo de stock (Verde si > 10, Naranja si 1-9, Rojo si 0 - Agotado).
  * Selector numérico con botones `+` / `-` y validación de tope según `stockDisponible`.
  * Botón "Añadir al Carrito" que interactúa con `CartService`.
- [ ] Tabla de especificaciones técnicas: renderizado dinámico de la lista `especificaciones` (`clave`, `valor`).
- [ ] 4 Estados: Skeleton completo de ficha, Datos poblados, Producto no encontrado (404), Error de red.

### 3.2. Pantalla P-05: Contacto con Proveedor (`ProviderContactModalComponent`)
- [ ] Diálogo modal accesible (`role="dialog"`, `aria-modal="true"`, foco atrapado en el modal).
- [ ] Muestra datos fiscales: RUC, Razón Social, nombre comercial y correo mayorista.
- [ ] Formulario reactivo para enviar solicitud de cotización o duda técnica.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] La selección de miniaturas cambia la imagen principal sin saltos de layout (CLS = 0).
- [ ] Si el stock es 0, el botón de compra queda deshabilitado y se muestra "Agotado".
- [ ] El modal de contacto se puede abrir y cerrar con la tecla `Escape`.
- [ ] 4 estados verificados contra Prism Mock.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/catalog/pages/product-detail/**/*.spec.ts
# Abrir http://localhost:4200/productos/1 y probar galería y modal
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componentes | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-04` | `RN-004` | `P-04`, `P-05` | `ProductDetailComponent.ts`, `ProviderContactModalComponent.ts` | 19 |
