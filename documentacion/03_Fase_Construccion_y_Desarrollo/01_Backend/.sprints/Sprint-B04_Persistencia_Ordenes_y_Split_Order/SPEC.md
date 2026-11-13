# Sprint-B04 — Entidades JPA y Persistencia de Órdenes y Split Order

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`59a9285`, correlativos en `45479f7`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B03_Catalogo_Publico_B2B`

---

## 1. Objetivo del Sprint
Implementar las entidades JPA, enums, repositorios Spring Data y pruebas de persistencia para el soporte transaccional de compras mayoristas y el patrón arquitectural **Split Order**, mapeando las 3 tablas de pedidos (`ordenes`, `subordenes_factura` y `orden_items`) con integridad referencial y congelamiento de precios históricos.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Diccionario de Datos:** `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`
* **Tablas de Base de Datos:** `ordenes`, `subordenes_factura`, `orden_items`.
* **Reglas de Negocio:**
  * `RN-005`: Estructura para Split Order (1 Orden Madre relacionada con N Subórdenes por proveedor).
  * `RN-006`: Formato de número de comprobante único correlativo (`SIM-F001-%08d`) y congelamiento del precio unitario en `orden_items`.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Enums y Entidades JPA
- [x] Enums: `EstadoOrden` (`PENDIENTE`, `PROCESANDO`, `PAGADO`, `CANCELADO`), `EstadoSuborden` (`PENDIENTE_DESPACHO`, `EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`, `CANCELADO`).
- [x] Entidad `Orden.java`:
  * Mapeo de `ordenes`: `id`, `uuid`, `codigoOrden` (UNIQUE), `comprador` (`@ManyToOne` con `Usuario`), montos (`montoSubtotal`, `montoIgv`, `montoTotal`), datos fiscales y método de pago simulado, `@OneToMany` hacia `SubordenFactura`.
- [x] Entidad `SubordenFactura.java`:
  * Mapeo de `subordenes_factura`: `id`, `uuid`, `orden`, `proveedor` (`@ManyToOne` con `Usuario`), `numeroComprobante` (UNIQUE), `subtotal`, `igv`, `total`, `@OneToMany` hacia `OrdenItem`.
- [x] Entidad `OrdenItem.java`:
  * Mapeo de `orden_items`: `id`, `suborden`, `producto` (`@ManyToOne`), `cantidad`, `precioUnitario` congelado, `subtotal`.

### 3.2. Repositorios Spring Data JPA
- [x] `OrdenRepository.java`: consultas por comprador paginado, `findByCodigoOrden`, y `findMaxId()` para correlativos persistentes.
- [x] `SubordenFacturaRepository.java`: consultas por proveedor paginado, `findByNumeroComprobante`, y `findMaxId()`.
- [x] `OrdenItemRepository.java`: consultas por suborden.

### 3.3. Pruebas de Integración de Persistencia (`DataJpaTest`)
- [x] Tests en `OrderRepositoryTest` verificando guardado en cascada de una Orden con Subórdenes e Ítems.
- [x] Tests en `SubordenRepositoryTest` verificando restricciones `UNIQUE` sobre códigos de orden y números de comprobante.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [x] Mapeo JPA compatible con PostgreSQL (`ddl-auto=update`) y H2 en modo PostgreSQL.
- [x] Integridad referencial sin cascadas destructivas hacia catálogos maestros.
- [x] Pruebas `@DataJpaTest` (`OrderRepositoryTest`, `SubordenRepositoryTest`) pasan en verde.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=OrderRepositoryTest,SubordenRepositoryTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Entidades | Repositorios |
| :--- | :--- | :--- | :--- |
| `RF-05`, `RF-06` | `RN-005`, `RN-006` | `Orden.java`, `SubordenFactura.java`, `OrdenItem.java` | `OrdenRepository`, `SubordenFacturaRepository`, `OrdenItemRepository` |
