# MEMORY_FRONTEND.md — Bitácora Local del Agente Frontend

> **Propósito:** Registro técnico persistente para el agente y desarrolladores de frontend. Mantiene el estado de los componentes, tests de renderizado, accesibilidad y deuda de interfaz sin contaminar otras áreas.

---

## 📍 1. Estado del Frontend

* **Rama Activa:** `feature/frontend-...`
* **Última Actualización:** `YYYY-MM-DD HH:mm`
* **Tests de Componentes / UI:** `[X de X en verde]` ✅
* **Análisis Estático (Linter):** `[0 errores, 0 advertencias]` ✅
* **Accesibilidad (a11y):** `[WCAG 2.1 AA verificado]` ✅

---

## 📊 2. Cobertura de Pantallas y Vistas

| Ruta / Vista | Componente Principal | Estado | Mock Probado | Accesibilidad |
| :--- | :--- | :---: | :---: | :---: |
| `/login` | `LoginView` | ⬜ Pendiente | ✅ Prism 8080 | 48 dp / Contraste |
| `/inicio` | `InicioDashboardView` | ⬜ Pendiente | ✅ Prism 8080 | 48 dp / Contraste |
| `/recursos/:id` | `DetalleRecursoView` | ⬜ Pendiente | ✅ Prism 8080 | 48 dp / Contraste |

---

## ⚠️ 3. Deuda Técnica Local de Frontend

| ID | Componente / Archivo | Descripción de la Deuda | Severidad | Plan de Mitigación |
| :---: | :--- | :--- | :---: | :--- |
| **DT-F01** | `[TarjetaItem.tsx]` | *[Falta añadir soporte para Skeleton de carga]* | Baja | Resolver en sprint de pulido |

---

## ❓ 4. Dudas Técnicas de UI / UX

* [ ] `[DUDA-F01]`: *[Duda sobre comportamiento en modo offline o tamaño de fuentes]*
