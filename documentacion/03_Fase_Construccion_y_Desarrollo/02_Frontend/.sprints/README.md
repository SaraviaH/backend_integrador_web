# Sprints de Frontend — Track 02 (Angular 18 Standalone)

> **Área:** Frontend  
> **Fase del SDLC:** 03 · Construcción y Desarrollo  
> **Objetivo:** Ejecutar la construcción modular de las 27 pantallas MVP de COMPUNEX B2B organizadas en 14 sprints de UI granulares y enfocados, consumiendo Prism Mock Server (`http://localhost:4010`) de forma 100% paralela al Backend, y culminando con el Quality Gate 2 (`AUDITORIA_2.md`).

---

## 1. Organización de los 14 Sprints de Frontend

Para garantizar alta calidad, cero saturación de código y pruebas visuales exhaustivas, las 27 pantallas se distribuyen en 14 sprints de 1 a 3 pantallas por sprint:

1. [`Sprint-F01_Setup_UI_y_Design_Tokens`](Sprint-F01_Setup_UI_y_Design_Tokens/SPEC.md): Tokens base Tailwind, átomos visuales y Layout Shell responsivo (`Header`, `Footer`, `Navbar`).
2. [`Sprint-F02_Auth_Login_y_Registro_Empresa`](Sprint-F02_Auth_Login_y_Registro_Empresa/SPEC.md): `P-06` Iniciar sesión y `P-07` Registro de empresa mayorista con validación RUC 11 dígitos.
3. [`Sprint-F03_Home_y_Categorias`](Sprint-F03_Home_y_Categorias/SPEC.md): `P-01` Portal de inicio con Hero B2B y `P-02` Grilla visual de categorías con contadores.
4. [`Sprint-F04_Catalogo_B2B_y_Busqueda`](Sprint-F04_Catalogo_B2B_y_Busqueda/SPEC.md): `P-03` Catálogo y búsqueda reactiva con Signals, debounce y paginador B2B.
5. [`Sprint-F05_Ficha_Detalle_Producto`](Sprint-F05_Ficha_Detalle_Producto/SPEC.md): `P-04` Detalle de producto con galería y especificaciones, y `P-05` Modal accesible de contacto.
6. [`Sprint-F06_Carrito_Reactivo_y_Agrupacion`](Sprint-F06_Carrito_Reactivo_y_Agrupacion/SPEC.md): `P-09` Carrito B2B con agrupación visual por proveedor y persistencia en `localStorage`.
7. [`Sprint-F07_Checkout_Wizard_Facturacion`](Sprint-F07_Checkout_Wizard_Facturacion/SPEC.md): Asistente de compra en 3 pasos: `P-10` Datos facturación, `P-11` Revisión Split Order y `P-12` Confirmación.
8. [`Sprint-F08_Visor_Factura_y_Comprobantes`](Sprint-F08_Visor_Factura_y_Comprobantes/SPEC.md): `P-13` Factura electrónica simulada correlativa `F001-XXXXX` con estilos para `@media print`.
9. [`Sprint-F09_Mis_Compras_y_Trazabilidad`](Sprint-F09_Mis_Compras_y_Trazabilidad/SPEC.md): `P-14` Historial de compras mayoristas y `P-15` Detalle de compra consolidada.
10. [`Sprint-F10_Mi_Cuenta_Seguridad_y_Activacion`](Sprint-F10_Mi_Cuenta_Seguridad_y_Activacion/SPEC.md): `P-16` Mi cuenta, `P-17` Cambiar contraseña y `P-18` Activar perfil proveedor.
11. [`Sprint-F11_Dashboard_Proveedor_y_Perfil`](Sprint-F11_Dashboard_Proveedor_y_Perfil/SPEC.md): `P-19` Panel del proveedor con KPIs de rendimiento y `P-26` Perfil comercial de la empresa.
12. [`Sprint-F12_Gestion_Catalogo_Proveedor`](Sprint-F12_Gestion_Catalogo_Proveedor/SPEC.md): CRUD completo de inventario propio: `P-20` Mis productos, `P-21` Crear, `P-22` Detalle y `P-23` Editar.
13. [`Sprint-F13_Ventas_Proveedor_y_Despacho`](Sprint-F13_Ventas_Proveedor_y_Despacho/SPEC.md): `P-24` Ventas recibidas y `P-25` Detalle de venta y transición de despacho logístico.
14. [`Sprint-F14_Paginas_de_Error_y_Rutas`](Sprint-F14_Paginas_de_Error_y_Rutas/SPEC.md): `P-36` Acceso denegado (403) y `P-37` Página no encontrada (404).
15. [`Sprint-F_Audit`](Sprint-F_Audit/AUDITORIA_2.md): **Quality Gate 2** con verificación integral de las 27 pantallas, los 4 estados visuales y accesibilidad WCAG 2.1 AA.
