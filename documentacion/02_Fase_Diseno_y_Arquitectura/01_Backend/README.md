# Backend

**Fase:** 02. Diseño.

> [!IMPORTANT] Protocolo del Agente IA: Elección Soberana de Arquitectura
> Esta es una skill general y neutral. **El agente de IA tiene estrictamente prohibido imponer una arquitectura predeterminada** (Monolito, Hexagonal, Clean, etc.).
> Antes de diseñar, el agente debe preguntar al usuario:
> 💬 *"¿Qué arquitectura tienes definida para este proyecto según tus notas de investigación, o prefieres que revisemos los requisitos para sugerirte alternativas técnicas con sus pros y contras?"*
> Para el marco de principios SOLID, catálogo de Patrones GoF y la plantilla de definición técnica del proyecto, consultar [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Qué es y por qué se utiliza

Definir responsabilidades y límites del procesamiento y del dominio. La arquitectura debe hacer comprensible dónde están las reglas y cómo interactúan las partes.

**Fundamento:** [C4 Model](https://c4model.com/). La organización y los campos siguientes son una síntesis de esta biblioteca, no un formato obligatorio de esas fuentes.

## Qué se hace

1. Delimitar módulos, reglas de dominio, invariantes y dependencias.
2. Definir entradas, salidas, permisos, errores y límites de transacción.
3. Representar interacciones necesarias y registrar alternativas con costes de acoplamiento y operación.

## Qué no se hace

- No equiparar un dominio con un microservicio ni seleccionar arquitectura sin requisitos.
- No implementar el backend completo para cerrar un encargo solo de diseño.

## Qué aplicar según el caso

Estas decisiones pertenecen a niveles distintos y pueden combinarse:

| Decisión | Práctica u opción | Cuándo aporta | Qué dejar definido |
|---|---|---|---|
| Comprensión del negocio | DDD estratégico | Vocabulario ambiguo, reglas o responsabilidades que cambian por contexto | Lenguaje, contextos, propietarios e interacciones |
| Modelo de reglas | DDD táctico | Invariantes complejas que necesitan protección explícita | Entidades, objetos de valor, agregados y límites transaccionales pertinentes |
| Trabajo sencillo | Modelo de aplicación simple | Operaciones acotadas con pocas reglas de negocio | Casos de uso y validaciones suficientes, sin introducir agregados artificiales |
| Unidad de despliegue | Monolito modular | Conviene un despliegue conjunto con límites internos claros | Módulos con contratos y dependencias controladas; propiedad de datos |
| Distribución | Microservicios | Hay una necesidad real de despliegue, aislamiento o escalado independiente y capacidad operativa | Servicios y contratos, propiedad de datos, fallos de red, consistencia y observabilidad |
| Dependencias internas | Puertos y adaptadores / arquitectura hexagonal | Se necesita aislar reglas de UI, persistencia o proveedores | Puertos de entrada/salida y adaptadores; dirección de dependencias |
| Comunicación de decisiones | C4 y ADR | Es necesario compartir límites y justificar elecciones | Vistas suficientes y decisiones con alternativas y consecuencias |

**DDD no es una alternativa excluyente a monolito modular o microservicios:** trata el modelo del dominio y sus límites. La distribución trata cómo ejecutar y desplegar las partes. Un contexto delimitado no obliga a crear un servicio.

Fuentes: [Lewis y Fowler: microservicios](https://martinfowler.com/articles/microservices.html), [Fowler: Monolith First](https://martinfowler.com/bliki/MonolithFirst.html) y [prerrequisitos operativos](https://martinfowler.com/bliki/MicroservicePrerequisites.html). La separación mediante puertos y adaptadores procede de [Cockburn: arquitectura hexagonal](https://alistair.cockburn.us/hexagonal-architecture/). Son criterios para evaluar, no una receta universal.

## Ejemplo didáctico ilustrativo (Plantilla de Referencia)

> [!IMPORTANT]
> **AVISO DE NEUTRALIDAD Y PLANTILLA (NO VINCULANTE):**  
> El siguiente desglose modular es un **ejemplo didáctico e ilustrativo**. **No debe tomarse en serio ni como una arquitectura impuesta.** No representa ningún proyecto real previo. **El usuario es el único que decide la arquitectura y el dominio que desea implementar en su backend.**

A modo puramente didáctico, supongamos un escenario donde un equipo elige un enfoque modular:

| Módulo propuesto (Ejemplo) | Responsabilidad | Límite relevante |
|---|---|---|
| *[Módulo A - Catálogo/Maestro]* | Describir entidades base y registros | Expone consultas sobre registros; otras partes no modifican sus datos internos libremente |
| *[Módulo B - Usuarios/Actores]* | Gestionar habilitación de actores | Publica una interfaz de consulta de habilitación |
| *[Módulo C - Transaccional]* | Procesar transacciones y reglas clave | Protege las invariantes de negocio del caso de uso |

El caso de uso de ejemplo consulta habilitación y disponibilidad por interfaces, aplica la regla de negocio y persiste dentro de la transacción definida. Un puerto de persistencia permite comprobar la lógica sin depender del detalle de una base concreta; la integración de persistencia se comprueba aparte.

No se separan servicios por tener tres nombres de módulo. Si una capacidad necesita independencia, se revisan sus límites, datos, contratos y costes de operación antes de extraerla.

### Decisiones que debes poder explicar

- Qué requisito justifica la organización y por qué se descartaron alternativas relevantes.
- Quién puede cambiar los datos y qué reglas deben cumplirse juntas.
- Qué dependencias están permitidas entre módulos.
- Cómo se comprobará el comportamiento y qué supuesto haría revisar la arquitectura.

## Plantilla de trabajo

Completar en el documento del proyecto o enlazar la fuente donde ya conste la decisión. Usar solo los campos pertinentes y justificar lo no aplicable; conservar hechos, hipótesis y decisiones diferenciados.

| Campo | Contenido o referencia del proyecto |
|---|---|
| Módulo y responsabilidad | |
| Reglas e invariantes a cargo | |
| Interfaz, errores y permisos | |
| Dependencias y transacciones | |
| Decisión arquitectónica y alternativas | |
| Requisitos y restricciones que motivan la elección | |
| Forma de despliegue y capacidad de operación | |
| Contratos, propiedad de datos y dependencias permitidas | |
| Consecuencias y condición para revisar la decisión | |

## Recursos y Plantillas de Backend

* **Arquitectura de Backend:** [`ARCHITECTURE.md`](./ARCHITECTURE.md)
* **Product Backlog de Backend (Fase 03):** [`../../03_Fase_Construccion_y_Desarrollo/01_Backend/BACKLOG_BACKEND.md`](../../03_Fase_Construccion_y_Desarrollo/01_Backend/BACKLOG_BACKEND.md)
* **Bitácora de Desarrollo de Backend (Fase 03):** [`../../03_Fase_Construccion_y_Desarrollo/01_Backend/MEMORY_BACKEND.md`](../../03_Fase_Construccion_y_Desarrollo/01_Backend/MEMORY_BACKEND.md)

**Skills complementarias:** [ddd](../../../02_Skills/02_Arquitectura_e_Integracion/ddd/SKILL.md) · [c4](../../../02_Skills/02_Arquitectura_e_Integracion/c4/SKILL.md) · [adr](../../../02_Skills/02_Arquitectura_e_Integracion/adr/SKILL.md).

**Plantillas canónicas, cuando se elija el método:**

- [decision_template.md](../../../02_Skills/02_Arquitectura_e_Integracion/adr/assets/plantillas/decision_template.md)
- [modelo_dominio_template.md](../../../02_Skills/02_Arquitectura_e_Integracion/ddd/assets/plantillas/modelo_dominio_template.md)
- [vista_arquitectura_template.md](../../../02_Skills/02_Arquitectura_e_Integracion/c4/assets/plantillas/vista_arquitectura_template.md)

## Resultado y comprobación

Diseño de responsabilidades e interfaces que pueda implementarse y probarse. Vincular decisiones y controles con su evidencia real y declarar lo pendiente.

[README de la fase](../README.md) · [Índice del ciclo](../../README.md).
