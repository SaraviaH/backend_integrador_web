# Definición del producto y flujos — COMPUNEX B2B

Documento de decisiones de producto en evolución. Las decisiones siguientes orientan el diseño; no acreditan que las funciones o contratos existan. La documentación y el backend anteriores requieren adaptación.

## Objetivo

Marketplace web B2B de hardware donde empresas exploran ofertas mayoristas, realizan pedidos con facturación simulada y pueden contactar directamente a proveedores. Una empresa puede comprar sin publicar productos y habilitar posteriormente su perfil proveedor para vender. La cuenta de proveedor también puede comprar a otros proveedores, sin comprar sus propios productos.

## Actores y capacidades

| Actor | Capacidades propuestas |
|---|---|
| Visitante | Explorar inicio, categorías, catálogo y fichas; registrarse o iniciar sesión. El canal de contacto es correo y teléfono; falta decidir si los visitantes pueden verlos. Acceso al carrito por definir. |
| Empresa compradora | Mantener datos necesarios para facturación, comprar y consultar pedidos. No se exige publicar productos. |
| Proveedor | Activar su perfil comercial, administrar sus propios productos, consultar ventas y comprar a otros proveedores. |
| Administrador | Administración general de la plataforma. Funciones concretas propuestas abajo y pendientes de especificación. |

Comprador y proveedor representan capacidades de una misma cuenta de empresa; la implementación de roles, transición a proveedor, permisos y migración respecto al modelo previo (`PROVEEDOR`, `ADMIN`) está pendiente de diseño. No presumir que un cambio en la documentación ya modificó el backend.

## Administración propuesta

- Consultar cuentas y proveedores; activación o suspensión de cuentas sujeta a reglas y confirmación.
- Gestionar categorías, sujeto a definición del alcance.
- Consultar pedidos para atender incidencias, sujeto a permisos y privacidad.
- Intervenir excepcionalmente en una publicación problemática, con motivo y trazabilidad; no sustituye la gestión diaria del proveedor.

Estas capacidades son recomendaciones aceptadas como dirección general; sus permisos, condiciones, campos y contratos requieren especificación antes de implementación. El proveedor conserva el control ordinario de sus productos.

## Flujos propuestos

1. **Exploración y contacto:** inicio → categorías o búsqueda → producto → consultar opción de contacto directo. Mostrar correo y teléfono del proveedor; definir visibilidad, consentimiento y acceso. No implica chat integrado.
2. **Empresa compradora:** registro de empresa → datos necesarios de facturación → catálogo → carrito → autenticación si corresponde → datos de facturación → revisión → confirmación → comprobantes simulados → historial y detalle. No existe cobro real ni integración tributaria real en el alcance actual.
3. **Activar ventas:** empresa autenticada → solicitar o completar perfil proveedor → proporcionar datos comerciales → habilitación inmediata al completar el perfil requerido → crear y gestionar productos → ventas recibidas.
4. **Administración:** acceso administrativo → panel general → funciones administrativas acordadas; intervención excepcional en publicaciones cuando proceda, no gestión cotidiana de productos ajenos.

## Decisiones pendientes

- Visibilidad y consentimiento del correo y teléfono de contacto; decidir si se muestran a visitantes.
- Datos mínimos de registro frente a datos que pueden solicitarse en checkout; validación fiscal y privacidad.
- Campos obligatorios para activar el perfil proveedor, permisos y cambios técnicos de rol.
- Facultades administrativas precisas, registro de acciones y acceso a datos de pedidos.
- Carrito antes del inicio de sesión, cancelación de pedidos y alcance futuro de pagos/envíos.

Las pantallas y contratos anteriores son un punto de partida, no la definición completa de estas decisiones. Ver [inventario](INVENTARIO_PANTALLAS_POR_ROL.md) y [requisitos](../../../01_Fase_Planificacion_y_Analisis/02_Requisitos_y_Alcance/README.md).

## Alcance acordado

Diseñar la plataforma completa y priorizar un MVP implementable. El carrito admite varios proveedores y genera un comprobante simulado por cada uno. La empresa completa su perfil proveedor y queda habilitada inmediatamente, sin aprobación previa.
