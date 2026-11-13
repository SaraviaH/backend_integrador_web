# Sprint-B04 — Entidades JPA y Persistencia de Órdenes y Split Order

> **Área Técnica:** Backend  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-orders-persistence` hacia `develop`  
> **Dependencias Previas:** `Sprint-B03_Catalogo_Publico_B2B`

---

## 1. Objetivo del Sprint
Implementar las entidades JPA, enums, repositorios Spring Data y pruebas de persistencia para el soporte transaccional de compras mayoristas y el patrón arquitectural **Split Order**, mapeando las 3 tablas de pedidos (`ordenes`, `subordenes_factura` y `orden_items`) creadas en `Sprint-G02`, con integridad referencial y congelamiento de precios históricos.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Diccionario de Datos:** `02_Fase_Diseno_y_Arquitectura/03_Base_de_Datos/MODELO_Y_DICCIONARIO_BD.md`
* **Tablas de Base de Datos:** `ordenes`, `subordenes_factura`, `orden_items`.
* **Reglas de Negocio:**
  * `RN-005`: Estructura para Split Order (1 Orden Madre relacionada con N Subórdenes por proveedor).
  * `RN-006`: Formato de número de comprobante único correlativo (`F001-%08d`) y congelamiento del precio unitario en `orden_items`.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Enums y Entidades JPA
- [ ] Enums: `EstadoOrden` (`PENDIENTE`, `PROCESANDO`, `PAGADO`, `CANCELADO`), `EstadoSuborden` (`PENDIENTE_DESPACHO`, `EN_PREPARACION`, `DESPACHADO`, `ENTREGADO`, `CANCELADO`).
- [ ] Entidad `Orden.java`:
  * Mapeo de `ordenes`: `id`, `uuid`, `codigoOrden` (UNIQUE), `comprador` (`@ManyToOne` con `Usuario`), montos (`montoSubtotal`, `montoIgv`, `montoTotal`), datos fiscales del receptor (`rucReceptor`, `razonSocialReceptor`, `direccionFiscal`), `@OneToMany` hacia `SubordenFactura`.
- [ ] Entidad `SubordenFactura.java`:
  * Mapeo de `subordenes_factura`: `id`, `uuid`, `orden`, `proveedor` (`@ManyToOne` con `Usuario`), `numeroComprobante` (UNIQUE), `subtotal`, `igv`, `total`, `@OneToMany` hacia `OrdenItem`.
- [ ] Entidad `OrdenItem.java`:
  * Mapeo de `orden_items`: `id`, `suborden`, `producto` (`@ManyToOne`), `cantidad`, `precioUnitario` congelado, `subtotal`.

### 3.2. Repositorios Spring Data JPA
- [ ] `OrdenRepository.java`: `findByCompradorId(Long compradorId, Pageable pageable)`, `findByCodigoOrden(String codigo)`.
- [ ] `SubordenFacturaRepository.java`: `findByProveedorId(Long proveedorId, Pageable pageable)`, `findByNumeroComprobante(String comprobante)`.
- [ ] `OrdenItemRepository.java`: consultas por suborden.

### 3.3. Pruebas de Integración de Persistencia (`DataJpaTest`)
- [ ] Escribir tests que verifiquen el guardado en cascada de una Orden con 2 Subórdenes y 4 Ítems en base local.
- [ ] Verificar que las restricciones `UNIQUE` impidan duplicar números de comprobante o códigos de orden.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Mapeo JPA 100% libre de advertencias de Hibernate.
- [ ] No existen cascadas destructivas sobre órdenes cerradas.
- [ ] Pruebas `@DataJpaTest` pasan en verde verificando la integridad referencial.

---

## 5. Plan de Verificación y Comandos
```bash
cd compunex-backend
mvn test -Dtest=OrderRepositoryTest,SubordenRepositoryTest
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Entidades | Repositorios |
| :--- | :--- | :--- | :--- |
| `RF-05`, `RF-06` | `RN-005`, `RN-006` | `Orden.java`, `SubordenFactura.java`, `OrdenItem.java` | `OrdenRepository`, `SubordenFacturaRepository` |
