import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-colors"
      [ngClass]="badgeClasses"
    >
      <span class="w-1.5 h-1.5 mr-1.5 rounded-full" [ngClass]="dotClasses"></span>
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status: string = '';

  get label(): string {
    return this.status.replace(/_/g, ' ');
  }

  get badgeClasses(): string {
    const s = this.status.toUpperCase();
    if (s.includes('ENTREGAD') || s.includes('CONFIRMADA') || s.includes('ACTIVO') || s.includes('EXITO')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (s.includes('DESPACH') || s.includes('PREPARACION') || s.includes('PROCESO')) {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    if (s.includes('PENDIENTE')) {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    if (s.includes('CANCEL') || s.includes('ANULAD') || s.includes('INACTIVO') || s.includes('ERROR')) {
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    }
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  }

  get dotClasses(): string {
    const s = this.status.toUpperCase();
    if (s.includes('ENTREGAD') || s.includes('CONFIRMADA') || s.includes('ACTIVO')) {
      return 'bg-emerald-500';
    }
    if (s.includes('DESPACH') || s.includes('PREPARACION')) {
      return 'bg-blue-500';
    }
    if (s.includes('PENDIENTE')) {
      return 'bg-amber-500';
    }
    if (s.includes('CANCEL') || s.includes('ANULAD') || s.includes('INACTIVO')) {
      return 'bg-rose-500';
    }
    return 'bg-slate-400';
  }
}
