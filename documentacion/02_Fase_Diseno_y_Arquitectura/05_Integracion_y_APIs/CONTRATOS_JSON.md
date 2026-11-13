# CONTRATOS_JSON.md — Contratos Completos de Entrada y Salida (24 Endpoints)

> **Área Técnica:** Integración y APIs  
> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Fidelidad:** Los 14 endpoints existentes reflejan exactamente los campos de los DTOs Java en `compunex-backend`. Los 10 endpoints nuevos siguen la misma convención (`contenido`, `pagina`, `tamano`, `totalElementos`, `totalPaginas`, `esUltima`, `mensaje`).

---

## 1. Módulo Autenticación y Perfiles (Endpoints 1–4 y 15–17)

### 1. `POST /api/v1/auth/login` *(Existente — `P-06`)*
* **Acceso:** Público
* **Entrada (`LoginRequestDTO`):**
  ```json
  {
    "correo": "ventas.mayoristas@technova.com",
    "contrasena": "Password123!"
  }
  ```
* **Salida `200 OK` (`AuthResponseDTO`):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tipoToken": "Bearer",
    "expiraEnSegundos": 86400
  }
  ```
* **Error `401 Unauthorized`:** `{"mensaje": "Credenciales incorrectas"}`

### 2. `POST /api/v1/auth/register` *(Existente — alias `/api/v1/auth/registro-proveedor`)*
* **Acceso:** Público
* **Entrada (`RegistroProveedorRequestDTO`):**
  ```json
  {
    "nombre": "Juan Carlos Rivera",
    "correo": "contacto@innovapc.com",
    "contrasena": "InnovaPass2026!",
    "ruc": "20712345678",
    "razonSocial": "Innova PC Mayoristas S.A.C.",
    "nombreComercial": "Innova PC Wholesale",
    "telefonoContacto": "+51 987 111 222",
    "ciudad": "Lima",
    "direccion": "Av. Garcilaso de la Vega 1348, Int. 201",
    "anosMercado": "5 años",
    "descripcion": "Especialistas en componentes y procesadores."
  }
  ```
* **Salida `201 Created` (`RegistroProveedorResponseDTO`):**
  ```json
  {
    "usuarioId": 2,
    "proveedorId": 2,
    "uuid": "c89f56a1-3e4b-4b2a-8f9d-123456789abc",
    "nombre": "Juan Carlos Rivera",
    "correo": "contacto@innovapc.com",
    "rol": "PROVEEDOR",
    "ruc": "20712345678",
    "razonSocial": "Innova PC Mayoristas S.A.C.",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tipoToken": "Bearer",
    "expiraEnSegundos": 86400,
    "mensaje": "Proveedor registrado exitosamente en la plataforma COMPUNEX."
  }
  ```

### 3. `GET /api/v1/auth/me` *(Existente — `P-16`)*
* **Acceso:** Autenticado (`Authorization: Bearer <token>`)
* **Entrada:** Sin cuerpo.
* **Salida `200 OK` (`UsuarioSesionDTO`):**
  ```json
  {
    "correo": "contacto@innovapc.com",
    "nombre": "Juan Carlos Rivera",
    "rol": "PROVEEDOR",
    "valido": true
  }
  ```

### 4. `PATCH /api/v1/auth/password` *(Existente — `P-17`)*
* **Acceso:** Autenticado
* **Entrada (`CambiarPasswordDTO`):**
  ```json
  {
    "contrasenaActual": "InnovaPass2026!",
    "nuevaContrasena": "NuevaPassword2026!"
  }
  ```
* **Salida `200 OK` (`CambioPasswordResponseDTO`):**
  ```json
  {
    "mensaje": "Contraseña actualizada exitosamente",
    "fechaActualizacion": "2026-11-12T20:15:00Z"
  }
  ```
* **Error `400 Bad Request`:** `{"mensaje": "La contraseña actual es incorrecta"}`

### 15. `POST /api/v1/auth/register-company` *(Nuevo — `P-07`)*
* **Acceso:** Público
* **Entrada (`RegistroEmpresaRequestDTO`):**
  ```json
  {
    "nombre": "Carlos Mendoza",
    "correo": "compras@andina.com",
    "contrasena": "Password123!",
    "ruc": "20609876543",
    "razonSocial": "Comercializadora Andina S.A.C."
  }
  ```
* **Salida `201 Created`:**
  ```json
  {
    "usuarioId": 15,
    "correo": "compras@andina.com",
    "nombre": "Carlos Mendoza",
    "rol": "COMPRADOR",
    "tienePerfilProveedor": false,
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tipoToken": "Bearer",
    "expiraEnSegundos": 86400
  }
  ```

### 16. `GET /api/v1/providers/me/profile` *(Nuevo — `P-26`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Entrada:** Sin cuerpo.
* **Salida `200 OK`:**
  ```json
  {
    "proveedorId": 2,
    "identificacionFiscal": "20712345678",
    "razonSocial": "Innova PC Mayoristas S.A.C.",
    "nombreComercial": "Innova PC Wholesale",
    "telefonoContacto": "+51 987 111 222",
    "correoContacto": "contacto@innovapc.com",
    "direccion": "Av. Garcilaso de la Vega 1348, Int. 201",
    "ciudad": "Lima",
    "anosMercado": "5 años",
    "descripcion": "Especialistas en componentes.",
    "politicaComercial": "Despacho en 24h tras confirmación.",
    "verificado": true
  }
  ```

### 17. `POST /api/v1/providers/me/activate` *(Nuevo — `P-18`)*
* **Acceso:** Autenticado
* **Entrada (`ActivarProveedorRequestDTO`):**
  ```json
  {
    "ruc": "20609876543",
    "razonSocial": "Comercializadora Andina S.A.C.",
    "nombreComercial": "Andina Hardware",
    "telefonoContacto": "+51 999 888 777",
    "ciudad": "Lima",
    "direccion": "Av. Garcilaso de la Vega 1240",
    "descripcion": "Mayorista de periféricos y almacenamiento."
  }
  ```
* **Salida `201 Created`:**
  ```json
  {
    "proveedorId": 16,
    "rol": "PROVEEDOR",
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "tipoToken": "Bearer",
    "expiraEnSegundos": 86400,
    "mensaje": "Perfil de proveedor activado exitosamente."
  }
  ```

---

## 2. Módulo Categorías y Catálogo Público (Endpoints 5–6 y 18–19)

### 5. `GET /api/v1/categories` *(Existente — `P-01`, `P-02`)*
* **Acceso:** Público | **Entrada:** Sin cuerpo.
* **Salida `200 OK` (`List<CategoriaResponseDTO>`):**
  ```json
  [
    {
      "id": "almacenamiento",
      "nombre": "Almacenamiento",
      "icono": "hard-drive",
      "descripcion": "Unidades SSD NVMe, SATA y discos empresariales.",
      "estado": "ACTIVA",
      "totalProductos": 12
    }
  ]
  ```

### 6. `GET /api/v1/categories/{id}` *(Existente — `P-02`)*
* **Acceso:** Público | **Entrada:** Path variable `id`.
* **Salida `200 OK` (`CategoriaDetalleResponseDTO`):**
  ```json
  {
    "id": "almacenamiento",
    "nombre": "Almacenamiento",
    "icono": "hard-drive",
    "descripcion": "Unidades SSD NVMe, SATA y discos empresariales.",
    "estado": "ACTIVA",
    "totalProductos": 12,
    "subcategorias": [
      { "id": 1, "nombre": "SSD NVMe M.2" },
      { "id": 2, "nombre": "Discos NAS" }
    ]
  }
  ```
* **Error `404 Not Found`:** `{"mensaje": "Categoría no encontrada"}`

### 18. `GET /api/v1/products?search=&categoryId=&page=0&size=12` *(Nuevo — `P-01`, `P-03`)*
* **Acceso:** Público (solo `ACTIVO`, `fechaEliminacion == null`).
* **Salida `200 OK`:**
  ```json
  {
    "contenido": [
      {
        "id": 10,
        "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
        "titulo": "SSD NVMe 1TB PCIe 4.0",
        "categoriaId": "almacenamiento",
        "categoriaNombre": "Almacenamiento",
        "pedidoMinimo": "10 unidades",
        "precioUnitarioRef": 65.00,
        "moneda": "USD",
        "urlImagenPrincipal": "https://cdn.ejemplo.com/ssd.jpg",
        "proveedorId": 2,
        "proveedorNombreComercial": "TechNova Mayorista SAC"
      }
    ],
    "pagina": 0,
    "tamano": 12,
    "totalElementos": 1,
    "totalPaginas": 1,
    "esUltima": true
  }
  ```

### 19. `GET /api/v1/products/{id}` *(Nuevo — `P-04`, `P-05`)*
* **Acceso:** Público
* **Salida `200 OK`:**
  ```json
  {
    "id": 10,
    "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
    "categoriaId": "almacenamiento",
    "categoriaNombre": "Almacenamiento",
    "titulo": "SSD NVMe 1TB PCIe 4.0",
    "descripcion": "Unidad de estado sólido PCIe Gen4 para servidores y estaciones de trabajo.",
    "modeloComercial": "MAYORISTA_PURO",
    "tipoFormato": "Caja sellada",
    "unidadesPorPaquete": "10 unidades",
    "pedidoMinimo": "10 unidades",
    "precioUnitarioRef": 65.00,
    "precioTotalRef": 650.00,
    "moneda": "USD",
    "terminosComerciales": "Garantía de 36 meses por lote.",
    "estado": "ACTIVO",
    "especificaciones": [
      { "clave": "Interfaz", "valor": "PCIe Gen 4.0 x4" },
      { "clave": "Capacidad", "valor": "1TB" }
    ],
    "imagenes": [
      { "urlImagen": "https://cdn.ejemplo.com/ssd.jpg", "orden": 0 }
    ],
    "proveedor": {
      "id": 2,
      "razonSocial": "TechNova Mayorista SAC",
      "nombreComercial": "TechNova Mayorista SAC",
      "identificacionFiscal": "20551234567",
      "ciudad": "Lima",
      "telefonoContacto": "+51 987 111 222",
      "correoContacto": "ventas@technova.com"
    }
  }
  ```

---

## 3. Módulo Carrito, Checkout y Compras (Endpoints 20–22)

### 20. `POST /api/v1/orders/checkout` *(Nuevo — `P-10`, `P-11`, `P-12`, `P-13`)*
* **Acceso:** Autenticado (`Authorization: Bearer <token>`)
* **Entrada (`CheckoutRequestDTO`):**
  ```json
  {
    "datosFacturacion": {
      "tipoComprobante": "FACTURA_SIMULADA",
      "rucReceptor": "20609876543",
      "razonSocialReceptor": "Comercializadora Andina S.A.C.",
      "direccionFiscal": "Av. Garcilaso de la Vega 1240, Lima",
      "metodoPagoSimulado": "TRANSFERENCIA_B2B"
    },
    "items": [
      { "productoId": 10, "cantidad": 10 },
      { "productoId": 25, "cantidad": 5 }
    ]
  }
  ```
* **Salida `201 Created` (`CheckoutResponseDTO`):**
  ```json
  {
    "ordenId": 101,
    "codigoOrden": "PED-2026-000101",
    "fechaEmision": "2026-11-12T19:30:00Z",
    "moneda": "USD",
    "totalGeneral": 1416.00,
    "esSimulado": true,
    "facturasEmitidas": [
      {
        "subordenId": 201,
        "numeroComprobante": "SIM-F001-00000201",
        "tipoComprobante": "FACTURA_SIMULADA",
        "emisor": { "proveedorId": 2, "ruc": "20551234567", "razonSocial": "TechNova Mayorista SAC" },
        "receptor": { "ruc": "20609876543", "razonSocial": "Comercializadora Andina S.A.C." },
        "subtotal": 650.00,
        "igv": 117.00,
        "total": 767.00,
        "estado": "EMITIDA_SIMULADA",
        "items": [
          { "productoId": 10, "titulo": "SSD NVMe 1TB PCIe 4.0", "cantidad": 10, "precioUnitario": 65.00, "subtotalLinea": 650.00 }
        ]
      }
    ]
  }
  ```
* **Errores:** `400 Bad Request` (auto-compra `RN-007`, carrito vacío o RUC inválido), `401 Unauthorized`, `404 Not Found`.

### 21. `GET /api/v1/orders/me?page=0&size=10` *(Nuevo — `P-14`)*
* **Acceso:** Autenticado
* **Salida `200 OK`:**
  ```json
  {
    "contenido": [
      {
        "ordenId": 101,
        "codigoOrden": "PED-2026-000101",
        "fechaEmision": "2026-11-12T19:30:00Z",
        "cantidadProveedores": 2,
        "totalGeneral": 1416.00,
        "moneda": "USD",
        "esSimulado": true
      }
    ],
    "pagina": 0,
    "tamano": 10,
    "totalElementos": 1,
    "totalPaginas": 1,
    "esUltima": true
  }
  ```

### 22. `GET /api/v1/orders/me/{ordenId}` *(Nuevo — `P-13`, `P-15`)*
* **Acceso:** Autenticado (solo dueño de la orden)
* **Salida `200 OK`:** Misma estructura completa de `CheckoutResponseDTO` (incluyendo `facturasEmitidas[]` e `items[]`).
* **Error `404 Not Found`:** `{"mensaje": "Orden no encontrada"}`

---

## 4. Módulo Productos y Ventas del Proveedor (Endpoints 7–12 y 23–24)

### 7. `GET /api/v1/providers/me/products?search=&page=0&size=10` *(Existente — `P-19`, `P-20`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Salida `200 OK` (`ProductoPaginadoResponseDTO`):**
  ```json
  {
    "contenido": [
      {
        "id": 10,
        "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
        "titulo": "SSD NVMe 1TB PCIe 4.0",
        "descripcion": "Unidad de estado sólido PCIe Gen4...",
        "categoriaId": "almacenamiento",
        "categoriaNombre": "Almacenamiento",
        "modeloComercial": "MAYORISTA_PURO",
        "tipoFormato": "Caja sellada",
        "unidadesPorPaquete": "10 unidades",
        "pedidoMinimo": "10 unidades",
        "precioUnitarioRef": 65.00,
        "precioTotalRef": 650.00,
        "moneda": "USD",
        "terminosComerciales": "Garantía 36 meses",
        "estado": "ACTIVO",
        "esRecomendado": false,
        "esPromocionado": false,
        "tieneOferta": false,
        "urlImagenPrincipal": "https://cdn.ejemplo.com/ssd.jpg",
        "imagenes": [{ "urlImagen": "https://cdn.ejemplo.com/ssd.jpg", "orden": 0 }],
        "especificaciones": [{ "clave": "Interfaz", "valor": "PCIe Gen 4.0 x4" }],
        "fechaPublicacion": "2026-11-10T10:00:00Z",
        "fechaActualizacion": "2026-11-10T10:00:00Z"
      }
    ],
    "pagina": 0,
    "tamano": 10,
    "totalElementos": 1,
    "totalPaginas": 1,
    "esUltima": true
  }
  ```

### 8. `GET /api/v1/providers/me/products/{id}` *(Existente — `P-22`, `P-23`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Salida `200 OK` (`ProductoDetalleResponseDTO`):**
  ```json
  {
    "id": 10,
    "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
    "proveedorId": 2,
    "proveedorRazonSocial": "TechNova Mayorista SAC",
    "categoriaId": "almacenamiento",
    "titulo": "SSD NVMe 1TB PCIe 4.0",
    "descripcion": "Unidad de estado sólido PCIe Gen4...",
    "modeloComercial": "MAYORISTA_PURO",
    "tipoFormato": "Caja sellada",
    "unidadesPorPaquete": "10 unidades",
    "pedidoMinimo": "10 unidades",
    "precioUnitarioRef": 65.00,
    "precioTotalRef": 650.00,
    "moneda": "USD",
    "terminosComerciales": "Garantía 36 meses",
    "estado": "ACTIVO",
    "motivoModeracion": null,
    "esRecomendado": false,
    "esPromocionado": false,
    "tieneOferta": false,
    "especificaciones": [{ "clave": "Interfaz", "valor": "PCIe Gen 4.0 x4" }],
    "imagenes": [{ "urlImagen": "https://cdn.ejemplo.com/ssd.jpg", "orden": 0 }],
    "fechaPublicacion": "2026-11-10T10:00:00Z",
    "fechaActualizacion": "2026-11-10T10:00:00Z"
  }
  ```

### 9. `POST /api/v1/providers/me/products` *(Existente — `P-21`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Entrada (`CrearProductoRequestDTO`):**
  ```json
  {
    "categoriaId": "almacenamiento",
    "titulo": "SSD NVMe 1TB PCIe 4.0",
    "descripcion": "Unidad de estado sólido PCIe Gen4...",
    "modeloComercial": "MAYORISTA_PURO",
    "tipoFormato": "Caja sellada",
    "unidadesPorPaquete": "10 unidades",
    "pedidoMinimo": "10 unidades",
    "precioUnitarioRef": 65.00,
    "precioTotalRef": 650.00,
    "moneda": "USD",
    "terminosComerciales": "Garantía 36 meses",
    "especificaciones": [{ "clave": "Interfaz", "valor": "PCIe Gen 4.0 x4" }],
    "imagenes": [{ "urlImagen": "https://cdn.ejemplo.com/ssd.jpg", "orden": 0 }]
  }
  ```
* **Salida `201 Created` (`CrearProductoResponseDTO`):**
  ```json
  {
    "id": 10,
    "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
    "proveedorId": 2,
    "categoriaId": "almacenamiento",
    "titulo": "SSD NVMe 1TB PCIe 4.0",
    "precioUnitarioRef": 65.00,
    "precioTotalRef": 650.00,
    "moneda": "USD",
    "estado": "ACTIVO",
    "fechaPublicacion": "2026-11-12T20:00:00Z"
  }
  ```

### 10. `PUT /api/v1/providers/me/products/{id}` *(Existente — `P-23`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Entrada (`ActualizarProductoRequestDTO`):** Misma estructura de campos que `CrearProductoRequestDTO`.
* **Salida `200 OK` (`ActualizarProductoResponseDTO`):**
  ```json
  {
    "id": 10,
    "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
    "titulo": "SSD NVMe 1TB PCIe 4.0 Gen4",
    "precioUnitarioRef": 62.00,
    "precioTotalRef": 620.00,
    "estado": "ACTIVO",
    "fechaActualizacion": "2026-11-12T20:10:00Z"
  }
  ```

### 11. `PATCH /api/v1/providers/me/products/{id}/status` *(Existente — `P-20`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Entrada (`CambiarEstadoProductoDTO`):**
  ```json
  {
    "estado": "INACTIVO"
  }
  ```
* **Salida `200 OK` (`CambioEstadoResponseDTO`):**
  ```json
  {
    "id": 10,
    "uuid": "a1b2c3d4-0000-0000-0000-000000000010",
    "estadoAnterior": "ACTIVO",
    "nuevoEstado": "INACTIVO",
    "mensaje": "Estado actualizado correctamente",
    "fechaActualizacion": "2026-11-12T20:12:00Z"
  }
  ```

### 12. `DELETE /api/v1/providers/me/products/{id}` *(Existente — `P-20`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Entrada:** Sin cuerpo.
* **Salida `204 No Content`:** Sin cuerpo (borrado lógico en servidor).

### 23. `GET /api/v1/providers/me/sales?page=0&size=10` *(Nuevo — `P-24`)*
* **Acceso:** `ROLE_PROVEEDOR`
* **Salida `200 OK`:**
  ```json
  {
    "contenido": [
      {
        "subordenId": 201,
        "numeroComprobante": "SIM-F001-00000201",
        "fechaEmision": "2026-11-12T19:30:00Z",
        "razonSocialComprador": "Comercializadora Andina S.A.C.",
        "rucComprador": "20609876543",
        "total": 767.00,
        "moneda": "USD",
        "estado": "EMITIDA_SIMULADA"
      }
    ],
    "pagina": 0,
    "tamano": 10,
    "totalElementos": 1,
    "totalPaginas": 1,
    "esUltima": true
  }
  ```

### 24. `GET /api/v1/providers/me/sales/{subordenId}` *(Nuevo — `P-25`)*
* **Acceso:** `ROLE_PROVEEDOR` (solo sub-órdenes donde el proveedor es emisor)
* **Salida `200 OK`:**
  ```json
  {
    "subordenId": 201,
    "numeroComprobante": "SIM-F001-00000201",
    "tipoComprobante": "FACTURA_SIMULADA",
    "fechaEmision": "2026-11-12T19:30:00Z",
    "receptor": {
      "ruc": "20609876543",
      "razonSocial": "Comercializadora Andina S.A.C.",
      "direccionFiscal": "Av. Garcilaso de la Vega 1240, Lima"
    },
    "subtotal": 650.00,
    "igv": 117.00,
    "total": 767.00,
    "moneda": "USD",
    "estado": "EMITIDA_SIMULADA",
    "items": [
      { "productoId": 10, "titulo": "SSD NVMe 1TB PCIe 4.0", "cantidad": 10, "precioUnitario": 65.00, "subtotalLinea": 650.00 }
    ]
  }
  ```

---

## 5. Módulo Administración (Endpoints 13–14)

### 13. `GET /api/v1/admin/products?search=&page=0&size=10` *(Existente)*
* **Acceso:** `ROLE_ADMIN`
* **Salida `200 OK`:** `ProductoPaginadoResponseDTO` (misma estructura de paginación del endpoint 7, incluyendo productos de todos los proveedores).

### 14. `PATCH /api/v1/admin/products/{id}/status` *(Existente)*
* **Acceso:** `ROLE_ADMIN`
* **Entrada (`CambiarEstadoProductoDTO`):** `{"estado": "INACTIVO"}`
* **Salida `200 OK`:** `CambioEstadoResponseDTO` (misma estructura del endpoint 11).
