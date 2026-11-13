# Sprint-F01 — Setup UI, Design Tokens y Shell de Navegación

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-setup-shell` hacia `develop`  
> **Dependencias Previas:** `Sprint-G01_Setup_y_Entorno` (consume Prism Mock Server `http://localhost:4010`)

---

## 1. Objetivo del Sprint
Establecer la base visual y de componentes atómicos de COMPUNEX B2B con Angular 18 standalone, configurando el sistema de diseño en Tailwind CSS y SASS, y desarrollando el Shell de la aplicación (`Header`, `Footer`, `Navbar` responsivo) con selector de estado y rutas base.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Tokens de Diseño:** Colores corporativos B2B (Primario: Indigo `#4F46E5`, Neutros: Slate `#0F172A`/`#334155`/`#F8FAFC`, Acento: Emerald `#10B981`).
* **Mockups Base:** `02_Fase_Diseno_y_Arquitectura/02_Frontend/Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`
* **Arquitectura Frontend:** `02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md`

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Tokens y Átomos Base
- [ ] Configurar `tailwind.config.js` con la paleta oficial, escalas tipográficas y breakpoints responsivos.
- [ ] Componente `ButtonComponent` (standalone): Variantes `primary`, `secondary`, `outline`, `danger`, `ghost`, con soporte para estado de carga (`loading`).
- [ ] Componente `BadgeComponent`: Estados de stock (`disponible`, `agotado`, `alerta`) y roles (`admin`, `proveedor`, `cliente`).
- [ ] Componente `InputComponent`: Campos con validaciones visuales, soporte para icono prefijo/sufijo y mensajes de error accesibles.

### 3.2. Shell y Navegación Global
- [ ] `HeaderComponent`: Logo COMPUNEX B2B, barra de búsqueda rápida, badge dinámico del carrito, selector de usuario/login.
- [ ] `NavbarComponent`: Menú de categorías principales, enlaces rápidos a catálogos y ofertas.
- [ ] `FooterComponent`: Información fiscal (RUC corporativo), enlaces institucionales, soporte B2B y políticas de compra.
- [ ] `ShellComponent`: Layout envolvente con `<router-outlet>` y soporte para vistas públicas y privadas.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Compilación 100% limpia sin errores en TypeScript ni advertencias en Tailwind.
- [ ] Header responsivo con menú hamburguesa colapsable en pantallas móviles (<768px).
- [ ] El badge del carrito se conecta reactivamente a `CartService`.
- [ ] Pruebas unitarias de componentes atómicos pasando al 100%.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/core/components/**/*.spec.ts
ng serve # Abrir http://localhost:4200 y validar responsive en 375px, 768px y 1280px
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Pantalla / Componente | Archivos Clave |
| :--- | :--- | :--- |
| `RF-Transversal` | Shell Global | `ShellComponent.ts`, `HeaderComponent.ts`, `FooterComponent.ts` |
