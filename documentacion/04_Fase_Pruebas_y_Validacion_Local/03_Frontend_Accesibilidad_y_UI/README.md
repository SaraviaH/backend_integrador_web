# 03. Pruebas de Frontend, Interacción y Accesibilidad (WCAG AA)

> **Área Técnica:** Frontend QA & Accesibilidad Web/Móvil (a11y)  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Evaluar la usabilidad, la consistencia de componentes según los mockups aprobados y el cumplimiento riguroso de accesibilidad (estándar WCAG 2.1 AA).

---

## ♿ 1. Reglas No Negociables de Accesibilidad

1. **Contraste de Color:** Mínimo **4.5:1** para texto normal y **3:1** para texto grande o iconos esenciales.
2. **Áreas Táctiles Mínimas:** Todo control interactivo táctil debe medir al menos **48 × 48 dp / px**.
3. **Navegación Asistida:** Navegabilidad 100% mediante teclado (`Tab`, `Shift+Tab`, `Enter`, `Espacio`) con anillo de foco visible.
4. **Lectores de Pantalla:** Todos los botones gráficos e imágenes informativas cuentan con etiquetas accesibles (`aria-label` o `semantics`).
5. **Escalabilidad Tipográfica:** La interfaz soporta escalado de fuentes al **200%** sin solapamiento de textos ni desbordamiento de botones.

---

## 🛠️ 2. Herramientas Recomendadas de Auditoría UI

* **Pruebas de Componentes:** React Testing Library, Vue Test Utils, Flutter Widget Test.
* **Escaneo Automático de Accesibilidad:** `axe-core`, `@axe-core/playwright`, Lighthouse CLI.
* **Pruebas Visuales y Regresión:** Storybook + Chromatic, Playwright visual comparisons.

---

## 📋 3. Lista de Chequeo de Ergonomía y Accesibilidad

| Criterio WCAG 2.1 AA | Herramienta de Medición | Umbral Requerido | Estado |
| :--- | :--- | :--- | :---: |
| **1.4.3 Contraste Mínimo** | Lighthouse / Colour Contrast Analyser | Ratio ≥ 4.5:1 en todos los textos | `[Aprobado / Pendiente]` |
| **2.5.5 Tamaño del Objetivo Táctil**| Inspección en emulador / dispositivo | Mínimo 48×48 dp | `[Aprobado / Pendiente]` |
| **2.1.1 Acceso por Teclado** | Navegación manual con Tab | Foco visible en todos los controles | `[Aprobado / Pendiente]` |
| **1.3.1 Información y Relaciones** | axe-core | Labels visibles asociados a inputs | `[Aprobado / Pendiente]` |
| **1.4.4 Cambio de Tamaño del Texto**| Zoom al 200% en navegador | Layout fluido sin truncamiento | `[Aprobado / Pendiente]` |
