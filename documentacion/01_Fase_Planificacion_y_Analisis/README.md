# 01. Planificación y Análisis de Requisitos

> **Fase del SDLC:** Fase 01 · Planificación y Análisis  
> **Propósito:** Comprender la necesidad del negocio, estudiar a los usuarios, delimitar el alcance funcional y de calidad (RF y RNF), y priorizar el primer incremento antes de diseñar o programar.  
> **Regla de Oro:** Prioriza comprender el problema, el valor para el usuario y los límites. Un experimento técnico aislado puede reducir incertidumbre sin convertirse automáticamente en código de producción.

---

## 🧭 1. Qué es y por qué se realiza esta fase

Es el trabajo metódico de comprender una necesidad humana y de negocio, validar su viabilidad técnica y operativa, y convertirla en un catálogo de requisitos verificables.

**Fundamentos de Ingeniería de Sistemas:** [SEBoK: Business or Mission Analysis](https://sebokwiki.org/wiki/Business_or_Mission_Analysis) · [SEBoK: Stakeholder Needs and Requirements](https://sebokwiki.org/wiki/Stakeholder_Needs_and_Requirements).

Permite invertir el tiempo de desarrollo en un problema justificado y acordar con exactitud qué se espera construir antes de comprometer esfuerzos de diseño (Fase 02) o construcción (Fase 03).

---

## 🗺️ 2. Estructura y Áreas de Trabajo de la Fase

Esta fase se organiza en un artefacto canónico central y cuatro áreas especializadas:

### 📄 Artefacto Central de Visión:
* [`README_RETO.md`](README_RETO.md): Documento ejecutivo de la problemática de negocio, personas beneficiarias, límites estrictos del reto y criterios de éxito del producto.

### 📂 Carpetas de Especialidad:
| Área de Trabajo | Documento | Qué se define |
| :--- | :--- | :--- |
| **01. Problemática y Soluciones** | [`01_Problematica_y_Soluciones/README.md`](01_Problematica_y_Soluciones/README.md) | Investigación del problema real, evidencias de dolor del usuario y comparación de alternativas conceptuales. |
| **02. Requisitos y Alcance** | [`02_Requisitos_y_Alcance/README.md`](02_Requisitos_y_Alcance/README.md) | Catálogo formal de Requisitos Funcionales (`RF-XXX`), Requisitos No Funcionales (`RNF-XXX`), sintaxis EARS, priorización dual (1-10) y exclusiones. |
| **03. Viabilidad y Riesgos** | [`03_Viabilidad_y_Riesgos/README.md`](03_Viabilidad_y_Riesgos/README.md) | Evaluación de factibilidad técnica, compatibilidad con filosofía **Local-First**, dependencias críticas y matriz de riesgos. |
| **04. Planificación y Priorización** | [`04_Planificacion_y_Priorizacion/README.md`](04_Planificacion_y_Priorizacion/README.md) | Priorización dual (cuantitativa 1-10 y cualitativa MoSCoW), asignación a Sprints iniciales vs finales/extras, y Criterio de Preparación (DoR). |

---

## 🚫 3. Qué NO se hace en la Fase 01 (Límites Infranqueables)

1. **No confundir experimentación y producción:** Se permiten prototipos y pruebas acotadas para validar hipótesis; registra su propósito y limitaciones.
2. **No imponer ni elegir arquitectura:** La arquitectura se analiza y acuerda en la **Fase 02 (Diseño)**. Aquí no se decide si será hexagonal, monolito o microservicios.
3. **No imponer prácticas de construcción:** Los requisitos definen necesidades verificables; usa experimentos y criterios de aceptación cuando aporten evidencia.
4. **No inventar necesidades ni métricas:** Toda afirmación debe sustentarse en el reto real o marcarse como hipótesis sujeta a comprobación.

---

## 🔗 4. Cómo se Conecta la Fase 01 con las Siguientes Fases

Los entregables de esta fase son el insumo directo e inviolable para las fases posteriores:
* **Entrada a [`../02_Fase_Diseno_y_Arquitectura/DOMAIN.md`](../02_Fase_Diseno_y_Arquitectura/DOMAIN.md):** Los actores y conceptos de los RF forman el borrador del Lenguaje Ubicuo (Momento 1).
* **Entrada a [`../02_Fase_Diseno_y_Arquitectura/AUDITORIA_COHERENCIA_FASE1_A_FASE2.md`](../02_Fase_Diseno_y_Arquitectura/AUDITORIA_COHERENCIA_FASE1_A_FASE2.md):** La lista de `RF-XXX` y `RNF-XXX` es la base de la matriz de trazabilidad que auditará que el diseño de Fase 02 no omita nada ni invente cosas que nadie pidió.

---

## ✅ 5. Criterio de Cierre (Definition of Done de Fase 01)

Para dar por concluida la Fase 01 y avanzar formalmente a la Fase 02:
- [ ] La visión general y el reto están acordados en [`README_RETO.md`](README_RETO.md).
- [ ] El catálogo de requisitos (`RF-001`..) y restricciones de calidad (`RNF-001`..) está completo y sin ambigüedades en [`02_Requisitos_y_Alcance/README.md`](02_Requisitos_y_Alcance/README.md).
- [ ] La viabilidad técnica y operativa en local (**Local-First**) está comprobada en [`03_Viabilidad_y_Riesgos/README.md`](03_Viabilidad_y_Riesgos/README.md).
- [ ] Los requisitos del primer incremento están priorizados mediante MoSCoW en [`04_Planificacion_y_Priorizacion/README.md`](04_Planificacion_y_Priorizacion/README.md).
- [ ] El usuario o Product Owner ha dado su aprobación formal al alcance del incremento.

---

[← Volver al Índice General de la Metodología](../README.md) · [Avanzar a Fase 02: Diseño y Arquitectura →](../02_Fase_Diseno_y_Arquitectura/README.md)
