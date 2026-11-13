# 02. Diseño

Revisión: 2026-11-06. Consulta las áreas que correspondan al incremento; no es necesario completar toda la carpeta.

## Qué es la fase

Transforma requisitos en decisiones sobre estructura, interacción, datos e interfaces. Explica responsabilidades y consecuencias antes de construir. C4 ayuda a representar el sistema y sus partes con vistas comprensibles; las decisiones de diseño conectan esas vistas con requisitos y restricciones. [C4 Model](https://c4model.com/) · [Brad Frost: Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/).

## Por qué se realiza

Permite anticipar dependencias, fallos e integración y reducir decisiones improvisadas durante la construcción.

## Qué se hace

1. Definir módulos, responsabilidades y contratos entre partes.
2. Diseñar recorridos, estados, componentes, datos y controles de seguridad pertinentes.
3. Evaluar alternativas técnicas y registrar decisiones, costes y compatibilidad.
4. Preparar integración, migraciones y comprobaciones de las decisiones.

## Qué no se hace

- Añadir funciones sin volver a requisitos o presentar una propuesta como implementación.
- Confundir una biblioteca visual con toda la arquitectura del frontend.
- Elegir microservicios, un motor o un framework por obligación de la plantilla.

Estos límites describen el propósito de la fase. Si hace falta un experimento de otra disciplina para reducir incertidumbre, delimitar su alcance y registrar qué demuestra.

## Áreas y plantillas de trabajo

### Artefactos Principales de la Fase:
- [`ARCHITECTURE.md`](ARCHITECTURE.md): Principios SOLID, Patrones GoF y plantilla neutral para la arquitectura elegida por el usuario.
- [`DOMAIN.md`](DOMAIN.md): Modelo de dominio conceptual, lenguaje ubicuo y reglas de negocio puras.
- [`TECH_STACK.md`](TECH_STACK.md): Pila tecnológica congelada, justificación técnica y alternativas locales.
- [`AUDITORIA_COHERENCIA_FASE1_A_FASE2.md`](AUDITORIA_COHERENCIA_FASE1_A_FASE2.md): Quality Gate y matriz de trazabilidad bidireccional que audita la coherencia entre Fase 01 y Fase 02 antes de autorizar el desarrollo en Fase 03.

### Carpetas de Trabajo por Especialidad:
| Área | Qué preparar |
|---|---|
| [Backend](01_Backend/README.md) | Definir responsabilidades y límites del procesamiento y del dominio. |
| [Frontend y Atomic Design](02_Frontend/README.md) | Diseñar la experiencia, componentes, tokens y prototipado visual / Google Stitch ([`Mockups/`](02_Frontend/Mockups/README.md)). |
| [Base de datos](03_Base_de_Datos/README.md) | Definir estructura e integridad de persistencia y su evolución. |
| [Seguridad y redes](04_Seguridad_y_Redes/README.md) | Diseñar controles según activos, exposición y consecuencias de abuso. |
| [Integración e interfaces](05_Integracion_y_APIs/README.md) | Acordar cómo se comunican consumidor y proveedor (Contratos JSON y OpenAPI). |

Cada README de área explica su uso y contiene campos vacíos para copiar a la documentación del proyecto. Cuando exista una plantilla canónica de una skill, se enlaza y conserva como fuente de su estructura; las fichas de área aportan contexto, no crean una segunda spec, backlog o contrato.

## Prácticas y ejemplos por área

> [!IMPORTANT]
> **AVISO DE NEUTRALIDAD Y PLANTILLA (NO VINCULANTE):**  
> Todo ejemplo conceptual mencionado en esta metodología (como entidades maestras, módulos o transacciones en las tablas siguientes) es **estrictamente ilustrativo, didáctico y no vinculante**. Este documento es una **plantilla neutral y agnóstica**. No representa ningún proyecto real previo ni debe tomarse en serio como una arquitectura predeterminada. **El usuario es el único que decide qué arquitectura, qué dominio y qué tecnologías utilizar en su proyecto.**

| Área | Decisiones que explica el README | Ejemplo didáctico (Ilustrativo / Ficticio) |
|---|---|---|
| Backend | DDD, modelo simple, monolito modular, microservicios, puertos/adaptadores, C4 y ADR | *[Ejemplo didáctico: Catálogo, Socios y Circulación]* |
| Frontend | Atomic Design, tokens, propiedad de estado, datos, navegación y accesibilidad | *[Ejemplo didáctico: Búsqueda y Detalle de Elemento]* |
| Base de datos | Modelo, normalización, transacciones, almacenamiento e integridad | *[Ejemplo didáctico: Entidades maestras y transaccionales]* |
| Seguridad y redes | Identidad, permisos por recurso, secretos y límites de confianza | *[Ejemplo didáctico: Diferencias de acceso por roles]* |
| Integración | Contratos, interfaces síncronas, eventos, compatibilidad y reintentos | *[Ejemplo didáctico: Solicitud y confirmación de evento]* |

Los ejemplos citados son puramente didácticos para ilustrar la coherencia conceptual de la plantilla. No son requisitos, arquitecturas ni métricas que deban copiarse a otros proyectos. DDD, forma de despliegue y dirección de dependencias son decisiones diferentes y el usuario decide libremente cómo combinarlas.

## Resultado y criterio de cierre

**Resultado:** Diseño suficiente, contratos congelados y decisiones técnicas trazadas a requisitos.

**Criterio de Cierre (Quality Gate Obligatorio):**
Superar formalmente la auditoría contenida en [`AUDITORIA_COHERENCIA_FASE1_A_FASE2.md`](AUDITORIA_COHERENCIA_FASE1_A_FASE2.md):
1. Matriz de trazabilidad al 100% (cero requisitos huérfanos, cero componentes fantasma).
2. `DOMAIN.md` sellado y verificado en todas las capas.
3. Aprobación explícita del usuario/PO antes de crear ramas `feature/*` e iniciar la Fase 03.

[Índice del ciclo](../README.md) · [Fase anterior](../01_Fase_Planificacion_y_Analisis/README.md) · [Fase siguiente](../03_Fase_Construccion_y_Desarrollo/README.md).
