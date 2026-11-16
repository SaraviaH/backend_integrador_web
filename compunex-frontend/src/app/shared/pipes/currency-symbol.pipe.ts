import { Pipe, PipeTransform } from '@angular/core';

export function getCurrencySymbol(moneda?: string | null): string {
  const code = (moneda || 'PEN').trim().toUpperCase();
  if (code === 'USD' || code === 'DOLARES' || code === 'DÓLARES') {
    return 'US$';
  }
  return 'S/';
}

export function getCurrencyLabel(moneda?: string | null): string {
  const code = (moneda || 'PEN').trim().toUpperCase();
  if (code === 'USD' || code === 'DOLARES' || code === 'DÓLARES') {
    return 'DÓLARES (USD)';
  }
  return 'SOLES (PEN)';
}

@Pipe({
  name: 'currencySymbol',
  standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {
  public transform(moneda?: string | null): string {
    return getCurrencySymbol(moneda);
  }
}
