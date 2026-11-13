# Base de datos

**Fase:** 02. Diseño.

## Qué es y por qué se utiliza

Definir estructura e integridad de persistencia y su evolución. Los datos requieren reglas explícitas para conservar relaciones y rechazar estados inválidos.

**Fundamento:** [PostgreSQL: restricciones](https://www.postgresql.org/docs/current/ddl-constraints.html). La organización y los campos siguientes son una síntesis de esta biblioteca, no un formato obligatorio de esas fuentes.

## Qué se hace

1. Identificar entidades, claves, relaciones, nulabilidad y restricciones.
2. Justificar normalización, consultas e índices y definir precisión, unidades y fechas.
3. Preparar diccionario, compatibilidad, migraciones y recuperación de datos existentes.

## Qué no se hace

- No elegir el motor o una clave sustituta como demostración de normalización.
- No tratar una propuesta de migración como migración ejecutada.

## Qué aplicar según el caso

| Necesidad | Práctica u opción | Qué justificar |
|---|---|---|
| Entender información y relaciones | Modelo conceptual y lógico | Entidades, identidad, cardinalidad y reglas |
| Integridad de operaciones relacionadas | Modelo relacional y transacciones | Restricciones y cambios que deben ser atómicos |
| Evitar anomalías | Normalización | Dependencias funcionales reales; elegir un ID no demuestra una forma normal |
| Recuperar agregados documentales | Modelo documental | Forma de acceso, tamaño y límites de consistencia |
| Consultas repetidas de alta demanda | Caché o proyección de lectura | Fuente canónica, actualización, caducidad e inconsistencia tolerada |
| Buscar texto o similitud | Índice de búsqueda o vectorial, si se necesita | Consulta requerida y evaluación de relevancia; no sustituye automáticamente datos transaccionales |
| Evolucionar datos existentes | Migraciones versionadas | Compatibilidad, orden, restauración y recuperación |

Seleccionar el modelo por acceso, integridad y operación antes del producto. Incorporar otra tecnología solo si aporta un beneficio justificado. [Microsoft: modelos de almacenamiento](https://learn.microsoft.com/en-us/azure/architecture/data-guide/technology-choices/understand-data-store-models).

## Ejemplo didáctico ilustrativo (Plantilla de Modelado Relacional)

> [!IMPORTANT]
> **AVISO DE NEUTRALIDAD Y PLANTILLA (NO VINCULANTE):**  
> El siguiente modelo relacional es **estrictamente un ejemplo didáctico e ilustrativo**. **No debe tomarse en serio ni como una estructura impuesta.** No representa ningún proyecto real. **El usuario y su equipo deciden qué motor de base de datos, qué entidades, claves y restricciones utilizar.**

A modo puramente didáctico, un diseño relacional puede ilustrarse con entidades maestras y transaccionales:

| Entidad (Ejemplo Didáctico) | Información propia | Relación propuesta |
|---|---|---|
| *[Entidad Maestra A]* | Descripción del concepto base | Tiene varios elementos dependientes |
| *[Elemento Instancia]* | Identidad de la instancia o ítem físico | Pertenece a la entidad maestra |
| *[Actor / Usuario]* | Datos y estado del usuario | Puede generar transacciones |
| *[Registro Transaccional]* | Transacción con marcas temporales | Conecta un elemento con un actor durante un período |

Separar la entidad maestra de sus instancias evita duplicar descripciones por cada copia. Si se necesita representar relaciones N:M, analizar tablas intermedias en lugar de almacenar listas desnormalizadas sin integridad. Justificar las dependencias del modelo concreto, no declarar 3FN solo por dividir tablas.

### Reglas a diseñar y comprobar

- Las referencias foráneas (`FK`) corresponden a registros existentes (`ON DELETE RESTRICT` o según política).
- Las restricciones de unicidad evitan duplicados en operaciones concurrentes.
- Las marcas temporales son coherentes (la fecha de cierre no es anterior a la de creación).
- La política de eliminación lógica (*soft delete*) o conservación define qué ocurre al desactivar registros con historial.

La segunda regla necesita protección ante peticiones concurrentes: diseñar la transacción y, cuando el motor lo permita, una restricción o índice adecuado para préstamos activos. Una comprobación previa de disponibilidad sin protección de concurrencia es insuficiente.

Las restricciones de clave, nulabilidad, unicidad y referencia se pueden concretar siguiendo [la documentación del motor](https://www.postgresql.org/docs/current/ddl-constraints.html). El modelo del ejemplo y las reglas propuestas son ilustrativos y deben acordarse en cada proyecto.

## Plantilla de trabajo

Completar en el documento del proyecto o enlazar la fuente donde ya conste la decisión. Usar solo los campos pertinentes y justificar lo no aplicable; conservar hechos, hipótesis y decisiones diferenciados.

| Campo | Contenido o referencia del proyecto |
|---|---|
| Entidades, claves y cardinalidades | |
| Dependencias funcionales y restricciones | |
| Diccionario de campos y representaciones | |
| Consultas e índices previstos | |
| Migración, compatibilidad y recuperación | |

## Recursos para aplicar el área

**Skills:** [modelado-y-normalizacion](../../../02_Skills/05_Bases_de_Datos/modelado-y-normalizacion/SKILL.md).

**Plantillas canónicas, cuando se elija el método:**

- [modelo_diccionario_template.md](../../../02_Skills/05_Bases_de_Datos/modelado-y-normalizacion/assets/plantillas/modelo_diccionario_template.md)

## Resultado y comprobación

Modelo y diccionario con restricciones comprobables. Vincular decisiones y controles con su evidencia real y declarar lo pendiente.

[README de la fase](../README.md) · [Índice del ciclo](../../README.md).
