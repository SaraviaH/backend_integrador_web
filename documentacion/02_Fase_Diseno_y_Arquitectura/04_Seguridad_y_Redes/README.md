# Seguridad y redes

**Fase:** 02. Diseño.

## Qué es y por qué se utiliza

Diseñar controles según activos, exposición y consecuencias de abuso. La seguridad se integra en el desarrollo y necesita límites de confianza claros desde el diseño.

**Fundamento:** [NIST SSDF 1.1](https://csrc.nist.gov/pubs/sp/800/218/final). La organización y los campos siguientes son una síntesis de esta biblioteca, no un formato obligatorio de esas fuentes.

## Qué se hace

1. Identificar actores, activos, datos sensibles y fronteras de confianza.
2. Definir autenticación, autorización, validación, comunicaciones y secretos pertinentes.
3. Relacionar amenazas con controles y pruebas, y registrar riesgos residuales.

## Qué no se hace

- No declarar seguridad por usar cifrado o tokens sin verificar permisos.
- No imponer productos de red o controles que no correspondan al riesgo.

## Qué aplicar según el caso

| Riesgo o necesidad | Práctica de diseño | Qué dejar comprobable |
|---|---|---|
| No conocer quién actúa | Autenticación y gestión de sesión | Origen de identidad, expiración y cierre/revocación pertinentes |
| Acceso indebido a una operación o dato | Autorización por acción y recurso | Política de rol, propiedad o atributos; comprobación en servidor |
| Entradas no confiables | Validación y manejo seguro de datos | Tipos, límites, errores y operaciones permitidas |
| Exposición de credenciales o datos | Gestión de secretos y minimización | Quién accede, qué se guarda y qué no aparece en logs |
| Comunicación entre partes | Límites de confianza y protección de transporte | Origen/destino, identidad del servicio y permisos necesarios |
| Consumo abusivo o dependencia fallida | Límites y recuperación pertinentes | Cuotas, timeouts, alertas y comportamiento degradado según riesgo |

Combinar las medidas necesarias a partir de amenazas concretas. Ni un token acredita permisos sobre todos los recursos ni CORS autentica un cliente. [OWASP: autorización](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recomienda políticas verificables y comprobación de acceso por petición.

## Ejemplo didáctico ilustrativo (Plantilla de Matriz de Control de Acceso)

> [!IMPORTANT]
> **AVISO DE NEUTRALIDAD Y PLANTILLA (NO VINCULANTE):**  
> La siguiente matriz de permisos es **estrictamente un ejemplo didáctico e ilustrativo**. **No debe tomarse en serio ni como una política impuesta.** No representa ningún proyecto real previo. **El usuario y su equipo deciden qué roles, permisos y políticas de seguridad aplicar.**

A modo puramente didáctico, se ilustra una política de control de acceso basada en roles (RBAC):

| Operación | Rol Estándar (Usuario) | Rol Gestor / Administrador | Control Previsto |
|---|---|---|---|
| Consultar sus propios recursos | Permitido | Según responsabilidad acordada | Verificar identidad del token y pertenencia del recurso |
| Consultar recursos de otro usuario | Denegado por defecto | Solo si su alcance lo autoriza | Política explícita de autorización y trazabilidad |
| Crear o solicitar recursos | Si está habilitado | Según flujo autorizado | Identidad obtenida de la sesión y validación de reglas |
| Administrar roles o habilitación | Denegado | Si cuenta con el permiso | Comprobar claims de autorización en el servidor |

El backend valida el acceso aunque alguien invoque directamente la interfaz sin utilizar la pantalla. No basta con ocultar controles. Las pruebas previstas incluyen acceso del propietario, intento de otra identidad, sesión expirada y permisos insuficientes; los resultados se documentan cuando se ejecuten.

### Diseño a registrar

- Datos personales que se necesitan y su finalidad.
- Identidad y permisos en cada frontera, incluidos servicios si existen.
- Eventos de auditoría pertinentes sin contraseñas ni secretos.
- Amenazas pendientes y quién decide el riesgo residual.

El caso es didáctico. No declara que un rol, una política de red o una tecnología concreta basten para cumplir una normativa.

## Plantilla de trabajo

Completar en el documento del proyecto o enlazar la fuente donde ya conste la decisión. Usar solo los campos pertinentes y justificar lo no aplicable; conservar hechos, hipótesis y decisiones diferenciados.

| Campo | Contenido o referencia del proyecto |
|---|---|
| Activo y límite de confianza | |
| Amenaza y consecuencia | |
| Control, ubicación y responsable | |
| Permisos, secretos y comunicaciones | |
| Prueba prevista y riesgo residual | |

## Recursos para aplicar el área

**Skills:** [desarrollo-seguro](../../../02_Skills/09_Seguridad_y_Privacidad/desarrollo-seguro/SKILL.md).

**Plantillas canónicas, cuando se elija el método:**

- [amenazas_controles_template.md](../../../02_Skills/09_Seguridad_y_Privacidad/desarrollo-seguro/assets/plantillas/amenazas_controles_template.md)

## Resultado y comprobación

Controles verificables y responsabilidades de protección definidas. Vincular decisiones y controles con su evidencia real y declarar lo pendiente.

[README de la fase](../README.md) · [Índice del ciclo](../../README.md).
