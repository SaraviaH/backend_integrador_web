# Sprint-G_Final — Integración E2E y Certificación Final de Fase 03

> **Área Técnica:** Transversal / Integración y QA E2E  
> **Track:** General  
> **Agente Responsable:** Coordinador Macro / QA Lead  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `release/v1.0.0-rc` hacia `main` y `develop`  
> **Dependencias Previas:** `Sprint-B_Audit` (Gate 1 Backend APROBADO) y `Sprint-F_Audit` (Gate 2 Frontend APROBADO)

---

## 1. Objetivo del Sprint
Unificar el Frontend Angular real con el Backend Spring Boot real y la base de datos MySQL local (desactivando el Prism Mock Server), ejecutar la suite completa de pruebas E2E que valide los flujos críticos de negocio (Autenticación B2B, Catálogo, Split Order ACID, Facturación Simulada, Panel de Despacho y Auditoría), y emitir el acta formal de aprobación `AUDITORIA_FINAL.md` para el cierre de la Fase 03.

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
- [ ] Modificar `environment.ts` en Angular para apuntar a la API real: `apiUrl: 'http://localhost:8080/api/v1'`.
- [ ] Verificar configuración de CORS en Spring Boot (`CorsConfig.java`) permitiendo peticiones desde `http://localhost:4200` con cabeceras `Authorization`, `Content-Type`.
- [ ] Detener el servidor Prism Mock y verificar que las peticiones HTTP de Angular lleguen directamente al controlador Spring Boot.

### 3.2. Ejecución de Pruebas de Humo E2E (Smoke Test Suite)
- [ ] **Flujo 1 (Autenticación y Registro):**
  * Registro de empresa mayorista (`P-07` -> `POST /api/v1/auth/register-company`).
  * Inicio de sesión (`P-06` -> `POST /api/v1/auth/login`) y almacenamiento seguro de token JWT en Angular `AuthService`.
- [ ] **Flujo 2 (Exploración de Catálogo y Carrito Multi-Proveedor):**
  * Navegación por catálogo (`P-01`, `P-03` -> `GET /api/v1/products`).
  * Adición al carrito (`P-09`) de productos de 2 proveedores diferentes.
  * Verificación visual de agrupación por proveedor en UI (`P-11`).
- [ ] **Flujo 3 (Checkout Split-Order y Facturación Simulada):**
  * Ingreso de RUC de facturación (`P-10`).
  * Ejecución del checkout (`POST /api/v1/orders/checkout`).
  * Verificación atómica en MySQL: 1 registro en `ordenes`, 2 registros en `subordenes_factura` con correlativos `F001-XXXXX` y sus `orden_items`.
  * Visualización del comprobante simulado en pantalla (`P-13`).
- [ ] **Flujo 4 (Panel de Proveedor y Despacho):**
  * Inicio de sesión con cuenta de proveedor.
  * Visualización de subórdenes asignadas en panel (`P-24` -> `GET /api/v1/providers/me/sales`).
  * Transición de estado a `EN_PREPARACION` y `DESPACHADO` (`P-25`).
- [ ] **Flujo 5 (Seguridad y Control de Roles):**
  * Intento de acceso a rutas protegidas sin token (`P-36 Acceso denegado`).
  * Intento de auto-compra de productos propios (rechazado con error 400 según `RN-007`).

### 3.3. Consolidación de GitFlow y Tag de Versión
- [ ] Integrar ramas `feature/*` a `develop`.
- [ ] Crear rama de release `release/v1.0.0-rc`.
- [ ] Generar empaquetado de producción (`mvn package` -> JAR de Spring Boot y `ng build --configuration production` -> bundle dist).

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Cero dependencias activas hacia servidores Mock.
- [ ] Los 24 endpoints de backend se comunican sin errores con las 27 pantallas de frontend.
- [ ] Transacciones complejas (Split Order) se ejecutan con atomicidad garantizada en base de datos.
- [ ] Auditoría final documentada y firmada en `AUDITORIA_FINAL.md` con veredicto **APROBADO**.

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
