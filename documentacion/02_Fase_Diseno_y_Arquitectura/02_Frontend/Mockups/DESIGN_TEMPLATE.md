# Propuesta de sistema visual — COMPUNEX B2B

> Las decisiones de producto se recogen en [DEFINICION_PRODUCTO_Y_FLUJOS.md](DEFINICION_PRODUCTO_Y_FLUJOS.md).

Guía propuesta para mockups web responsivos; requiere revisión visual y validación de accesibilidad. Los prompts concretos están en [PROMPTS_GOOGLE_STITCH_TEMPLATE.md](PROMPTS_GOOGLE_STITCH_TEMPLATE.md) y la cobertura en [INVENTARIO_PANTALLAS_POR_ROL.md](INVENTARIO_PANTALLAS_POR_ROL.md).

## Identidad y composición

Marketplace mayorista de hardware con una identidad profesional, actual y funcional. La información comercial tiene prioridad sobre la decoración: producto, proveedor, precio referencial y mínimo deben distinguirse a primera vista. Usar fotografías de producto coherentes, espacios generosos sin desperdiciar superficie y tablas de densidad cómoda. Evitar ilustraciones dominantes, degradados intensos, paneles con métricas inventadas y sombras pesadas.

En tienda, cabecera superior con búsqueda, categorías y acceso contextual. En gestión, navegación lateral para proveedor o administrador, mostrando solo acciones autorizadas. Escritorio: contenido máximo de 1280 px y rejilla de 12 columnas; en móvil, apilar secciones, convertir tablas en tarjetas cuando sea necesario y evitar desbordamiento horizontal. Diseñar y revisar a 1280 y 375 px; no se propone una aplicación móvil nativa.

## Tokens propuestos

| Uso | Valor |
|---|---|
| Fondo | `#F5F7FA` |
| Superficie | `#FFFFFF` |
| Texto principal | `#142238` |
| Texto secundario | `#475569` |
| Acción principal | `#2456C6` |
| Borde y separadores | `#D9E1EA` |
| Éxito | `#166534` |
| Advertencia | `#92400E` |
| Error | `#B91C1C` |

Inter con alternativa sans-serif del sistema; títulos 30–32 px, subtítulos 20–24 px, cuerpo 16 px y texto secundario mínimo 14 px. Espaciado en múltiplos de 8 px; radios de 10–12 px; bordes finos y sombras suaves. Las combinaciones concretas deben verificarse: no se supone que todos los colores de la tabla cumplan contraste en cualquier fondo.

## Componentes y estados

Campos con etiqueta visible, ayuda y errores asociados; un botón principal claro por tarea; controles con foco visible y objetivo táctil de al menos 48 × 48 px en móvil. Los estados usan texto e icono además de color. Diseñar carga, vacío, error y desconexión, así como validaciones y confirmaciones pertinentes. No representar la desconexión como capacidad de funcionamiento offline.

Comprobar contraste WCAG AA, navegación con teclado, nombres accesibles, escala de texto hasta 200 % y preferencia de movimiento reducido en la implementación. Los mockups no constituyen evidencia de cumplimiento. Los comprobantes y la operación de compra se identifican como simulados; no se presentan cobros reales ni integración tributaria.
