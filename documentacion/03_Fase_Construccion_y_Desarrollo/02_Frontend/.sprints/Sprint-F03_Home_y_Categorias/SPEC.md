# Sprint-F03 — Portal de Inicio B2B y Explorador de Categorías

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-home-categories` hacia `develop`  
> **Dependencias Previas:** `Sprint-F01_Setup_UI_y_Design_Tokens`

---

## 1. Objetivo del Sprint
Construir las vistas de aterrizaje y navegación taxonómica de COMPUNEX B2B: pantalla de Inicio (`P-01`) con Hero institucional mayorista, acceso directo a categorías tecnológicas y destacados, y la pantalla de Categorías (`P-02`) con grilla visual, contadores de productos y navegación a subcategorías.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-01`: Inicio (Hero B2B "Marketplace Mayorista de Cómputo", cuadrícula de categorías, banner de confianza comercial, ofertas destacadas).
  * `P-02`: Categorías (Listado estructurado de categorías con total de productos disponibles por categoría y subcategorías).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/categories` (Endpoint 5)
  * `GET /api/v1/categories/{id}` (Endpoint 6)
  * `GET /api/v1/products?page=0&size=8` (Endpoint 18)

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-01: Inicio (`HomeComponent`)
- [ ] Sección Hero con propuesta de valor B2B (facturación electrónica, precios por volumen, compras consolidadas).
- [ ] Grid de accesos rápidos a las 5 categorías principales (Laptops, Servidores, Componentes, Redes, Almacenamiento).
- [ ] Carrusel / Grilla de productos destacados con `ProductCardComponent`:
  * Muestra imagen, nombre, SKU, precio unitario PEN y proveedor.
- [ ] 4 Estados: Skeletons de carga, Estado con datos, Estado vacío y Banner de error con botón de reintento.

### 3.2. Pantalla P-02: Categorías (`CategoriesComponent`)
- [ ] Grilla de tarjetas de categorías con icono o imagen representativa, descripción corta y badge con total de productos disponibles.
- [ ] Lista desplegable o tabs para explorar las subcategorías asociadas.
- [ ] 4 Estados: Skeletons de tarjetas, Grid poblada, Estado sin categorías, Error de conexión.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Ambas vistas son completamente responsivas (probadas en 375px, 768px y 1280px).
- [ ] Al hacer clic en una categoría, se navega correctamente a `/catalogo?categoryId=<id>`.
- [ ] Los 4 estados visuales se implementan limpiamente sin parpadeos.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/home/**/*.spec.ts
# Navegar a http://localhost:4200 y http://localhost:4200/categorias
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Pantalla | Componente | Endpoints |
| :--- | :--- | :--- | :--- |
| `RF-03` | `P-01`, `P-02` | `HomeComponent.ts`, `CategoriesComponent.ts` | 5, 6, 18 |
