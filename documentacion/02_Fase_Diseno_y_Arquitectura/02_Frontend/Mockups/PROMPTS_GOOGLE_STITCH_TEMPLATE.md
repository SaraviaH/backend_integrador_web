# Prompts Google Stitch — 27 pantallas del MVP de COMPUNEX

Referencia visual aprobada: [mockup de inicio](mockups-generados/inicio-compunex-propuesta-v1.png). Sistema visual: [DESIGN.md](DESIGN.md). Proyecto: [COMPUNEX en Stitch](https://stitch.google.com/projects/13508621404817753476?pli=1). Los IDs corresponden al [inventario completo](INVENTARIO_PANTALLAS_POR_ROL.md): se omiten P-08 y P-27 a P-35 porque están propuestos para una etapa posterior. El administrador sigue siendo parte de la plataforma; sus pantallas requieren definir alcance y no forman parte de estos 27 prompts MVP.

## Uso

Genera primero P-01 y conserva el mismo proyecto y sistema de diseño. Para cada pantalla copia el **prompt base** y después su bloque específico. Cada prompt solicita una vista de escritorio; revisa después su adaptación a 375 px. Los nombres, productos e importes son ficticios. Las vistas son diseños propuestos, no evidencia de implementación. Contacto visible, datos exactos y permisos pendientes deben resolverse antes de construir.

## Prompt base

```text
Diseña UNA pantalla web responsive en español para COMPUNEX, comunidad y marketplace B2B de hardware. Toma como referencia visual la portada aprobada: fotografía realista de componentes, fondo blanco y gris azulado #F5F7FA, tinta azul profundo #142238, azul #2456C6, bordes #D9E1EA. Titulares editoriales con Source Serif 4 en portada; Manrope legible para navegación, formularios y paneles. Interfaz elegante, cálida, útil y con identidad tecnológica, no dashboard genérico. Contenido de máximo 1280 px en escritorio, separación consistente, fotografías de hardware, tarjetas y tablas legibles, bordes suaves y acciones bien jerarquizadas. En móvil adapta a 375 px sin desbordamiento y con controles táctiles de 48 px. Etiquetas visibles, foco y errores claros, contraste AA y estados con texto. No inventes cifras, reseñas ni funcionalidades; usa únicamente datos de ejemplo ficticios. Pedidos y comprobantes son simulados: no mostrar cobro real ni comprobante tributario oficial. La empresa compra sin ser proveedor y puede activar ventas después.
```

## Pantallas del MVP

### P-01 — Inicio

**Perfil:** Visitante

```text
Cabecera con logo, buscador, Inicio, Catálogo, Cómo funciona, carrito y acceso. Carrusel amplio con imagen realista de hardware, flechas, indicadores y botón de pausa: «Conecta con el mundo del hardware» y acción «Explorar catálogo». Debajo, categorías visuales, sección «Una comunidad para crecer» con proveedores y publicaciones de ejemplo, pasos Explora / Conecta / Compra, productos destacados y llamada a publicar. La sección social es concepto visual pendiente de alcance: sin likes, comentarios o chat como funciones aprobadas.
```

### P-02 — Categorías

**Perfil:** Visitante

```text
Cabecera de tienda, ruta Inicio / Categorías y título «Explora por categorías». Mosaico de categorías de hardware con fotografía, nombre y enlace; selecciona Almacenamiento y muestra subcategorías y acceso al catálogo filtrado. Sin contadores inventados.
```

### P-03 — Catálogo y búsqueda

**Perfil:** Visitante

```text
Buscador visible, ruta y título Catálogo; filtros por categoría y búsqueda, cuadrícula de hardware con imagen, nombre, proveedor, precio referencial en USD y pedido mínimo. Orden visual claro y paginación; en móvil filtros accesibles y tarjetas adaptables.
```

### P-04 — Detalle de producto

**Perfil:** Visitante

```text
Ruta de navegación, galería de SSD NVMe y ficha con título, proveedor, precio referencial USD, pedido mínimo, cantidad y botón Agregar al carrito. Incluye especificaciones técnicas y botón Ver contacto. Mostrar validación de mínimo; producto propio no se puede comprar. Acceso al contacto de visitantes aún por decidir.
```

### P-05 — Contacto del proveedor

**Perfil:** Visitante / empresa

```text
Presenta un diálogo accesible sobre la ficha con nombre del proveedor y datos de ejemplo: correo y teléfono, acciones de correo y llamada y cerrar. Explica que son datos de contacto directo. Visibilidad y consentimiento están pendientes; no inventar chat ni mensajería interna.
```

### P-06 — Iniciar sesión

**Perfil:** Visitante

```text
Página de acceso con marca, volver al catálogo, composición con imagen de hardware contenida y tarjeta con correo, contraseña, mostrar contraseña e Ingresar. Enlace Crear cuenta de empresa. Errores bajo los campos y sin autenticación social no acordada.
```

### P-07 — Registro de empresa

**Perfil:** Visitante

```text
Formulario de registro de empresa que permita comprar sin ser proveedor: cuenta, datos de empresa y datos fiscales indicados como ejemplos sujetos a definición. Acción Crear cuenta. Explica que podrá habilitar ventas después; no exigir publicación ni perfil proveedor. Validaciones claras y acceso a inicio de sesión.
```

### P-09 — Carrito

**Perfil:** Comprador

```text
Filas de productos agrupadas por proveedor con miniatura, precio unitario, cantidad, mínimo, subtotal y eliminar. Resumen separado con subtotal, IGV estimado y total estimado, y botón Continuar. Ejemplo coherente: 650 + 550 = 1200 USD, IGV 216, total 1416. Confirmación definitiva en servidor; no permitir productos propios.
```

### P-10 — Datos de facturación

**Perfil:** Comprador

```text
Checkout con progreso visual y formulario etiquetado RUC, razón social, dirección fiscal y método de pago simulado como datos de ejemplo sujetos a contrato. Resumen lateral agrupado por proveedor, importes estimados y acción Revisar pedido. Sin pago real ni campos bancarios.
```

### P-11 — Revisión del pedido

**Perfil:** Comprador

```text
Revisión previa a confirmar con datos fiscales, productos por proveedor, cantidades, importes estimados y enlaces para volver a editar. Acción Confirmar pedido simulado y aviso de comprobante por proveedor. No decir que ya se pagó.
```

### P-12 — Confirmación de compra

**Perfil:** Comprador

```text
Mensaje de éxito «Pedido simulado confirmado», identificador de ejemplo, resumen de proveedores y total confirmado; enlaces Ver comprobantes y Mis compras. Indicar que no hubo cobro real y que los comprobantes son simulados.
```

### P-13 — Comprobantes simulados

**Perfil:** Comprador

```text
Dos comprobantes, uno por proveedor, identificados como simulados, con emisor, receptor, artículos y totales. Ejemplo A subtotal 650, IGV 117, total 767 USD; B 550, IGV 99, total 649; total 1416. Enlaces a detalle de compra. Sin apariencia de documento tributario válido.
```

### P-14 — Mis compras

**Perfil:** Comprador

```text
Vista de historial con fecha, código, total y enlace Ver detalle para órdenes propias. Tabla limpia en escritorio y tarjetas en móvil, con estado vacío orientado a explorar catálogo.
```

### P-15 — Detalle de compra

**Perfil:** Comprador

```text
Ruta Mis compras / Pedido, código y fecha, artículos agrupados por proveedor, cantidades, importes y acceso a comprobantes simulados. No añadir cancelación, seguimiento ni estados logísticos no acordados.
```

### P-16 — Mi cuenta

**Perfil:** Empresa autenticada

```text
Página de cuenta con información personal y de empresa en lectura, datos fiscales y acceso a seguridad; sección «¿Quieres vender?» con enlace para activar perfil proveedor. Edición y campos definitivos sujetos a contrato.
```

### P-17 — Cambiar contraseña

**Perfil:** Usuario autenticado

```text
Sección seguridad con contraseña actual, nueva contraseña y confirmación; etiquetas visibles, controles para mostrar y botón Guardar. Incluye mensaje de error en contraseña actual como variante y enlace a cuenta.
```

### P-18 — Activar perfil proveedor

**Perfil:** Empresa autenticada

```text
Formulario de perfil comercial con razón social, nombre comercial, identificación fiscal, teléfono y dirección como ejemplos sujetos a definición. Explica que habilitar ventas es opcional y se activa inmediatamente al completar los datos; botón Activar perfil proveedor y validaciones junto a campos.
```

### P-19 — Panel del proveedor

**Perfil:** Proveedor

```text
Panel de bienvenida con navegación lateral Mis productos, Ventas recibidas, Perfil comercial y volver a tienda. Acciones destacadas Crear producto y Ver ventas; información útil sin estadísticas inventadas ni administración de productos ajenos.
```

### P-20 — Mis productos

**Perfil:** Proveedor

```text
Tabla paginada y búsqueda de productos propios, con miniatura, nombre, categoría, precio, mínimo, estado y acciones Ver, Editar, Pausar/Activar, Eliminar; botón Nuevo producto. Estado visible con texto. Confirmación para eliminación lógica como variante.
```

### P-21 — Crear producto

**Perfil:** Proveedor

```text
Formulario ordenado con información general, categoría, condiciones mayoristas, especificaciones clave/valor e imágenes por URL. Acciones Guardar y Cancelar, etiquetas y errores bajo campos. Evita inventar opciones comerciales o campos no confirmados.
```

### P-22 — Detalle de producto propio

**Perfil:** Proveedor

```text
Panel de ficha propia con imagen, nombre, estado, datos comerciales, especificaciones y galería. Acciones Editar y volver a Mis productos; no mostrar botón de compra del producto propio.
```

### P-23 — Editar producto

**Perfil:** Proveedor

```text
Mismo formulario de creación con datos de ejemplo precargados, secciones comerciales, especificaciones e imágenes. Botones Guardar cambios y Cancelar, errores claros y contexto del producto.
```

### P-24 — Ventas recibidas

**Perfil:** Proveedor

```text
Tabla o tarjetas de subórdenes del proveedor con identificador, fecha, comprador, total y Ver detalle. Incluir estado vacío sin cifras inventadas ni afirmaciones de pagos o envíos reales.
```

### P-25 — Detalle de venta

**Perfil:** Proveedor

```text
Detalle de una suborden propia con comprador, artículos, cantidades, subtotal, IGV y total, y comprobante simulado. El detalle y permisos del contrato aún deben precisarse; no añadir logística o pago real.
```

### P-26 — Perfil comercial

**Perfil:** Proveedor

```text
Consulta del nombre comercial, razón social, identificación fiscal y contacto del proveedor, con avisos de privacidad y regreso al panel. La edición y visibilidad del contacto quedan sujetas a definición.
```

### P-36 — Acceso denegado

**Perfil:** Transversal

```text
Vista 403 amable con título Acceso no disponible, explicación breve de permisos insuficientes y botón Volver a una sección permitida. Sin revelar datos privados.
```

### P-37 — Página no encontrada

**Perfil:** Transversal

```text
Página 404 con cabecera sencilla, mensaje Página no encontrada, explicación breve y botón Volver al catálogo; icono discreto y espacio visual equilibrado.
```

## Estados y revisión

Para cada pantalla diseña, cuando aplique, carga, vacío y error con acción de recuperación. Prioriza ejemplos específicos: búsqueda sin resultados, credenciales incorrectas, mínimo incumplido, producto propio no comprable, carrito vacío, datos fiscales inválidos, perfil proveedor incompleto, eliminación lógica confirmada y contraseña actual incorrecta. Los estados no se contabilizan como pantallas adicionales. No añadas chat, likes, comentarios ni seguimiento de envíos hasta acordar su alcance.
