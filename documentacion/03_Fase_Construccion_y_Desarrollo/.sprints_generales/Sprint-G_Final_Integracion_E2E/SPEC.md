# SPEC — Sprint-G_Final: Integración E2E y Release Candidate (COMPUNEX B2B)

> **Ámbito:** Sprint General Transversal de Cierre de Construcción  
> **Objetivo:** Conectar la aplicación web Angular (`compunex-frontend`) con el backend Spring Boot (`compunex-backend`) en entorno local, ensayar los flujos completos de compra/venta y generar los paquetes finales de entrega.

---

## 📋 1. Alcance

* **Incluye:**
  * Enlace real entre Angular (`environment.apiUrl`) y Spring Boot (`http://localhost:8080/api/v1`).
  * Ensayos de flujo completo:
    1. Registro/Login de empresa y exploración del catálogo.
    2. Agregar al carrito multi-proveedor validando pedidos mínimos.
    3. Checkout único con emisión de comprobantes simulados por proveedor (*Split Order*).
    4. Consulta de "Mis Compras" (comprador) y "Ventas Recibidas" (proveedor).
    5. Panel de gestión del proveedor: creación, edición y borrado lógico de producto.
    6. Verificación de ruta 404 ante URLs inexistentes.
  * Verificación de empaquetado independiente: `PF_BC_GRUPO_XX.rar` (backend) y `PF_FR_GRUPO_XX.rar` (frontend).
* **NO incluye:**
  * Despliegue en la nube o pasarelas de pago reales.

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Integración** | Desarrollador + Agente | Probar comunicación HTTP completa con CORS activo y manejo de errores 400/401/403/404. |
| **Validación** | Desarrollador + Agente | Ensayar 3 veces consecutivas el flujo de compra y emisión de facturas simuladas. |
| **Empaquetado** | Desarrollador + Agente | Comprimir proyectos verificando ausencia de carpetas pesadas innecesarias (`target/`, `node_modules/`) y sin contraseñas. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Compra multi-proveedor de punta a punta
* **Dado** el backend levantado en el puerto 8080 y el frontend en el puerto 4200
* **Cuando** un usuario realiza checkout de productos de 2 proveedores
* **Entonces** la UI muestra la confirmación exitosa y genera en pantalla las 2 facturas simuladas con sus totales calculados por el servidor.

### E2 — Manejo visual de errores y permisos
* **Dado** una sesión con rol de comprador
* **Cuando** intenta acceder a la ruta privada de administración o gestión de otro proveedor
* **Entonces** el sistema intercepta la petición y muestra la pantalla amigable de acceso denegado o redirige a login sin bloquear la interfaz.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Todas las pruebas de backend (JUnit) y frontend ejecutadas y en verde.
- [ ] Flujo E2E probado de extremo a extremo sin caídas de servidor ni excepciones en consola.
- [ ] Empaquetado de archivos realizado según la nomenclatura de entrega (`PF_BC_GRUPO_XX` y `PF_FR_GRUPO_XX`).
