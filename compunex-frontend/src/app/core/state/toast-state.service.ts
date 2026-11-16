import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'loading';

export interface ToastMessage {
  id: string;
  key?: string;
  tipo: ToastType;
  titulo: string;
  mensaje: string;
  duracionMs?: number;
  closing?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastStateService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  public readonly toasts = this._toasts.asReadonly();
  private readonly autoTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly exitTimers = new Map<string, ReturnType<typeof setTimeout>>();

  public show(toast: Omit<ToastMessage, 'id' | 'closing'>): string {
    const duration = toast.tipo === 'loading'
      ? (toast.duracionMs ?? 0)
      : (toast.duracionMs ?? 4200);

    const existing = this._toasts().find(t =>
      !t.closing &&
      ((toast.key && t.key === toast.key) ||
        (!toast.key && t.tipo === toast.tipo && t.titulo === toast.titulo && t.mensaje === toast.mensaje))
    );

    if (existing) {
      this.clearAutoTimer(existing.id);
      this._toasts.update(list =>
        list.map(t => t.id === existing.id ? { ...toast, id: existing.id, duracionMs: duration, closing: false } : t)
      );
      this.scheduleAutoDismiss(existing.id, duration);
      return existing.id;
    }

    const id = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toast, id, duracionMs: duration, closing: false };
    this._toasts.update(list => [...list.slice(-4), newToast]);
    this.scheduleAutoDismiss(id, duration);
    return id;
  }

  public success(titulo: string, mensaje: string, key?: string): string {
    return this.show({ tipo: 'success', titulo, mensaje, key });
  }

  public error(titulo: string, mensaje: string, key?: string): string {
    return this.show({ tipo: 'error', titulo, mensaje, key, duracionMs: 5500 });
  }

  public warning(titulo: string, mensaje: string, key?: string): string {
    return this.show({ tipo: 'warning', titulo, mensaje, key, duracionMs: 4800 });
  }

  public info(titulo: string, mensaje: string, key?: string): string {
    return this.show({ tipo: 'info', titulo, mensaje, key });
  }

  public loading(titulo: string, mensaje: string, key?: string): string {
    return this.show({ tipo: 'loading', titulo, mensaje, key, duracionMs: 0 });
  }

  public dismiss(id: string): void {
    this.clearAutoTimer(id);
    if (this.exitTimers.has(id)) return;

    const target = this._toasts().find(t => t.id === id);
    if (!target) return;

    this._toasts.update(list => list.map(t => t.id === id ? { ...t, closing: true } : t));

    const exitTimer = setTimeout(() => {
      this.exitTimers.delete(id);
      this._toasts.update(list => list.filter(t => t.id !== id));
    }, 180);
    this.exitTimers.set(id, exitTimer);
  }

  public clearAll(): void {
    for (const timer of this.autoTimers.values()) clearTimeout(timer);
    for (const timer of this.exitTimers.values()) clearTimeout(timer);
    this.autoTimers.clear();
    this.exitTimers.clear();
    this._toasts.set([]);
  }

  private scheduleAutoDismiss(id: string, durationMs: number): void {
    if (!durationMs || durationMs <= 0) return;
    const timer = setTimeout(() => {
      this.autoTimers.delete(id);
      this.dismiss(id);
    }, durationMs);
    this.autoTimers.set(id, timer);
  }

  private clearAutoTimer(id: string): void {
    const existing = this.autoTimers.get(id);
    if (existing) {
      clearTimeout(existing);
      this.autoTimers.delete(id);
    }
  }
}
