# Problemática y Soluciones — COMPUNEX B2B

> **Fase del SDLC:** 01 · Planificación y Análisis de Requisitos  
> **Propósito:** Comprender el problema de negocio del catálogo mayorista de hardware y justificar la solución conceptual seleccionada.

---

## 🎯 1. Análisis de la Problemática y Solución Elegida

| Campo de Análisis | Detalle / Evidencia en el Proyecto |
| :--- | :--- |
| **Problema Observado** | Los proveedores mayoristas de hardware manejan sus catálogos de forma fragmentada (archivos locales, correos, listas sin formato), lo que genera inconsistencias en precios referenciales, pedidos mínimos y especificaciones técnicas. |
| **Personas Afectadas** | Proveedores mayoristas de hardware (`PROVEEDOR`), administradores de plataforma (`ADMIN`) y compradores/consultores de catálogo. |
| **Impacto Actual / Evidencia** | Pérdida de tiempo al actualizar productos, dificultad para filtrar por categoría o título, y ausencia de control administrativo sobre productos activos o descontinuados. |
| **Causas Raíz Identificadas** | 1. Falta de un repositorio centralizado de productos con estructura técnica uniforme.<br>2. Ausencia de flujo de autoservicio seguro para que el proveedor publique y actualice su propio catálogo.<br>3. Falta de separación de permisos entre gestión propia del proveedor y administración de la plataforma. |
| **Alternativas Evaluadas** | **A.** Continuar con hojas de cálculo compartidas (bajo costo inicial, nulo control de acceso ni validación).<br>**B.** CMS genérico monolítico (rígido para reglas mayoristas como `modelo_comercial`, `pedido_minimo` y `unidades_por_paquete`).<br>**C.** Plataforma Web B2B desacoplada (API REST + SPA responsiva) orientada a catálogo mayorista. |
| **Solución Elegida y Motivo** | **Alternativa C (Plataforma Web B2B desacoplada):** Permite modelar reglas mayoristas específicas, aislar la seguridad por roles (`PROVEEDOR`/`ADMIN`), ofrecer consumo paginado y mantener una interfaz web moderna y responsiva. |
| **Hipótesis Críticas Pendientes** | Confirmar con el Product Owner/docente si el motor de persistencia final requerido para la entrega es PostgreSQL o MySQL. |
