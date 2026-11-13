import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  tipo: 'success' | 'warning' | 'error' | 'info';
  titulo: string;
  mensaje: string;
  duracionMs?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastStateService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  public show(toast: Omit<ToastMessage, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id, duracionMs: toast.duracionMs ?? 4000 };

    this._toasts.update(list => [...list, newToast]);

    if (newToast.duracionMs && newToast.duracionMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, newToast.duracionMs);
    }
  }

  public success(titulo: string, mensaje: string): void {
    this.show({ tipo: 'success', titulo, mensaje });
  }

  public error(titulo: string, mensaje: string): void {
    this.show({ tipo: 'error', titulo, mensaje });
  }

  public warning(titulo: string, mensaje: string): void {
    this.show({ tipo: 'warning', titulo, mensaje });
  }

  public info(titulo: string, mensaje: string): void {
    this.show({ tipo: 'info', titulo, mensaje });
  }

  public dismiss(id: string): void {
    this._toasts.update(list => list.filter(t => t.id !== id));
  }
}
