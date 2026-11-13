# 02. Frontend: Normas de Construcción y Desarrollo Local

> **Ámbito:** Especialidad Técnica · Frontend  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Proyecto:** COMPUNEX B2B  
> **Pila Tecnológica:** Angular 18 (Standalone Components, Signals, Router, HttpClient) · SASS · Tailwind CSS · Node.js 20+  
> **Regla de Operación:** Toda la interfaz se construye a partir de los mockups aprobados en `Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md` y consume los contratos congelados de Fase 02. La planificación de sprints reside exclusivamente en [`.sprints/BACKLOG.md`](../.sprints/BACKLOG.md).

---

## 🏛️ Principios de Construcción de Frontend

### 1. Composición de Interfaz y Standalone Components
* **Átomos:** Botones primarios/secundarios/peligro, inputs de texto y numéricos con validación, badges de estado (`PENDIENTE`, `PAGADO`, `DESPACHADO`), tokens de color Tailwind.
* **Moléculas:** Grupos de formulario con mensajes de error accesibles, tarjetas de producto con selector de cantidad y precio por volumen, filas de orden de compra.
* **Organismos:** Barra de navegación superior responsiva con indicador de rol, tabla de catálogo con filtros laterales, resumen de carrito con desglose por proveedor antes del split, visor de factura electrónica simulada.
* **Vistas / Páginas:** Componentes de página (`pages/*` o `features/*`) enlazados a rutas con lazy loading.

### 2. Gestión de Estado con Signals y los 4 Estados de Pantalla
* Uso de Angular Signals (`signal()`, `computed()`) para el estado reactivo del cliente (carrito de compras, sesión de usuario, filtros activos).
* Toda vista que consume datos de la API debe implementar obligatoriamente los **4 estados**:
  * 🔄 **Cargando:** Skeleton loaders limpios (sin parpadeos).
  * 📭 **Vacío:** Ilustración o icono con texto amigable (ej. "Tu carrito corporativo está vacío").
  * ❌ **Error:** Alerta descriptiva con código de error RFC 9457 y botón "Reintentar conexión".
  * ✅ **Éxito:** Renderizado ordenado de los datos.

### 3. Seguridad en el Cliente y Guards de Navegación
* Cero credenciales maestras o secretos de servidor en código TypeScript.
* Interceptor HTTP (`AuthInterceptor`) adjunta automáticamente `Authorization: Bearer <token>` a las peticiones hacia `/api/v1/*`.
* Interceptor de Errores (`ErrorInterceptor`) captura respuestas 401/403/500 y redirige o muestra notificaciones tipo Toast.
* Guards funcionales: `authGuard` (valida existencia de token) y `roleGuard` (valida permisos por `ROLE_COMPRADOR`, `ROLE_PROVEEDOR`, `ROLE_ADMIN`).

### 4. Accesibilidad y Ergonomía (a11y - WCAG 2.1 AA)
* Contraste cromático de texto mínimo 4.5:1.
* Formularios navegables al 100% mediante teclado (`Tab`, `Enter`, `Escape`).
* Atributos ARIA en modales y tablas interactivas.

---

## 🧪 El Ciclo TDD en Frontend

```text
1. ROJO:     Escribir el test de componente en `src/app/.../*.spec.ts` para el escenario del SPEC activo.
             Ejecutar `npm test` y comprobar que FALLA.
2. VERDE:    Escribir el código mínimo del componente standalone para pasar la prueba.
3. REFACTOR: Limpiar clases Tailwind/SCSS, optimizar imports y verificar suite verde.
4. MANUAL:   Probar la vista en `localhost:4200` interactuando con clics reales.
```

---

## 🛑 Protocolo Anti-Alucinación (El Humano en el Bucle)

El desarrollador o agente de frontend **NUNCA** da por cerrado un sprint sin comprobación física:
> 💬 *"¿Probaste la pantalla en tu navegador en `http://localhost:4200`? ¿Verificaste el comportamiento ante respuestas vacías o errores de servidor? ¿Probaste el botón con clics reales?"*

---

## 🔗 Referencias de Gobernanza

* **Backlog de Sprints:** [`.sprints/BACKLOG.md`](../.sprints/BACKLOG.md)
* **Bitácora Viva del Sistema:** `MEMORY.md` (raíz del proyecto)
* **Arquitectura Frontend:** `02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md`
* **Mockups y Diseños:** `02_Fase_Diseno_y_Arquitectura/02_Frontend/Mockups/`
