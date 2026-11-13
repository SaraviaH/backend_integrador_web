# Requisitos y Alcance — COMPUNEX B2B

> **Fase del SDLC:** 01 · Planificación y Análisis de Requisitos  
> **Propósito:** Catálogo oficial de Requisitos Funcionales (`RF-XXX`), Requisitos No Funcionales (`RNF-XXX`) y límites de alcance del proyecto.

---

## 📋 1. Catálogo de Requisitos Funcionales (RF)

| ID | Nombre del Requisito | Enunciado Funcional (Sintaxis EARS) | Actor Principal | Prioridad Cualitativa | Puntaje (1-10) | Etapa | Criterio de Aceptación | Método de Verificación |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :--- | :---: |
| **RF-001** | Inicio de sesión | CUANDO un usuario envía credenciales válidas, EL SISTEMA DEBERÁ autenticarlo y emitir un token de sesión con su rol. | Proveedor / Admin | **Alta** | **10 / 10** | Inicial | Responde `200 OK` con token JWT y datos de usuario; rechaza `401` si falla. | Test JUnit + Postman |
| **RF-002** | Registro de proveedor | CUANDO un nuevo proveedor envía sus datos de cuenta y perfil comercial, EL SISTEMA DEBERÁ crear ambos registros transaccionalmente y emitir token de acceso. | Proveedor | **Alta** | **9 / 10** | Inicial | Responde `201 Created` creando `Usuario` (`PROVEEDOR`) y `PerfilProveedor`. | Test JUnit + Postman |
| **RF-003** | Consulta de sesión y cambio de clave | CUANDO un usuario autenticado solicita su sesión o cambia su contraseña validando la actual, EL SISTEMA DEBERÁ retornar su perfil o actualizar la clave. | Autenticado | **Media** | **6 / 10** | Intermedia | `GET /me` retorna sesión; `PATCH /password` valida clave actual (`400` si es incorrecta). | Test JUnit + Postman |
| **RF-004** | Consulta de categorías | CUANDO cualquier usuario consulta las categorías activas o el detalle de una categoría, EL SISTEMA DEBERÁ listar las categorías y sus subcategorías. | Público | **Alta** | **8 / 10** | Inicial | `GET /categories` y `GET /categories/{id}` devuelven categorías activas y subcategorías. | Test JUnit + Postman |
| **RF-005** | Listado paginado de productos propios | CUANDO un proveedor consulta su catálogo con filtros de búsqueda y paginación, EL SISTEMA DEBERÁ retornar únicamente sus productos no eliminados. | Proveedor | **Alta** | **9 / 10** | Inicial | Soporta `search`, `page`, `size` y filtra por dueño autenticado. | Test JUnit + Angular |
| **RF-006** | Detalle técnico de producto | CUANDO un proveedor consulta un producto propio por ID, EL SISTEMA DEBERÁ devolver su ficha técnica completa con especificaciones e imágenes. | Proveedor | **Media** | **7 / 10** | Intermedia | Responde `200 OK` con especificaciones e imágenes; `404` si no existe o no es propio. | Test JUnit + Angular |
| **RF-007** | Creación de producto mayorista | CUANDO un proveedor registra un producto válido con categoría, especificaciones e imágenes, EL SISTEMA DEBERÁ persistirlo en cascada. | Proveedor | **Alta** | **9 / 10** | Inicial | Responde `201 Created` y asocia el producto al perfil del proveedor autenticado. | Test JUnit + Angular |
| **RF-008** | Actualización de producto | CUANDO un proveedor actualiza un producto propio, EL SISTEMA DEBERÁ validar los datos y actualizar atributos, categoría y colecciones hijas. | Proveedor | **Alta** | **8 / 10** | Intermedia | Responde `200 OK` reflejando cambios en especificaciones e imágenes. | Test JUnit + Angular |
| **RF-009** | Cambio de estado y borrado lógico | CUANDO un proveedor cambia el estado o elimina un producto propio, EL SISTEMA DEBERÁ actualizar su estado o marcar la eliminación lógica sin borrar el registro físico. | Proveedor | **Alta** | **8 / 10** | Intermedia | `PATCH /status` actualiza estado; `DELETE` marca `fechaEliminacion` y responde `204 No Content`. | Test JUnit + Angular |
| **RF-010** | Administración de plataforma — pendiente de definición | Requisito reservado para definir las funciones y permisos del administrador de la plataforma. La gestión de productos corresponde a cada proveedor. | Admin | **Pendiente** | **—** | Por definir | Pendiente de acordar alcance y criterios. | Por definir |
| **RF-011** | Catálogo público de productos | CUANDO un usuario o visitante consulta el catálogo público con filtros de búsqueda o categoría, EL SISTEMA DEBERÁ listar productos activos no eliminados de todos los proveedores. | Público / Comprador | **Alta** | **9 / 10** | Inicial | `GET /api/v1/products` y `GET /api/v1/products/{id}` retornan solo productos `ACTIVO`. | Test JUnit + Angular |
| **RF-012** | Carrito B2B multi-proveedor | CUANDO un comprador agrega productos de uno o más proveedores al carrito, EL SISTEMA DEBERÁ agruparlos por proveedor, validar pedido mínimo y bloquear auto-compra. | Comprador / Proveedor | **Alta** | **9 / 10** | Intermedia | Cantidades cumplen mínimo mayorista y el sistema impide agregar productos propios. | Prueba UI + Servicio |
| **RF-013** | Checkout único y facturación simulada (*Split Order*) | CUANDO un comprador confirma su carrito con datos fiscales (RUC, Razón Social), EL SISTEMA DEBERÁ generar una orden general y una factura simulada por cada proveedor involucrado. | Comprador autenticado | **Alta** | **9 / 10** | Intermedia | `POST /api/v1/orders/checkout` persiste orden padre, sub-órdenes/facturas (subtotal, IGV 18%, total) e ítems. | Test JUnit + Angular |
| **RF-014** | Historial de compras y ventas recibidas | CUANDO un usuario consulta sus compras o un proveedor consulta sus ventas, EL SISTEMA DEBERÁ listar sus órdenes o sub-órdenes correspondientes. | Comprador / Proveedor | **Media** | **6 / 10** | Intermedia | `GET /api/v1/orders/me` y `GET /api/v1/providers/me/sales` devuelven solo registros propios. | Test JUnit + Angular |

