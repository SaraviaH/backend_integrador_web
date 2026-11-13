# SPEC — Sprint-G02: Base de Datos, Esquema de 10 Tablas y Semillas (COMPUNEX B2B)

> **Ámbito:** Sprint General Transversal  
> **Objetivo:** Materializar la estructura física de las 10 tablas definidas en `MODELO_Y_DICCIONARIO_BD.md` e integrar las entidades para soportar el flujo transaccional de órdenes y facturación simulada.  
> **Regla de Oro:** Esquemas de datos DDL estrictos y reproducibles en local, con integridad referencial completa y sin mezcla de datos de prueba en la definición física.

---

## 📋 1. Alcance

* **Incluye:**
  * Mapeo de las 7 entidades existentes en `compunex-backend`: `usuarios`, `perfiles_proveedor`, `categorias`, `subcategorias`, `productos`, `producto_especificaciones`, `imagenes_producto`.
  * Diseño e implementación de las 3 nuevas entidades: `ordenes`, `subordenes_factura`, `orden_items`.
  * Integración de restricciones `UNIQUE` (`codigo_orden`, `numero_comprobante`), claves foráneas y cascadas.
  * Semillas iniciales (`DataInitializer.java`) para categorías de hardware, proveedor demo y productos base con especificaciones e imágenes.
* **NO incluye:**
  * Lógica de controladores web ni interfaz de usuario.

---

## 👥 2. Tareas del Sprint

| Tipo | Responsable | Tarea |
| :---: | :---: | :--- |
| **Técnica** | Desarrollador + Agente | Crear las entidades JPA `OrdenCompra`, `SubordenFactura` y `OrdenItem` en `modules/ordenes/`. |
| **Técnica** | Desarrollador + Agente | Crear los repositorios JPA correspondientes con métodos de consulta por comprador y proveedor. |
| **Técnica** | Desarrollador + Agente | Actualizar `DataInitializer.java` con categorías completas y productos de prueba para el catálogo. |
| **Validación** | Desarrollador + Agente | Escribir y ejecutar pruebas `@DataJpaTest` para validar persistencia en cascada e integridad de claves. |

---

## 🧪 3. Escenarios de Comprobación (Given-When-Then)

### E1 — Persistencia atómica de Orden y Subórdenes (Split Order)
* **Dado** una orden de compra con productos de 2 proveedores diferentes
* **Cuando** se persiste la orden principal con sus subórdenes hijas
* **Entonces** la base de datos almacena 1 registro en `ordenes`, 2 registros en `subordenes_factura` y sus respectivos ítems en `orden_items` con sus claves foráneas válidas.

### E2 — Integridad de clave única en números de comprobante
* **Dado** una suborden con número de comprobante `SIM-F001-00000201`
* **Cuando** se intenta insertar otra suborden con el mismo número de comprobante
* **Entonces** el motor rechaza la operación por violación de restricción `UNIQUE`.

---

## ✅ 4. Definition of Done (DoD)

- [ ] Las 10 tablas del modelo creadas y validadas en esquema local.
- [ ] Entidades JPA mapeadas con precisión numérica `NUMERIC(12,2)` para dinero y `Instant` para fechas.
- [ ] Pruebas unitarias de repositorio pasando al 100% en H2/motor local.
