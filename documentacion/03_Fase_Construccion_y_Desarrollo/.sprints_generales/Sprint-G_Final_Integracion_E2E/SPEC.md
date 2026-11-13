# Sprint-G_Final — Integración E2E y Certificación Final de Fase 03

> **Área Técnica:** Transversal / Integración y QA E2E  
> **Track:** General  
> **Agente Responsable:** Coordinador Macro / QA Lead  
> **Estado:** COMPLETADO  
> **Rama GitFlow:** `integracion/e2e` (Tag `v1.0.0-mvp`)  
> **Dependencias Previas:** `Sprint-B_Audit` (Gate 1 Backend APROBADO) y `Sprint-F_Audit` (Gate 2 Frontend APROBADO)

---

## 1. Objetivo del Sprint
Unificar el Frontend Angular real con el Backend Spring Boot real y la base de datos PostgreSQL local (`compunex_b2b`, desactivando `useMock`), ejecutar las pruebas E2E en vivo en navegador Chromium validando los 5 flujos críticos de negocio (Autenticación B2B, Catálogo & Búsqueda, Split Order ACID, Mis Compras & Factura Simulada SUNAT, Portal Proveedor & Media + Despacho), y emitir el acta formal de aprobación `AUDITORIA_FINAL.md` para el cierre de la Fase 03.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Auditorías de Hito Previas:**
  * `01_Backend/.sprints/Sprint-B_Audit/AUDITORIA_1.md` (Gate 1 Backend Aprobado)
  * `02_Frontend/.sprints/Sprint-F_Audit/AUDITORIA_2.md` (Gate 2 Frontend Aprobado)
* **Contratos Completos:** `02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md` (24 endpoints)
* **Pantallas MVP:** `02_Fase_Diseno_y_Arquitectura/02_Frontend/Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md` (27 pantallas)
* **Reglas de Negocio:** `RN-001` a `RN-008` activas e integradas de extremo a extremo.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Conmutación de Entorno y Proxy de Integración
- [x] Modificado `compunex-frontend/src/environments/environment.ts` con `useMock: false` y `apiUrl: 'http://localhost:8080/api/v1'`.
- [x] Verificada configuración CORS en Spring Boot (`SecurityConfig.corsConfigurationSource()`) y alineados DTOs, servicios Angular, normalización de roles (`ROLE_*`), cálculos de IGV (`+18%`), carga de imágenes (`/api/v1/media/**`) y JWT (`roles`, `tienePerfilProveedor`).
- [x] Verificado en vivo en Chrome Headless (`74` llamadas HTTP reales hacia `http://localhost:8080/api/v1`, sin respuestas mock).

### 3.2. Ejecución de Pruebas E2E en Vivo (5 Flujos Críticos)
- [x] **Flujo 1 (Auth B2B):**
  * Registro de empresa (`POST /api/v1/auth/register-company` -> `201 Created`).
  * Login (`POST /api/v1/auth/login` -> `200`) + `GET /api/v1/auth/me` (`200`) con JWT incluyendo `roles` y `tienePerfilProveedor`.
- [x] **Flujo 2 (Catálogo & Búsqueda):**
  * Carga de 8 categorías (`/categories`) y productos reales desde PostgreSQL (`/products`).
  * Búsqueda con debounce > 300ms (`?search=...`) y filtro por categoría string (`?categoryId=ram`).
- [x] **Flujo 3 (Checkout Split-Order y Facturación Simulada):**
  * Carrito multi-proveedor agrupado con cálculo de IGV `18%`.
  * Checkout atómico (`POST /api/v1/orders/checkout` -> `201`): orden padre `PED-2026-000003` y 2 subórdenes independientes `SIM-F001-00000005` y `SIM-F001-00000006` en PostgreSQL.
- [x] **Flujo 4 (Mis Compras & Visor Factura SUNAT):**
  * Historial y detalle `/cuenta/mis-compras/3` + visor `/pedidos/3/comprobante` con RUC receptor, I.G.V. `18.00%`, comprobante `SIM-F001-*` y regla `@media print`.
- [x] **Flujo 5 (Portal Proveedor, Media, Despacho y Reglas de Seguridad):**
  * Activación de rol proveedor (`POST /api/v1/providers/me/activate` -> `201`, nuevo JWT `PROVEEDOR`).
  * Subida multipart de imagen PNG (`POST /api/v1/media/upload` -> `201`) + carga `GET /api/v1/media/files/products/...` (`200 image/png`) + creación de producto (`201`).
  * Transición completa de despacho en `/panel/sales/6`: `PENDIENTE_DESPACHO` → `EN_PREPARACION` → `DESPACHADO` → `ENTREGADO` (`PATCH .../status` -> `200`).
  * Rechazo de auto-compra (`RN-007`, HTTP `400`), acceso sin token (`401`) y acceso de `CLIENTE` a ventas de proveedor (`403`).

### 3.3. Consolidación de Git y Tag de Versión
- [x] Merge de Backend y Frontend en rama `integracion/e2e` sin conflictos.
- [x] Verificación limpia: `.\mvnw.cmd clean test` (`83/83` tests en verde) y `npm.cmd run build` (`0` errores / `0` advertencias).
- [x] Commit final de integración y tag `v1.0.0-mvp`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] `useMock: false` activo en Frontend sin fallbacks a datos mock.
- [x] Todos los flujos de usuario críticos y endpoints consumidos operando en vivo contra PostgreSQL.
- [x] Transacciones Split Order ejecutadas con atomicidad e integridad verificada en base de datos.
- [x] Auditoría final documentada y firmada en `AUDITORIA_FINAL.md` con veredicto **APROBADO**.

---

## 5. Plan de Verificación y Comandos
```bash
# 1. Arrancar Backend Real
cd compunex-backend
mvn spring-boot:run

# 2. Arrancar Frontend Real
cd compunex-frontend
npm start

# 3. Ejecutar pruebas automatizadas E2E / Cypress / Playwright
npx cypress run --spec "cypress/e2e/smoke_flow_split_order.cy.ts"
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla Frontend | Endpoint Backend | Tabla BD |
| :--- | :--- | :--- | :--- | :--- |
| `RF-01` a `RF-14` | `RN-001` a `RN-008` | `P-01` a `P-27` | Endpoints 1 a 24 | 10 Tablas Integradas |
