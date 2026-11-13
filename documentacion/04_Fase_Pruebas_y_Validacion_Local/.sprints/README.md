# .sprints/ — Sprints de Pruebas y Validación Local (QA)

> **Propósito:** Almacenar las especificaciones técnicas (`SPEC.md`) de cada sprint de pruebas de la Fase 04.

---

## 📁 Estructura

```text
.sprints/
├── README.md                          # Esta guía
└── Sprint-QA01_Plantilla/             # Plantilla canónica para instanciar sprints de testing
    └── SPEC.md                        # Especificación SDD de pruebas con tareas humanas y de agente
```

---

## 🏃 Ciclo de un Sprint de QA

1. **Instanciar el SPEC:** Copiar `Sprint-QA01_Plantilla/SPEC.md` en una nueva subcarpeta `Sprint-QA<NN>_<Nombre>/`.
2. **Definir Tareas:** Asignar qué tareas realiza la IA (scripts, escaneos automáticos) y cuáles realiza el humano (exploración, celular físico, Postman).
3. **Ejecutar:** Correr las pruebas, reportar defectos en `MEMORY_QA.md` y archivar evidencias.
4. **Cierre:** Verificar el DoD del sprint con visto bueno del Product Owner.
