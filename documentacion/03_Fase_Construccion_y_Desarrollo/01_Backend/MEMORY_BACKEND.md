# MEMORY_BACKEND.md — Bitácora y Estado Activo del Agente Backend

> **Área Técnica:** Backend (Spring Boot 3.2.0)  
> **Proyecto:** COMPUNEX — Marketplace B2B de Cómputo  
> **Responsable:** Agente Backend  
> **Última Actualización:** 2026-11-13

---

## 1. Estado Actual de Ejecución

* **Sprint Activo:** Ninguno (En espera de `Sprint-G02` de DDL).
* **Endpoints Existentes en Repositorio:** 14 endpoints listos para auditoría (`Sprint-B01`).
* **Endpoints Aditivos Pendientes:** 10 endpoints (`Sprint-B02` a `Sprint-B08`).
* **Total Sprints Backend:** 8 sprints técnicos + `Sprint-B_Audit` (Gate 1).

---

## 2. Registro de Sprints Backend (8 Sprints + Gate 1)

| Sprint | Rama GitFlow | Estado | Endpoints Verificados | Test Suite |
| :--- | :--- | :---: | :---: | :---: |
| `Sprint-B01_Audit_y_Refactor_Base_Existente` | `feature/backend-base-audit-refactor` | `PENDIENTE` | 0 / 14 | 0 passing |
| `Sprint-B02_Auth_Aditivo_Empresa_y_Activacion` | `feature/backend-auth-additive` | `BLOQUEADO` | 0 / 3 | 0 passing |
| `Sprint-B03_Catalogo_Publico_B2B` | `feature/backend-public-catalog` | `BLOQUEADO` | 0 / 2 | 0 passing |
| `Sprint-B04_Persistencia_Ordenes_y_Split_Order` | `feature/backend-orders-persistence` | `BLOQUEADO` | Persistencia DDL JPA | 0 passing |
| `Sprint-B05_Checkout_Transaccional_y_Facturacion` | `feature/backend-checkout-split-order` | `BLOQUEADO` | 0 / 1 | 0 passing |
| `Sprint-B06_Historial_Compras_y_Detalle_Orden` | `feature/backend-orders-history` | `BLOQUEADO` | 0 / 2 | 0 passing |
| `Sprint-B07_Ventas_Proveedor_y_Despacho` | `feature/backend-provider-sales` | `BLOQUEADO` | 0 / 2 | 0 passing |
| `Sprint-B08_Auditoria_AOP_y_Admin_Moderacion` | `feature/backend-admin-audit-aop` | `BLOQUEADO` | 0 / 2 | 0 passing |
| `Sprint-B_Audit` (Gate 1) | `release/gate-1-backend-core` | `BLOQUEADO` | 0 / 24 | 0 passing |

---

## 3. Decisiones de Arquitectura y Patrones Aplicados
* **Reutilización y Refactor de la Base Existente:** `compunex-backend` ya provee 14 endpoints. El `Sprint-B01` se enfoca en auditar y alinear sus DTOs con `CONTRATOS_JSON.md`, sin reescribir innecesariamente código que ya funciona.
* **Separación de Sprints Transaccionales:** La persistencia de órdenes se aísla en `Sprint-B04` para validar el modelo relacional antes de implementar el servicio complejo de checkout en `Sprint-B05`.
* **Split Order ACID:** `OrderServiceImpl` ejecuta la agrupación por proveedor, validación de inventario y recálculo de montos dentro de una única transacción atómica.
* **Aspecto de Auditoría:** `Sprint-B08` implementa `@Aspect` para separar la preocupación de logging estructurado de la lógica de negocio.
