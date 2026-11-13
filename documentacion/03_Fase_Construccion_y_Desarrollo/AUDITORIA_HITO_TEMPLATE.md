# AUDITORIA_HITO_TEMPLATE.md — Plantilla de Auditoría de Quality Gate

> **Uso:** Esta plantilla define el informe formal de auditoría para validar el cumplimiento de un Quality Gate antes de autorizar la integración o pase de fase.

---

# AUDITORIA_[NUMERO] — [Título del Quality Gate]

> **Área / Track:** [Backend / Frontend / Transversal E2E]  
> **Auditor Responsable:** [Agente Auditor / Coordinador Macro]  
> **Fecha de Ejecución:** [YYYY-MM-DD]  
> **Resultado del Gate:** [APROBADO / RECHAZADO / CONDICIONADO]

---

## 1. Alcance de la Auditoría
[Descripción de los sprints y entregables evaluados en este hito].

---

## 2. Checklist de Validación Estricta

### 2.1. Calidad de Código y Compilación
- [ ] Compilación 100% limpia sin advertencias críticas.
- [ ] Cobertura de pruebas unitarias/integración conforme al estándar.
- [ ] Cero dependencias vulnerables o desactualizadas.

### 2.2. Fidelidad de Contratos y Base de Datos
- [ ] Endpoints implementados responden exactamente con los esquemas de `CONTRATOS_JSON.md`.
- [ ] Códigos de estado HTTP conformes (200, 201, 204, 400, 401, 403, 404, 422).
- [ ] Integridad referencial en base de datos (claves foráneas, índices, restricciones UNIQUE).

### 2.3. Reglas de Negocio
- [ ] Reglas aplicadas y verificadas con tests automatizados.
- [ ] Manejo centralizado de excepciones (respuestas de error uniformes).

---

## 3. Matriz de Resultados por Elemento

| Elemento Auditado | Tipo (Endpoint/Pantalla/Tabla) | Estado Verificación | Observaciones / Hallazgos |
| :--- | :--- | :---: | :--- |
| `POST /api/v1/...` | Endpoint | PASS | Respuesta 200/400 conforme |
| `P-01` | Pantalla Angular | PASS | 4 estados implementados |

---

## 4. Hallazgos y Bloqueos Identificados
* **Críticos (Bloquean Gate):** [Ninguno / Detalle]
* **Menores (No bloquean):** [Detalle]

---

## 5. Veredicto Final y Pasos Siguientes
* **Decisión:** [APROBADO para siguiente track / RECHAZADO con correcciones requeridas]
* **Firma / Autorización:** [Agente Auditor / PO]
