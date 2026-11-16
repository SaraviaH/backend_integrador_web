import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderSaleItem } from '../../../core/models/provider.model';

@Component({
  selector: 'app-sunat-guia-remision-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs print:static print:p-0 print:bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gre-title"
    >
      <div class="w-full max-w-4xl bg-white rounded-3xl border border-slate-300 shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-full">

        <!-- Barra superior (oculta al imprimir) -->
        <div class="no-print px-6 py-4 bg-[#04202E] text-white flex items-center justify-between gap-4">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-sky-300">SUNAT · GRE Transportista (Simulación)</span>
            <h2 id="gre-title" class="text-base sm:text-lg font-black">
              Guía de Remisión Electrónica — Transportista
            </h2>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              (click)="previewMode.set(!previewMode())"
              class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
            >
              {{ previewMode() ? '✎ Editar Datos' : '👁 Vista Previa SUNAT' }}
            </button>
            <button
              type="button"
              (click)="printGuia()"
              class="px-4 py-1.5 rounded-xl bg-[#1786B4] hover:bg-[#136d93] text-xs font-bold transition-colors"
            >
              Imprimir / Guardar PDF
            </button>
            <button
              type="button"
              (click)="closeModal.emit()"
              class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600 text-xs font-bold transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        <div class="p-6 max-h-[84vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0">
          @if (!previewMode()) {
            <form [formGroup]="form" (ngSubmit)="previewMode.set(true)" class="no-print space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 mb-1">RUC Transportista *</label>
                  <input formControlName="transportistaRuc" maxlength="11" class="w-full px-3 py-2 border rounded-xl font-mono" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Razón Social Transportista *</label>
                  <input formControlName="transportistaRazonSocial" class="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Placa del Vehículo *</label>
                  <input formControlName="placa" class="w-full px-3 py-2 border rounded-xl font-mono uppercase" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Marca / Modelo Vehículo *</label>
                  <input formControlName="marcaVehiculo" class="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Nombre del Conductor *</label>
                  <input formControlName="conductorNombre" class="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">N.º Licencia de Conducir *</label>
                  <input formControlName="conductorLicencia" class="w-full px-3 py-2 border rounded-xl font-mono uppercase" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Punto de Partida *</label>
                  <input formControlName="puntoPartida" class="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Punto de Llegada *</label>
                  <input formControlName="puntoLlegada" class="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Peso Bruto Total (KGM) *</label>
                  <input type="number" step="0.1" formControlName="pesoBrutoKg" class="w-full px-3 py-2 border rounded-xl font-mono" />
                </div>
                <div>
                  <label class="block font-bold text-slate-700 mb-1">Fecha de Inicio de Traslado *</label>
                  <input type="date" formControlName="fechaTraslado" class="w-full px-3 py-2 border rounded-xl font-mono" />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t">
                <button type="button" (click)="closeModal.emit()" class="px-4 py-2 rounded-xl border font-semibold">Cancelar</button>
                <button type="submit" class="px-6 py-2 rounded-xl bg-[#1786B4] text-white font-bold">
                  Generar Vista Previa SUNAT →
                </button>
              </div>
            </form>
          } @else {
            <!-- Formato Impreso SUNAT GRE Transportista -->
            <div class="bg-white text-black border border-black p-6 space-y-4 text-[11px] font-sans">
              <!-- Cabecera -->
              <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3 border-b border-black">
                <div class="space-y-0.5 uppercase">
                  <div class="text-sm font-extrabold">{{ form.value.transportistaRazonSocial }}</div>
                  <div>OPERADOR LOGÍSTICO DE TRANSPORTE DE CARGA B2B</div>
                  <div>REGISTRO MTC: 1584920CNG · LIMA - PERÚ</div>
                </div>
                <div class="border-2 border-black px-4 py-2 text-center w-full sm:w-72 shrink-0">
                  <div class="font-extrabold text-[11px]">GUIA DE REMISION ELECTRONICA</div>
                  <div class="font-extrabold text-[11px]">TRANSPORTISTA</div>
                  <div class="font-bold text-xs mt-0.5">RUC: {{ form.value.transportistaRuc }}</div>
                  <div class="font-extrabold text-sm font-mono mt-0.5">{{ numeroGuia }}</div>
                </div>
              </div>

              <!-- Datos del Traslado -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-b border-black pb-3">
                <div class="grid grid-cols-[135px_1fr] gap-y-1">
                  <span class="font-semibold">Fecha de Emisión</span>
                  <span>: {{ todayStr }}</span>
                  <span class="font-semibold">Fecha Inicio Traslado</span>
                  <span>: {{ form.value.fechaTraslado }}</span>
                  <span class="font-semibold">Motivo de Traslado</span>
                  <span>: VENTA MAYORISTA B2B</span>
                  <span class="font-semibold">Doc. Relacionado</span>
                  <span class="font-mono">: FACTURA {{ sale.numeroFacturaSimulada || ('F001-' + sale.subordenId) }}</span>
                </div>
                <div class="grid grid-cols-[135px_1fr] gap-y-1">
                  <span class="font-semibold">Remitente</span>
                  <span class="uppercase">: {{ remitenteRazonSocial }} ({{ remitenteRuc }})</span>
                  <span class="font-semibold">Destinatario</span>
                  <span class="uppercase">: {{ sale.clienteRazonSocial }}</span>
                  <span class="font-semibold">RUC Destinatario</span>
                  <span class="font-mono">: {{ sale.clienteRuc }}</span>
                  <span class="font-semibold">Peso Bruto Total</span>
                  <span class="font-mono">: {{ form.value.pesoBrutoKg | number:'1.2-2' }} KGM</span>
                </div>
              </div>

              <!-- Puntos y Vehículo -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-black pb-3">
                <div class="space-y-1">
                  <div class="font-bold uppercase">Puntos de Traslado</div>
                  <div><strong>Partida:</strong> {{ form.value.puntoPartida }}</div>
                  <div><strong>Llegada:</strong> {{ form.value.puntoLlegada }}</div>
                </div>
                <div class="space-y-1">
                  <div class="font-bold uppercase">Datos del Vehículo y Conductor</div>
                  <div><strong>Unidad / Placa:</strong> {{ form.value.marcaVehiculo }} · <span class="font-mono font-bold">{{ form.value.placa }}</span></div>
                  <div><strong>Conductor:</strong> {{ form.value.conductorNombre }} · <strong>Licencia:</strong> <span class="font-mono">{{ form.value.conductorLicencia }}</span></div>
                </div>
              </div>

              <!-- Bienes Transportados -->
              <div class="border border-black">
                <table class="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr class="border-b border-black bg-slate-100 font-bold">
                      <th class="py-1.5 px-2 text-center w-12">Ítem</th>
                      <th class="py-1.5 px-2 w-28">Código</th>
                      <th class="py-1.5 px-2">Descripción del Bien</th>
                      <th class="py-1.5 px-2 text-center w-24">Unidad</th>
                      <th class="py-1.5 px-2 text-right w-24">Cantidad</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    @for (it of sale.items; track it.productoId; let i = $index) {
                      <tr>
                        <td class="py-1.5 px-2 text-center font-mono">{{ i + 1 }}</td>
                        <td class="py-1.5 px-2 font-mono">{{ it.sku }}</td>
                        <td class="py-1.5 px-2 uppercase">{{ it.nombre }}</td>
                        <td class="py-1.5 px-2 text-center">UNIDAD</td>
                        <td class="py-1.5 px-2 text-right font-mono font-bold">{{ it.cantidad | number:'1.2-2' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>

              <div class="border border-black p-2.5 text-center italic text-[11px]">
                Esta es una representación impresa de la Guía de Remisión Electrónica Transportista, generada en el Sistema de SUNAT (Simulación COMPUNEX B2B). Orden {{ sale.codigoOrden }}.
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class SunatGuiaRemisionModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) sale!: ProviderSaleItem;
  @Input() remitenteRazonSocial = 'PROVEEDOR MAYORISTA B2B';
  @Input() remitenteRuc = '20608945612';
  @Input() remitenteDireccion = 'Av. Garcilaso de la Vega 1348, Cercado de Lima';

  @Output() closeModal = new EventEmitter<void>();

  public readonly previewMode = signal<boolean>(true);
  public form!: FormGroup;
  public numeroGuia = '';
  public todayStr = '';

  public ngOnInit(): void {
    const now = new Date();
    this.todayStr = now.toLocaleDateString('es-PE');
    const isoDate = now.toISOString().slice(0, 10);
    this.numeroGuia = `EG01-${String(this.sale.subordenId).padStart(6, '0')}`;

    const totalQty = this.sale.items.reduce((acc, it) => acc + it.cantidad, 0);
    this.form = this.fb.group({
      transportistaRuc: ['20512345678', Validators.required],
      transportistaRazonSocial: ['TRANSPORTES LOGISTICA EXPRESS PERU S.A.C.', Validators.required],
      placa: ['B4X-892', Validators.required],
      marcaVehiculo: ['HINO 300 FURGON'],
      conductorNombre: ['CARLOS MENDOZA RUIZ', Validators.required],
      conductorLicencia: ['Q44829104', Validators.required],
      puntoPartida: [this.remitenteDireccion, Validators.required],
      puntoLlegada: [`Sede Fiscal ${this.sale.clienteRazonSocial}, Lima`, Validators.required],
      pesoBrutoKg: [Math.max(2.5, totalQty * 1.2), Validators.required],
      fechaTraslado: [isoDate, Validators.required],
    });
  }

  public printGuia(): void {
    if (!this.previewMode()) {
      this.previewMode.set(true);
      setTimeout(() => window.print(), 150);
    } else {
      window.print();
    }
  }
}
