# Frontend y Atomic Design

**Fase:** 02. Diseño.

## Qué es y por qué se utiliza

Diseñar la experiencia y una estructura coherente de componentes. Atomic Design relaciona piezas y composiciones de interfaz; ayuda a mantener consistencia y reutilización. Sus niveles no son una secuencia rígida ni toda la arquitectura del frontend.

**Fundamento:** [Brad Frost: Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) · [W3C WAI: evaluar accesibilidad](https://www.w3.org/WAI/test-evaluate/). La organización y los campos siguientes son una síntesis de esta biblioteca, no un formato obligatorio de esas fuentes.

## Qué se hace

1. Definir recorridos, navegación, permisos y estados de carga, vacío, error y recuperación.
2. Aplicar Atomic Design para organizar controles, composiciones, plantillas y páginas; relacionarlos con tokens y responsabilidades.
3. Definir contratos de componentes y límites de estado y acceso a datos; preparar comprobaciones de interacción y accesibilidad.

## Qué no se hace

- No asumir que cinco carpetas garantizan buena arquitectura ni extraer componentes solo por parecido visual.
- No confundir prototipo o catálogo aislado con conexión real a datos.

## Qué aplicar según el caso

| Necesidad | Práctica vinculada a la skill | Decisión de diseño |
|---|---|---|
| Entender la tarea | Diseño centrado en usuarios | Recorrido, navegación, errores y recuperación |
| Organizar piezas y composiciones | Atomic Design | Responsabilidades, consumidores y variantes por nivel |
| Mantener coherencia visual | Tokens semánticos y sistema de diseño | Valores compartidos y significado de sus variantes |
| Evitar estado contradictorio | Propiedad explícita del estado | Qué pertenece al componente, a la pantalla, a la sesión o a los datos remotos |
| Conectar datos | Contratos y adaptadores de acceso | Tipos, carga, fallos, cancelación y actualización pertinente |
| Permitir uso asistido | Diseño accesible | Foco, teclado, etiquetas, contraste y texto ampliado |
| Preparar construcción comprobable | Estados y contratos de componente | Entradas, eventos, resultados y criterios de interacción |

La [skill Atomic Design](../../../02_Skills/03_Frontend_y_UI_UX/atomic-design/SKILL.md) conecta inventario, responsabilidades y composición. El framework y la librería de estado se eligen después de comprender el problema; no se deducen de la clasificación atómica.

## Ejemplo didáctico ilustrativo (Plantilla de Referencia de Atomic Design)

> [!IMPORTANT]
> **AVISO DE NEUTRALIDAD Y PLANTILLA (NO VINCULANTE):**  
> El siguiente ejemplo de componentes es **puramente didáctico e ilustrativo**. **No debe tomarse en serio ni como una arquitectura obligatoria.** No representa ningún proyecto real. **El usuario y su equipo deciden qué pantallas, componentes y jerarquía implementar.**

Estos componentes son una propuesta didáctica de referencia para ilustrar los niveles de Atomic Design, no nombres obligatorios de carpetas:

| Nivel | Pieza propuesta (Ejemplo Didáctico) | Responsabilidad |
|---|---|---|
| Átomo | Botón o campo de texto con label | Entrada o acción accesible con contrato pequeño |
| Molécula | Campo con buscador y botón de filtrado | Agrupa campo, etiqueta y acción |
| Organismo | Tarjeta de elemento o grilla de resultados | Coordina listado, selección y estados de resultado |
| Plantilla | Disposición de página dividida (Split Layout) | Ordena cabecera, contenido principal y barra lateral |
| Página | Vista completa de consulta y detalle | Sitúa la composición en el recorrido con datos y permisos |

El texto que se está escribiendo puede ser estado local; los filtros que deben sobrevivir a la navegación pueden representarse en la ruta. Los resultados remotos tienen una fuente de actualización definida. La identidad del usuario autenticado no se toma como autorización por el simple hecho de aparecer en la UI.

Diseñar explícitamente carga, ausencia de resultados (empty state), error de red y fallos transaccionales. Tras una confirmación real se actualiza el estado mostrado; ocultar un botón en cliente no reemplaza el control de permisos del backend.

### Comprobaciones previstas

- Navegar, buscar y seleccionar con teclado y foco comprensible.
- Distinguir una petición pendiente de un resultado vacío o fallido.
- Verificar entradas y eventos del componente antes de componer el recorrido.
- Al seleccionar TDD, convertir una interacción en prueba primero; añadir revisión visual y accesibilidad.

Las categorías y la relación entre conjunto y piezas se apoyan en [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/). La comprobación asistida se complementa con [W3C WAI](https://www.w3.org/WAI/test-evaluate/); la tabla y la distribución de estado son decisiones didácticas propias.

## Plantilla de trabajo

### Composición con Atomic Design

Usa estos niveles para relacionar las partes con la interfaz completa. No son cinco pasos obligatoriamente secuenciales ni exigen cinco carpetas. Los tokens recogen decisiones visuales compartidas; no constituyen un sexto nivel.

| Nivel | Responsabilidad en el diseño | Piezas del proyecto y consumidores |
|---|---|---|
| Átomos | Unidades básicas de interfaz | |
| Moléculas | Grupos de piezas con una función conjunta | |
| Organismos | Secciones con una responsabilidad reconocible | |
| Plantillas | Estructura y disposición de las secciones | |
| Páginas | Composición situada en un recorrido y contenido concreto | |

### Arquitectura que acompaña a la composición

Definir también módulos, propiedad del estado, acceso a datos, rutas, permisos y tratamiento de fallos. Atomic Design ayuda a organizar la interfaz, pero esas decisiones requieren contratos y límites propios. Una pieza se extrae por responsabilidad y variación estables, no para llenar una categoría.

### Ficha de decisiones

Completar en el documento del proyecto o enlazar la fuente donde ya conste la decisión. Usar solo los campos pertinentes y justificar lo no aplicable; conservar hechos, hipótesis y decisiones diferenciados.

| Campo | Contenido o referencia del proyecto |
|---|---|
| Recorrido y estados de la pantalla | |
| Mockups y prototipos visuales (Google Stitch / Figma) | [Mockups/README.md](./Mockups/README.md) |
| Átomos, moléculas, organismos, plantillas y páginas pertinentes | |
| Tokens y variantes compartidas | [Mockups/DESIGN_TEMPLATE.md](./Mockups/DESIGN_TEMPLATE.md) |
| Prompts de generación de pantallas con IA | [Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md](./Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md) |
| Componente: responsabilidad, entradas, eventos y estados | |
| Estado local/compartido, datos, rutas y permisos | |
| Criterios de accesibilidad y pruebas previstas | |

## Recursos y Plantillas de Frontend

* **Arquitectura de Frontend:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)
* **Módulo de Mockups y Prototipado Visual:** [`Mockups/README.md`](./Mockups/README.md)
* **Tokens y Sistema de Diseño:** [`Mockups/DESIGN_TEMPLATE.md`](./Mockups/DESIGN_TEMPLATE.md)
* **Prompts Estructurados para Google Stitch:** [`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`](./Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md)
* **Depósito de Pantallas Generadas:** [`Mockups/mockups-generados/`](./Mockups/mockups-generados/README.md)

**Skills complementarias:** [atomic-design](../../../02_Skills/03_Frontend_y_UI_UX/atomic-design/SKILL.md) · [diseno-centrado-en-usuarios](../../../02_Skills/03_Frontend_y_UI_UX/diseno-centrado-en-usuarios/SKILL.md) · [sistema-de-diseno-y-accesibilidad](../../../02_Skills/03_Frontend_y_UI_UX/sistema-de-diseno-y-accesibilidad/SKILL.md).

**Plantillas canónicas de componentes:**
- [contrato_componente_template.md](../../../02_Skills/03_Frontend_y_UI_UX/atomic-design/assets/plantillas/contrato_componente_template.md)
- [verificacion_accesibilidad_template.md](../../../02_Skills/03_Frontend_y_UI_UX/sistema-de-diseno-y-accesibilidad/assets/plantillas/verificacion_accesibilidad_template.md)

## Resultado y comprobación

Mapa de composición, contratos y decisiones de estado/datos coherentes con el recorrido. Vincular decisiones y controles con su evidencia real y declarar lo pendiente.

[README de la fase](../README.md) · [Índice del ciclo](../../README.md).
