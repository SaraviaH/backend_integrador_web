# Pendientes Generales del Proyecto — COMPUNEX B2B (Grupo 02)

> **Rama:** `integracion/e2e` | **Fecha:** 15/11/2026  
> **Estado actual verificado:**  
> - Back-end (`.\mvnw.cmd test`): **83 / 83 tests JUnit pasando (`BUILD SUCCESS`)**  
> - Front-end (`npm.cmd run build`): **Build Angular 18 completo sin errores**

---

## 1. Base de Datos y Configuración de Entornos (Rúbrica ATF3)

- [x] **Configuración y migración de Base de Datos (Ítem 9):**
  - Migrado a **MySQL 8.0** (`com.mysql:mysql-connector-j` en `pom.xml`, base de datos `compunex_b2b`).
  - Configurado usuario dedicado distinto de `root`: `compunex_app` (contraseña `98306001` en `dev` / variables de entorno en `prod`).
- [x] **Perfiles Back-end (Ítem 4):**
  - Activado `spring.profiles.active=${SPRING_PROFILES_ACTIVE:dev}` en `compunex-backend/src/main/resources/application.properties` enlazando automáticamente `application-dev.yml` y `application-prod.yml` (sin propiedades duplicadas).
- [x] **Entornos Front-end (Ítem 3):**
  - Verificado `fileReplacements` en `compunex-frontend/angular.json` (`configurations.production`) reemplazando `environment.ts` por `environment.prod.ts` en builds de producción.

---

## 2. Front-end: Diseño, UX y Flujos

- [ ] **Mejorar el diseño del Front-end (UI):**
  - Pulir estilos, espaciados, jerarquía visual, tarjetas de producto, tablas y consistencia de componentes en Tailwind CSS.
  - Revisar vista móvil (`375px`) y tablet para asegurar responsividad completa sin desbordamientos.
- [ ] **Experiencia de usuario (UX):**
  - Verificar mensajes de retroalimentación claros (toasts, alertas de error en formularios, estados vacíos y spinners de carga).
  - Validar que los flujos de navegación (público, comprador y proveedor) sean intuitivos y no requieran recargas manuales.
- [ ] **Verificar flujos End-to-End (E2E):**
  - Registro de empresa/proveedor y login con JWT.
  - Navegación por categorías, catálogo público y detalle de producto.
  - Panel de proveedor: crear, editar, activar/desactivar y eliminar productos.
  - Flujo de carrito, checkout, órdenes y ventas recibidas.
  - Manejo de rutas inválidas (página **404**) y accesos sin permiso (**401 / 403**).

---

## 3. Pruebas y Validación de Endpoints

- [ ] **Testeo de los endpoints en vivo (Postman / Swagger UI):**
  - Probar todos los endpoints de `AuthController`, `CategoriaController`, `ProductoProveedorController`, `AdminProductoController`, `MediaController`, `OrderController` y `ProviderProfileController` contra la base de datos real.
  - Verificar códigos HTTP (`200`, `201`, `204`, `400`, `401`, `403`, `404`) y persistencia real.

---

## 4. Documentación Final y Entrega (Lunes 16/11/2026 — 18:15 p.m.)

- [ ] **Plan de Desarrollo de Software (`PF_GRUPO_02.pdf`):** Documento en Word con carátula, cronograma, herramientas, metodología y roles exportado a PDF.
- [ ] **Empaquetado separado (sin contraseña):**
  - `PF_GRUPO_02.pdf`
  - `PF_BC_GRUPO_02.rar` (o `.zip`) — Back-end
  - `PF_FR_GRUPO_02.rar` (o `.zip`) — Front-end (sin `node_modules`)
- [ ] **Sustentación:** Ensayar demo completa en vivo (vestimenta casual-formal).