---

## 🛡️ 2. Catálogo de Requisitos No Funcionales (RNF)

| ID | Atributo de Calidad | Enunciado del RNF | Métrica / Umbral Verificable | Condiciones de Medición | Prioridad | Método de Verificación |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **RNF-001** | Seguridad y Control de Acceso | BAJO peticiones HTTP a rutas protegidas, EL SISTEMA DEBERÁ validar token JWT, expiración y rol antes de ejecutar lógica de negocio. | `401` sin token válido; `403` sin rol requerido; 0 contraseñas en texto plano. | Suite `SecurityAuthorizationTest` + Postman | **Alta** | Test de Seguridad |
| **RNF-002** | Manejo Uniforme de Errores | BAJO errores de validación, autenticación o recursos inexistentes, EL SISTEMA DEBERÁ responder en formato JSON estructurado y mostrar feedback claro en UI. | Códigos `400`, `401`, `403`, `404` manejados y ruta `**` 404 en Front-end. | Pruebas de integración + navegador | **Alta** | Test Integración + UI |
| **RNF-003** | Configuración por Entornos | BAJO ejecución en desarrollo o producción, EL SISTEMA DEBERÁ externalizar credenciales y secretos mediante perfiles y variables de entorno. | 0 credenciales sensibles hardcodeadas en el código fuente final. | Revisión de `application*.properties` y `environment*.ts` | **Alta** | Inspección |
| **RNF-004** | Usabilidad Responsiva | BAJO visualización en escritorio y móvil, EL SISTEMA DEBERÁ adaptar sus vistas sin desbordamientos horizontales ni elementos cortados. | Correcta visualización en viewport `1280px` y `375px`. | Inspección en DevTools | **Media** | Prueba Visual UI |

---

## 🚫 3. Límites del Alcance (Fuera de Alcance)

1. **Fuera de alcance:** Procesamiento real de cobros bancarios y conexión en producción con servicios tributarios (SUNAT); la facturación es simulada.
2. **Fuera de alcance:** Seguimiento logístico de envíos en tiempo real o mensajería/chat en vivo.
3. **Fuera de alcance:** Aplicaciones móviles nativas (solo cliente web responsivo).
