# Inventario completo de pantallas — COMPUNEX B2B

Propuesta de diseño: **37 pantallas** y **20 variantes visuales**, total **57 mockups**. Una pantalla es una vista de tarea; las variantes son capturas de estados, no funciones adicionales. Crear y editar pueden compartir componente. La clasificación MVP/posterior es una propuesta de priorización, no prueba de implementación. Las pantallas administrativas se proponen para una siguiente etapa; la gestión excepcional requiere reglas acordadas. Ver [decisiones y flujos](DEFINICION_PRODUCTO_Y_FLUJOS.md).

| ID | Pantalla | Perfil | Prioridad | Objetivo |
|---|---|---|---|---|
| P-01 | Inicio | Público | MVP | Portada con propuesta de valor, categorías, acceso al catálogo y productos de ejemplo. |
| P-02 | Categorías | Público | MVP | Categorías y subcategorías con acceso a sus productos. |
| P-03 | Catálogo y búsqueda | Público | MVP | Búsqueda, filtros de categoría, productos, proveedor, precio y pedido mínimo. |
| P-04 | Detalle de producto | Público | MVP | Galería, especificaciones, precio referencial, pedido mínimo y acceso a datos de contacto. |
| P-05 | Contacto del proveedor | Público / empresa | MVP | Panel o diálogo con correo y teléfono del proveedor, con visibilidad y consentimiento pendientes. |
| P-06 | Iniciar sesión | Público | MVP | Correo, contraseña y enlace a registro. |
| P-07 | Registro de empresa | Público | MVP | Datos de cuenta y empresa sin exigir alta como proveedor; campos definitivos por definir. |
| P-08 | Cómo funciona | Público | Posterior | Explicar exploración, compra simulada, contacto y publicación opcional. |
| P-09 | Carrito | Comprador | MVP | Productos agrupados por proveedor, cantidades, mínimo, eliminación y resumen estimado. |
| P-10 | Datos de facturación | Comprador | MVP | Datos fiscales del comprador y método simulado según contrato objetivo. |
| P-11 | Revisión del pedido | Comprador | MVP | Revisión de datos e importes estimados por proveedor antes de confirmar. |
| P-12 | Confirmación de compra | Comprador | MVP | Orden confirmada y resumen; indicar que la transacción es simulada. |
| P-13 | Comprobantes simulados | Comprador | MVP | Comprobante por proveedor con emisor, receptor, productos e importes. |
| P-14 | Mis compras | Comprador | MVP | Lista de pedidos propios y acceso al detalle. |
| P-15 | Detalle de compra | Comprador | MVP | Datos de la orden, productos e importes y comprobantes asociados. |
| P-16 | Mi cuenta | Empresa autenticada | MVP | Consulta de cuenta y datos de empresa; edición sujeta a definición. |
| P-17 | Cambiar contraseña | Autenticado | MVP | Contraseña actual y nueva; validación y confirmación. |
| P-18 | Activar perfil proveedor | Empresa autenticada | MVP | Formulario de datos comerciales necesarios, aviso de habilitación inmediata al completarlo. |
| P-19 | Panel del proveedor | Proveedor | MVP | Accesos a productos, ventas y perfil sin indicadores inventados. |
| P-20 | Mis productos | Proveedor | MVP | Listado paginado de productos propios, búsqueda, acciones y estados. |
| P-21 | Crear producto | Proveedor | MVP | Formulario de producto, condiciones mayoristas, especificaciones e imágenes. |
| P-22 | Detalle de producto propio | Proveedor | MVP | Datos e imágenes del producto propio con acceso a edición. |
| P-23 | Editar producto | Proveedor | MVP | Formulario precargado para modificar producto propio. |
| P-24 | Ventas recibidas | Proveedor | MVP | Listado de ventas propias y acceso al detalle. |
| P-25 | Detalle de venta | Proveedor | MVP | Detalle de suborden y comprobante simulado del proveedor; contrato por precisar. |
| P-26 | Perfil comercial | Proveedor | MVP | Datos comerciales del proveedor; edición sujeta a contrato. |
| P-27 | Panel de administración | Administrador | Posterior | Accesos administrativos y visión general sin métricas ficticias. |
| P-28 | Usuarios y empresas | Administrador | Posterior | Consulta de cuentas y estados; acciones y permisos por definir. |
| P-29 | Detalle de cuenta | Administrador | Posterior | Información y estado de la cuenta, acciones sujetas a reglas. |
| P-30 | Proveedores | Administrador | Posterior | Listado de perfiles comerciales, sin asumir aprobación previa. |
| P-31 | Detalle de proveedor | Administrador | Posterior | Datos de proveedor y estado de cuenta con permisos por definir. |
| P-32 | Administrar categorías | Administrador | Posterior | Gestión de categorías y subcategorías con reglas pendientes. |
| P-33 | Pedidos de plataforma | Administrador | Posterior | Consulta para atención de incidencias, condicionada a privacidad y permisos. |
| P-34 | Detalle administrativo de pedido | Administrador | Posterior | Información mínima necesaria para incidencias; acceso sujeto a definición. |
| P-35 | Intervención excepcional | Administrador | Posterior | Revisión excepcional de publicación problemática y acción con motivo y trazabilidad, no gestión cotidiana. |
| P-36 | Acceso denegado | Transversal | MVP | Mensaje de permisos insuficientes con regreso a una sección permitida. |
| P-37 | Página no encontrada | Transversal | MVP | Estado 404 claro con regreso al catálogo. |

## Variantes de estado

| ID | Base | Estado |
|---|---|---|
| V01 | P-03 | Sin resultados de búsqueda |
| V02 | P-04 | Cantidad inferior al mínimo |
| V03 | P-04 | Producto propio no comprable |
| V04 | P-06 | Credenciales incorrectas |
| V05 | P-07 | Registro con errores |
| V06 | P-09 | Carrito vacío |
| V07 | P-09 | Carrito con validación de cantidad |
| V08 | P-10 | Datos fiscales inválidos |
| V09 | P-14 | Sin compras |
| V10 | P-18 | Perfil proveedor incompleto |
| V11 | P-18 | Proveedor habilitado |
| V12 | P-20 | Sin productos |
| V13 | P-20 | Confirmar eliminación lógica |
| V14 | P-20 | Confirmar cambio de estado |
| V15 | P-21 | Formulario con errores |
| V16 | P-24 | Sin ventas |
| V17 | P-17 | Contraseña actual incorrecta |
| V18 | P-35 | Confirmar intervención excepcional |
| V19 | P-03 | Error de carga con reintento |
| V20 | P-03 | Sin conexión |

## Conteo por área

| Área | Pantallas |
|---|---:|
| Público y acceso | 8 |
| Compra y cuenta | 9 |
| Proveedor | 9 |
| Administración | 9 |
| Transversal | 2 |
| **Total** | **37** |

Las pantallas compartidas se cuentan una sola vez. MVP propuesto: 27 pantallas; posterior: 10. Las 20 variantes se priorizan según los flujos que se implementen. El diseño de empresa compradora independiente, contacto y habilitación de proveedor requiere actualizar requisitos, modelo de roles y contratos; los endpoints existentes no prueban su implementación. Definir la visibilidad del contacto, condiciones de privacidad, datos fiscales y permisos administrativos antes de construirlos.
