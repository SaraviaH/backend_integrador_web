# Sprint-F08 — Visor de Factura Electrónica y Comprobantes Simulados

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-invoice-viewer` hacia `develop`  
> **Dependencias Previas:** `Sprint-F07_Checkout_Wizard_Facturacion`

---

## 1. Objetivo del Sprint
Implementar el visor interactivo de comprobantes fiscales simulados (`P-13`), renderizando en pantalla la factura electrónica con formato oficial tributario (correlativo `F001-XXXXX`, desglose de base imponible, IGV 18% y total en Soles), permitiendo la navegación entre comprobantes si la orden generó múltiples subórdenes, e incluyendo estilos optimizados para impresión física o guardado en PDF (`@media print`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-13`: Comprobantes simulados (Factura visual SUNAT-style con cabecera de emisor, RUC emisor, número correlativo `F001-%08d`, datos del receptor, desglose de ítems con precio congelado, base imponible e IGV 18%).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/orders/me/{ordenId}` (Endpoint 22)
* **Reglas de Negocio:**
  * `RN-006`: Formato de factura simulada correlativa y congelamiento de precios históricos.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-13: Visor de Comprobantes (`InvoiceViewerComponent`)
- [ ] Selector de comprobantes en cabecera: Si la orden tuvo 2 proveedores, muestra pestañas: "Comprobante 1: TechnoNova (F001-00000001)" y "Comprobante 2: Innova PC (F001-00000002)".
- [ ] Estructura visual de la factura:
  * Cuadro emisor: Razón Social, RUC, Dirección fiscal del Proveedor respectivo.
  * Recuadro derecho destacado: RUC, `FACTURA ELECTRÓNICA SIMULADA`, Número correlativo.
  * Cuadro cliente: RUC, Razón Social, Dirección de facturación, Fecha de emisión.
  * Tabla de ítems: Cantidad, Unidad (UND), Descripción detallada, Precio Unitario congelado, Importe Subtotal.
  * Resumen inferior: Operaciones Gravadas, IGV (18%), Importe Total en Soles (`PEN`).
  * Leyenda legal simulada: *"Comprobante emitido con fines académicos y de simulación B2B"*.
- [ ] Botones de acción:
  * "Imprimir Comprobante" (`window.print()`).
  * "Ver Todas Mis Compras" (redirige a `/cuenta/mis-compras`).

### 3.2. Estilos para Impresión CSS (`@media print`)
- [ ] Ocultar Header, Footer, botones de acción y fondos de pantalla en la vista de impresión.
- [ ] Asegurar que el comprobante quepa perfectamente en una hoja A4 sin desbordamientos de texto.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] La factura visual reproduce con fidelidad los datos devueltos por el contrato de la orden.
- [ ] La vista previa de impresión en navegador muestra únicamente la factura limpia en formato A4.
- [ ] Si la orden tiene N subórdenes, el selector de pestañas permite alternar de inmediato entre las N facturas.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/orders/pages/invoice-viewer/**/*.spec.ts
# Abrir http://localhost:4200/pedidos/1/comprobante y presionar Ctrl+P para verificar la impresión
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-06` | `RN-006` | `P-13` | `InvoiceViewerComponent.ts` | 22 |
