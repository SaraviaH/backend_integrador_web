import { signal } from '@angular/core';

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Gestor reutilizable e independiente de estados por acción o elemento.
 * Evita ejecuciones duplicadas (doble clic / disparos concurrentes) sin bloquear acciones independientes.
 */
export class ActionTracker<K = string> {
  private readonly statesSignal = signal<Map<K, ActionStatus>>(new Map());
  private readonly timers = new Map<K, ReturnType<typeof setTimeout>>();

  public status(key: K): ActionStatus {
    return this.statesSignal().get(key) ?? 'idle';
  }

  public isLoading(key: K): boolean {
    return this.status(key) === 'loading';
  }

  public isSuccess(key: K): boolean {
    return this.status(key) === 'success';
  }

  public isError(key: K): boolean {
    return this.status(key) === 'error';
  }

  /**
   * Registra de forma síncrona el estado `loading`.
   * Devuelve `false` si ya existe una operación en curso para la misma clave.
   */
  public start(key: K): boolean {
    if (this.status(key) === 'loading') {
      return false;
    }
    this.clearTimer(key);
    this.setState(key, 'loading');
    return true;
  }

  /**
   * Marca la operación como completada (`success`) y vuelve automáticamente a `idle`
   * tras `holdMs` milisegundos.
   */
  public succeed(key: K, holdMs = 1200): void {
    this.clearTimer(key);
    this.setState(key, 'success');
    if (holdMs > 0) {
      const timer = setTimeout(() => {
        this.timers.delete(key);
        if (this.status(key) === 'success') {
          this.setState(key, 'idle');
        }
      }, holdMs);
      this.timers.set(key, timer);
    } else {
      this.setState(key, 'idle');
    }
  }

  /**
   * Marca error y restaura la disponibilidad del botón para reintentos.
   * Si `holdMs === 0`, retorna inmediatamente a `idle`.
   */
  public fail(key: K, holdMs = 0): void {
    this.clearTimer(key);
    if (holdMs <= 0) {
      this.setState(key, 'idle');
      return;
    }
    this.setState(key, 'error');
    const timer = setTimeout(() => {
      this.timers.delete(key);
      if (this.status(key) === 'error') {
        this.setState(key, 'idle');
      }
    }, holdMs);
    this.timers.set(key, timer);
  }

  public reset(key: K): void {
    this.clearTimer(key);
    this.setState(key, 'idle');
  }

  public clearAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.statesSignal.set(new Map());
  }

  private setState(key: K, state: ActionStatus): void {
    this.statesSignal.update(prev => {
      const next = new Map(prev);
      if (state === 'idle') {
        next.delete(key);
      } else {
        next.set(key, state);
      }
      return next;
    });
  }

  private clearTimer(key: K): void {
    const existing = this.timers.get(key);
    if (existing) {
      clearTimeout(existing);
      this.timers.delete(key);
    }
  }
}
