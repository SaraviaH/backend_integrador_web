import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SunatFacturaItem {
  codigo: string;
  descripcion: string;
  unidad?: string;
  cantidad: number;
  valorUnitario: number;
  subtotal: number;
}

export interface SunatFacturaData {
  numeroFactura: string;
  fechaEmision: string;
  formaPago: string;
  moneda?: string;
  observacion?: string;
  emisorRazonSocial: string;
  emisorRuc: string;
  emisorDireccion: string;
  receptorRazonSocial: string;
  receptorRuc: string;
  receptorDireccion?: string;
  subtotal: number;
  igv: number;
  total: number;
  items: SunatFacturaItem[];
}

function numeroALetrasEs(num: number): string {
  const entero = Math.floor(Math.abs(num));
  const centavos = Math.round((Math.abs(num) - entero) * 100).toString().padStart(2, '0');
  if (entero === 0) return `CERO Y ${centavos}/100 SOLES`;

  const unidades = ['', 'UN', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
  const decenas = ['', '', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

  const convertirGrupo = (n: number): string => {
    if (n === 0) return '';
    if (n === 100) return 'CIEN';
    const c = Math.floor(n / 100);
    const r = n % 100;
    const d = Math.floor(r / 10);
    const u = r % 10;
    const partes: string[] = [];
    if (c > 0) partes.push(centenas[c]);
    if (r >= 10 && r <= 19) {
      partes.push(especiales[r - 10]);
    } else if (r === 20) {
      partes.push('VEINTE');
    } else if (r > 20 && r < 30) {
      partes.push(`VEINTI${unidades[u]}`);
    } else {
      if (d > 0) {
        partes.push(u > 0 ? `${decenas[d]} Y ${unidades[u]}` : decenas[d]);
      } else if (u > 0) {
        partes.push(unidades[u]);
      }
    }
    return partes.join(' ');
  };

  const miles = Math.floor(entero / 1000);
  const resto = entero % 1000;
  const bloques: string[] = [];
  if (miles > 0) {
    bloques.push(miles === 1 ? 'MIL' : `${convertirGrupo(miles)} MIL`);
  }
  if (resto > 0) {
    bloques.push(convertirGrupo(resto));
  }
  return `${bloques.join(' ')} Y ${centavos}/100 SOLES`;
}

@Component({
  selector: 'app-sunat-factura-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sunat-sheet bg-white text-black border border-slate-400 p-6 sm:p-8 max-w-4xl mx-auto text-[11px] leading-snug font-sans shadow-sm">
      <!-- Cabecera Formato SUNAT -->
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4 pb-3">
        <div class="space-y-0.5 uppercase">
          <div class="text-sm sm:text-base font-extrabold tracking-tight">{{ data.emisorRazonSocial }}</div>
          <div class="text-[11px] text-slate-800">{{ data.emisorDireccion }}</div>
          <div class="text-[10px] text-slate-600">EMISOR ELECTRÓNICO AUTORIZADO · COMPUNEX B2B</div>
        </div>

        <div class="border-2 border-black px-5 py-2.5 text-center w-full sm:w-64 shrink-0">
          <div class="font-extrabold text-xs tracking-wide">FACTURA ELECTRONICA</div>
          <div class="font-bold text-xs mt-0.5">RUC: {{ data.emisorRuc }}</div>
          <div class="font-extrabold text-sm font-mono mt-0.5">{{ data.numeroFactura }}</div>
        </div>
      </div>

      <!-- Datos del Receptor y Emisión -->
      <div class="border-t border-b border-black py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-y-1 gap-x-4 text-[11px]">
        <div class="sm:col-span-8 grid grid-cols-[145px_1fr] gap-y-1">
          <span class="font-semibold">Fecha de Emisión</span>
          <span>: {{ data.fechaEmision | date:'dd/MM/yyyy' }}</span>

          <span class="font-semibold">Señor(es)</span>
          <span class="font-bold uppercase">: {{ data.receptorRazonSocial }}</span>

          <span class="font-semibold">RUC</span>
          <span class="font-mono">: {{ data.receptorRuc }}</span>

          <span class="font-semibold">Establecimiento del Emisor</span>
          <span class="uppercase">: {{ data.emisorDireccion }}</span>

          @if (data.receptorDireccion) {
            <span class="font-semibold">Dirección del Receptor</span>
            <span class="uppercase">: {{ data.receptorDireccion }}</span>
          }

          <span class="font-semibold">Tipo de Moneda</span>
          <span>: {{ data.moneda || 'SOLES' }}</span>

          <span class="font-semibold">Observación</span>
          <span>: {{ data.observacion || 'Venta mayorista B2B' }}</span>
        </div>

        <div class="sm:col-span-4 sm:text-right">
          <span class="font-semibold">Forma de pago: </span>
          <span>{{ data.formaPago }}</span>
        </div>
      </div>

      <!-- Tabla de Ítems SUNAT -->
      <div class="mt-3 border border-black overflow-x-auto">
        <table class="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr class="border-b border-black bg-slate-100 font-bold">
              <th class="py-1.5 px-2 text-right w-16">Cantidad</th>
              <th class="py-1.5 px-2 text-center w-24">Unidad Medida</th>
              <th class="py-1.5 px-2 w-24">Código</th>
              <th class="py-1.5 px-2">Descripción</th>
              <th class="py-1.5 px-2 text-right w-28">Valor Unitario</th>
              <th class="py-1.5 px-2 text-right w-20">ICBPER</th>
              <th class="py-1.5 px-2 text-right w-24">Importe</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            @for (it of data.items; track it.codigo) {
              <tr>
                <td class="py-1.5 px-2 text-right font-mono">{{ it.cantidad | number:'1.2-2' }}</td>
                <td class="py-1.5 px-2 text-center">{{ it.unidad || 'UNIDAD' }}</td>
                <td class="py-1.5 px-2 font-mono">{{ it.codigo }}</td>
                <td class="py-1.5 px-2 uppercase">{{ it.descripcion }}</td>
                <td class="py-1.5 px-2 text-right font-mono">{{ it.valorUnitario | number:'1.2-2' }}</td>
                <td class="py-1.5 px-2 text-right font-mono">0.00</td>
                <td class="py-1.5 px-2 text-right font-mono font-semibold">{{ it.subtotal | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Totales SUNAT -->
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
        <div class="sm:col-span-7 space-y-4">
          <div class="flex items-center gap-2 text-[11px]">
            <span>Valor de Venta de Operaciones Gratuitas :</span>
            <span class="border border-black px-2 py-0.5 font-mono min-w-[110px]">S/ 0.00</span>
          </div>

          <div class="font-bold text-[11px] uppercase">
            SON: {{ getMontoLetras(data.total) }}
          </div>
        </div>

        <div class="sm:col-span-5 border border-black text-[11px]">
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Sub Total Ventas :</span>
            <span class="text-right font-mono">S/ {{ data.subtotal | number:'1.2-2' }}</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Anticipos :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Descuentos :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Valor Venta :</span>
            <span class="text-right font-mono">S/ {{ data.subtotal | number:'1.2-2' }}</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">ISC :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">IGV :</span>
            <span class="text-right font-mono">S/ {{ data.igv | number:'1.2-2' }}</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">ICBPER :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Otros Cargos :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-slate-300 px-2 py-0.5">
            <span class="text-right pr-2">Otros Tributos :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] border-b border-black px-2 py-0.5">
            <span class="text-right pr-2">Monto de redondeo :</span>
            <span class="text-right font-mono">S/ 0.00</span>
          </div>
          <div class="grid grid-cols-[1fr_100px] px-2 py-1 font-extrabold bg-slate-100">
            <span class="text-right pr-2">Importe Total :</span>
            <span class="text-right font-mono">S/ {{ data.total | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>

      <!-- Pie Oficial SUNAT -->
      <div class="mt-4 border border-black p-2.5 text-center italic text-[11px]">
        Esta es una representación impresa de la factura electrónica, generada en el Sistema de SUNAT (Simulación COMPUNEX B2B). Puede verificarla utilizando su clave SOL.
      </div>
    </div>
  `,
})
export class SunatFacturaSheetComponent {
  @Input({ required: true }) data!: SunatFacturaData;

  public getMontoLetras(total: number): string {
    return numeroALetrasEs(total);
  }
}
