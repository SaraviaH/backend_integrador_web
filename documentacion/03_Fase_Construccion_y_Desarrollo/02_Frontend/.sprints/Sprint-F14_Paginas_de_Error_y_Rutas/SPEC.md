# Sprint-F14 — Páginas de Error, Fallbacks y Manejo Global de Rutas

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-error-pages` hacia `develop`  
> **Dependencias Previas:** `Sprint-F13_Ventas_Proveedor_y_Despacho`

---

## 1. Objetivo del Sprint
Implementar las pantallas estándar de fallo y control de navegación de COMPUNEX B2B: pantalla de Acceso Denegado 403 (`P-36`) para capturar intentos de acceso a zonas restringidas sin los privilegios requeridos (`RoleGuard`), y pantalla de Página No Encontrada 404 (`P-37`) para capturar rutas inexistentes (`/**`), con ilustraciones corporativas amigables y acciones de recuperación para el usuario.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-36`: Acceso denegado (Ilustración de candado / seguridad corporativa, mensaje *"No tienes permisos suficientes para acceder a esta sección"*, botón para regresar al inicio o cambiar de cuenta).
  * `P-37`: Página no encontrada (Ilustración 404, mensaje *"La página que buscas no existe o ha sido movida"*, barra de búsqueda rápida y enlaces a secciones populares).
* **Router Angular:** Wildcard path `**` y manejador de excepciones de `RoleGuard`.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-36: Acceso Denegado 403 (`AccessDeniedComponent`)
- [ ] Ilustración SVG / CSS de acceso restringido en paleta corporativa.
- [ ] Mensaje explicativo claro diferenciando si el usuario necesita iniciar sesión o si necesita activar su cuenta de proveedor.
- [ ] Botones de acción: "Volver a la Página Principal" (hacia `/`) e "Iniciar Sesión con otra Cuenta" (hacia `/auth/login`).

### 3.2. Pantalla P-37: Página No Encontrada 404 (`NotFoundComponent`)
- [ ] Ilustración visual amigable de página no encontrada.
- [ ] Buscador de productos integrado que redirige a `/catalogo?search=<termino>`.
- [ ] Lista de enlaces rápidos recomendados: Inicio, Categorías, Catálogo B2B, Soporte.

### 3.3. Configuración en `app.routes.ts`
- [ ] Ruta explícita: `{ path: '403', component: AccessDeniedComponent }`.
- [ ] Ruta comodín al final de la tabla: `{ path: '**', component: NotFoundComponent }`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Cualquier ruta no declarada (ej. `/ruta-inexistente-xyz`) renderiza limpiamente la pantalla 404.
- [ ] Intentos de entrar a `/proveedor/**` siendo `CLIENTE` son interceptados por `roleGuard` y redirigidos inmediatamente a `/403`.
- [ ] Ambas pantallas cumplen accesibilidad y responsividad total.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/core/pages/error/**/*.spec.ts
# Navegar intencionalmente a http://localhost:4200/ruta-falsa y verificar 404
# Navegar a http://localhost:4200/403 y verificar diseño
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Pantallas | Componentes | Rol del Sistema |
| :--- | :--- | :--- | :--- |
| `RF-Transversal` | `P-36`, `P-37` | `AccessDeniedComponent.ts`, `NotFoundComponent.ts` | Manejo de Errores y Seguridad |
