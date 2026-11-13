# README_RETO.md — Definición del Reto y Visión del Producto (COMPUNEX B2B)

> **Fase del SDLC:** Fase 01 · Planificación y Análisis de Requisitos  
> **Proyecto:** COMPUNEX B2B — Plataforma Mayorista de Hardware  
> **Propósito:** Documentar la problemática de negocio, los arquetipos de usuario, el alcance funcional y los límites del proyecto sin acoplarlo a detalles de implementación.

---

## 🎯 1. Declaración del Problema y Reto

### 1.1 Contexto
En el comercio mayorista de hardware y equipamiento tecnológico, los proveedores suelen gestionar sus catálogos mediante hojas de cálculo, listas de precios enviadas por correo o mensajería, y fichas técnicas desactualizadas. Esto dificulta la estandarización de especificaciones técnicas, el control de disponibilidad por lotes/paquetes y la administración centralizada de publicaciones.

### 1.2 El Reto Central
> *"Centralizar la publicación, estandarización técnica y administración del catálogo mayorista de hardware en una plataforma B2B segura, permitiendo a cada proveedor gestionar sus propios productos y reservando la administración de la plataforma para el administrador."*

---

## 👥 2. Usuarios Objetivo (Personas / Arquetipos)

| Arquetipo de Usuario | Contexto / Perfil | Necesidad Principal | Frustración Actual |
| :--- | :--- | :--- | :--- |
| **Proveedor Mayorista (`PROVEEDOR`)** | Distribuidor o importador de hardware que comercializa por lote, caja o unidad mayorista. | Registrar su perfil comercial, publicar productos con ficha técnica e imágenes, actualizar precios/formatos y activar o retirar productos propios. | Difusión manual en archivos dispersos, falta de historial de cambios y ausencia de un portal unificado para sus publicaciones. |
| **Comprador / Proveedor Dual (`PROVEEDOR` / `USER`)** | Empresa o usuario que adquiere hardware por volumen y/o comercializa sus propios productos en la plataforma. | Explorar el catálogo público de otros mayoristas, armar un carrito multi-proveedor y generar su facturación simulada. | Tener que coordinar compras por chat o correo sin carrito ni comprobantes consolidados. |
| **Administrador de Plataforma (`ADMIN`)** | Responsable de la administración general de COMPUNEX B2B. | Funciones y permisos de administración general pendientes de definición. La gestión de productos corresponde a cada proveedor. | Necesidad de definir las herramientas de administración de la plataforma. |
| **Visitante / Integrador (`Público`)** | Usuario o cliente que consulta la taxonomía de categorías disponible antes de operar. | Explorar categorías activas y subcategorías técnicas disponibles en el catálogo. | Falta de una estructura clara de categorías y subcategorías de hardware. |

---

## 📋 3. Módulos y Características Funcionales de Negocio

### Módulo 1: Autenticación, Registro y Gestión de Sesión
* **Objetivo:** Garantizar acceso autenticado por roles y permitir la incorporación de nuevos proveedores mayoristas con su perfil comercial asociado.
* **Comportamiento esperado de rutina:** Inicio de sesión con credenciales válidas, registro de proveedor con datos fiscales/comerciales, consulta de sesión activa y cambio de contraseña.
* **Comportamiento en situaciones críticas o excepcionales:** Rechazo de credenciales inválidas, bloqueo de acceso sin autorización y validación de contraseña actual antes de permitir un cambio de clave.

### Módulo 2: Taxonomía de Categorías y Subcategorías
* **Objetivo:** Organizar el hardware mayorista bajo categorías activas y subcategorías técnicas estandarizadas.
* **Reglas de interacción:** Consulta pública del listado de categorías activas (con conteo de productos asociados) y del detalle de cada categoría con sus subcategorías.

### Módulo 3: Gestión de Catálogo de Productos (Proveedor y Administración)
* **Objetivo:** Permitir el ciclo de vida completo de los productos mayoristas (creación, consulta paginada, ficha técnica, actualización, cambio de estado y eliminación lógica).
* **Reglas de interacción:**
  * Un proveedor únicamente puede consultar, editar, cambiar estado o eliminar productos de su propiedad.
  * Cada producto admite especificaciones técnicas (`clave`/`valor`), imágenes ordenadas y condiciones comerciales mayoristas (formato, unidades por paquete, pedido mínimo, moneda y precios referenciales).
  * Las funciones del administrador de la plataforma están pendientes de definición; no administra ni modera los productos de los proveedores.

### Módulo 4: Catálogo Público, Carrito Multi-Proveedor y Facturación Simulada B2B
* **Objetivo:** Permitir que cualquier usuario/empresa explore productos activos de múltiples proveedores, agregue ítems respetando pedidos mínimos en un solo carrito y ejecute un checkout único con **facturación simulada dividida por proveedor (*Split Order*)**.
* **Reglas de interacción:**
  * Un usuario autenticado no puede comprar sus propios productos.
  * Al confirmar el checkout, el sistema agrupa los ítems por proveedor y emite una factura/comprobante simulado por cada tienda mayorista involucrada (con RUC emisor, RUC receptor, subtotal, IGV y total).

---

## 🛡️ 4. Restricciones y Atributos de Calidad (Requisitos No Funcionales)

* **Usabilidad y Responsividad:** Interfaz web adaptable a escritorio y dispositivos móviles (`375px`), con mensajes de error claros y página 404 ante rutas inexistentes.
* **Rendimiento y Escalabilidad:** Consultas de catálogo paginadas y búsqueda filtrada para evitar sobrecarga al listar grandes volúmenes de productos.
* **Seguridad y Privacidad:** Contraseñas almacenadas mediante hash seguro, autenticación sin estado basada en tokens y aislamiento estricto por rol y propiedad de recurso.
* **Portabilidad y Entorno Local:** Configuración externalizable por perfiles/variables de entorno y ejecución reproducible en entorno local.

---

## 🚫 5. Límites del Reto (Lo que queda EXPLÍCITAMENTE FUERA)

1. **Fuera de alcance:** Pasarela de pagos bancaria real (cobro con tarjeta/banca en línea) y conexión real con SUNAT (la facturación es simulada en la plataforma).
2. **Fuera de alcance:** Aplicaciones móviles nativas (iOS / Android); el acceso es vía web responsiva.
3. **Fuera de alcance:** Chat en tiempo real entre compradores y proveedores o sistema de logística/envíos automatizado.

---

## 🏆 6. Criterios de Éxito y Evaluación del Reto

* [x] Autenticación funcional con emisión y validación de tokens por rol (`PROVEEDOR` / `ADMIN`).
* [x] CRUD completo de productos con borrado lógico, paginación, búsqueda y gestión de categorías.
* [ ] Integración completa Front-end Angular ↔ Back-end Spring Boot con manejo de errores y UI responsiva.
* [ ] Configuración de entornos/perfiles y base de datos validada conforme a los criterios de entrega del curso (ATF3).
