# AGENTS.md — Gobernanza adaptable de la metodología

Esta guía complementa las instrucciones superiores, las decisiones del usuario y las reglas del repositorio. No modifica permisos ni autoriza acciones externas. Se aplica cuando el usuario adopta esta metodología; no convierte ejemplos en requisitos.

## Alcance, perfiles y decisiones

| Perfil | Uso | Controles proporcionales |
| --- | --- | --- |
| Exploración | Hipótesis, bocetos y experimentos | Objetivo, límites, resultado y carácter desechable; no presentar prototipos como producción. |
| MVP | Incremento demostrable | Alcance priorizado, diseño y contratos pertinentes, escenarios y pruebas críticas, evidencia y riesgos. |
| Producción | Servicio o producto para usuarios | Lo anterior más controles de seguridad, accesibilidad, operaciones, recuperación y despliegue según riesgo. |

Conserva las restricciones acordadas en cualquier perfil. Ajusta el nivel de detalle al cambio y su riesgo. Los experimentos de análisis y diseño pueden usar código aislado si el usuario y el proyecto lo permiten; no forman parte de producción sin revisión y validación. Requisitos y diseño evolucionan mediante decisiones registradas.

## Fuentes de verdad

| Tema | Fuente preferida |
| --- | --- |
| Objetivo y alcance | Requisitos y decisiones del proyecto |
| Reglas de negocio | Modelo de dominio del proyecto |
| Arquitectura y tecnologías | Arquitectura y decisiones técnicas vigentes |
| Datos e integración | Contrato acordado del proveedor o proyecto |
| Estado del incremento | Backlog general; los backlogs de área enlazan sus tareas |
| Verificaciones | Informe y evidencias de la ejecución concreta |
| Riesgos y decisiones | Bitácora vigente, enlazada a los documentos responsables |

Si hay conflicto, identifica fuentes, fecha y alcance y comunica la discrepancia; no declares un documento como verdad sin verificar. Plantillas son borradores, no evidencia.

## Agentes y calidad

- Revisa contexto y autorizaciones antes de actuar. No vuelvas a preguntar algo decidido y vigente. Pregunta solo si una decisión faltante bloquea una acción o cambia sus resultados de manera material; realiza primero lo independiente.
- Respeta los SPEC y puertas de revisión que el proyecto haya adoptado. Usa escenarios y pruebas proporcionales al riesgo; registra qué se probó realmente, resultados, entorno, fecha y limitaciones.
- No inventes funciones, métricas ni datos de producción; señala hipótesis y ejemplos. Trata datos y credenciales del proyecto según sus límites de acceso.
- Cuando exista trabajo paralelo autorizado, acuerda responsabilidades, archivos y contrato, integra periódicamente, resuelve conflictos y ejecuta pruebas cruzadas. Un mock no sustituye la integración real.
- El usuario elige o acepta la arquitectura. El agente puede recomendar alternativas y resolver decisiones reversibles dentro de su autorización. Herramientas, proveedores y estilos son opciones, no mandatos universales.
- Mantén desarrollo reproducible local siempre que sea viable; registra servicios que necesitan entornos reales. La capacidad del producto de funcionar offline es una decisión separada.
- Sigue el flujo Git existente o acordado; Git Flow es una opción, no una exigencia universal. La revisión y autorización para publicar o desplegar siguen las reglas vigentes. No incluyas secretos en commits.
- Antes de un despliegue, identifica artefacto, entornos, responsable, verificación y recuperación, incluyendo riesgos de pérdida de datos. No supongas que restaurar una copia conserva escrituras posteriores.
- No presupongas marcas, modelos o disponibilidad de agentes: selecciona capacidades acordes al trabajo y respeta las restricciones de la sesión.

## Guías

Consulta [README.md](README.md) y la fase aplicable. Los nombres de archivo son orientativos: adapta rutas a la estructura real del proyecto. No copies esta guía como requisito obligatorio sin aceptación del equipo.
