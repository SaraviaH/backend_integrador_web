# AUDITORIA_CALIDAD_FASE4_A_FASE5.md — Quality Gate de Calidad

> **Fase del SDLC:** Transición Fase 04 (Pruebas) → Fase 05 (Despliegue a Producción)  
> **Propósito:** Puerta de calidad obligatoria que audita la estabilidad, seguridad, accesibilidad y rendimiento del software antes de autorizar la apertura de una rama `release/*` o merge hacia `main`.  
> **Regla de Operación:** Con **1 solo criterio en Rojo**, el pase a producción queda **estrictamente vetado**.

---

## 🚦 1. Semáforo de Decisión y Estado Global

```
┌────────────────────────────────────────────────────────┐
│ ESTADO DE CALIDAD:   [ 🟢 VERDE | 🟡 ÁMBAR | 🔴 ROJO ] │
│ Veredicto:           [ AUTORIZADO / BLOQUEADO ]       │
│ Fecha de Auditoría:  AAAA-MM-DD HH:mm                  │
│ Auditor / PO:        [Nombre o Rol]                    │
└────────────────────────────────────────────────────────┘
```

* 🟢 **VERDE (Autorizado):** 100% de criterios cumplidos, cero bugs bloqueantes o altos, validación en Staging exitosa. Se autoriza la creación de la rama `release/vX.Y.Z`.
* 🟡 **ÁMBAR (Condicionado):** Criterios menores pendientes (deuda técnica leve, bugs cosméticos). Requiere compromiso formal de corrección en `MEMORY.md`.
* 🔴 **ROJO (Bloqueado):** Falla en tests automáticos, bugs críticos abiertos, caídas en Staging o vulnerabilidades de seguridad altas. Prohibido desplegar.

---

## 📋 2. Matriz de Auditoría por Dimensiones de Calidad

### Dimensión A: Cobertura Funcional y Requisitos (Fase 01 ↔ 04)
| Criterio a Verificar | Evidencia / Referencia | Evaluación |
| :--- | :--- | :---: |
| 1. Todos los `RF-XXX` del incremento cuentan con prueba de aceptación verificada | `INFORME_EJECUCION_PRUEBAS.md §1` | `[Cumple / No Cumple]` |
| 2. Los criterios de aceptación de negocio funcionan como esperaba el usuario | Escenarios Given-When-Then ejecutados | `[Cumple / No Cumple]` |
| 3. Cero funciones "fantasma" añadidas fuera del alcance congelado | Comparación contra `README_RETO.md` | `[Cumple / No Cumple]` |

### Dimensión B: Estabilidad Técnica y Pruebas Automáticas
| Criterio a Verificar | Evidencia / Referencia | Evaluación |
| :--- | :--- | :---: |
| 4. 100% de pruebas unitarias y de integración pasando en verde en local | Salida de terminal del test runner | `[Cumple / No Cumple]` |
| 5. Cero regresiones en módulos previamente existentes | Suite completa de tests ejecutada | `[Cumple / No Cumple]` |
| 6. Contratos de API respetados al 100% (cero discrepancias de tipos o schemas) | Validación contra `openapi_template.yaml` | `[Cumple / No Cumple]` |

### Dimensión C: Calidad Visual, Ergonomía y Accesibilidad (WCAG AA)
| Criterio a Verificar | Evidencia / Referencia | Evaluación |
| :--- | :--- | :---: |
| 7. Ratios de contraste cumplen estándar mínimo 4.5:1 (texto normal) y 3:1 (iconos) | Auditoría axe-core / Lighthouse | `[Cumple / No Cumple]` |
| 8. Todo elemento interactivo táctil cuenta con un área mínima de 48×48 dp | Verificación en dispositivos reales | `[Cumple / No Cumple]` |
| 9. Interfaz soporta escalado de texto tipográfico del sistema al 200% sin roturas | Prueba visual con zoom | `[Cumple / No Cumple]` |

### Dimensión D: Validación en Pre-Producción (Staging en Nube)
| Criterio a Verificar | Evidencia / Referencia | Evaluación |
| :--- | :--- | :---: |
| 10. Despliegue exitoso en Railway / Render desde la rama `develop` | URL de Staging activa y respondiendo | `[Cumple / No Cumple]` |
| 11. Conexión estable con base de datos remota de pruebas (Supabase / Postgres) | Registros persistidos en la nube | `[Cumple / No Cumple]` |
| 12. Flujo completo probado en un smartphone real con conexión de red móvil | `INFORME_EJECUCION_PRUEBAS.md §3` | `[Cumple / No Cumple]` |

### Dimensión E: Seguridad y Código Limpio
| Criterio a Verificar | Evidencia / Referencia | Evaluación |
| :--- | :--- | :---: |
| 13. Cero vulnerabilidades críticas o altas en análisis de dependencias (`audit`) | Salida de `npm/pip/cargo/trivy audit` | `[Cumple / No Cumple]` |
| 14. Cero secretos, tokens o contraseñas quemadas en el código fuente | Análisis SAST / GitGuardian local | `[Cumple / No Cumple]` |
| 15. Commits limpios sin mención de IA redactados en modo imperativo técnico | Historial de Git en la rama | `[Cumple / No Cumple]` |

---

## ✍️ 3. Declaración de Pase y Autorización

```text
Por la presente, el equipo técnico y el Product Owner certifican que el incremento 
cumple con los criterios de calidad no negociables y autorizan:

[ ] Abrir la rama release/vX.Y.Z
[ ] Proceder con la Fase 05 (CI/CD y Despliegue Oficial en Producción)

Firma Tech Lead / QA: __________________________    Fecha: _______________
Firma Product Owner:  __________________________    Fecha: _______________
```
