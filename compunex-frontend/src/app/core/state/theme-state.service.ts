import { Injectable, computed, effect, signal } from '@angular/core';

export type CompunexTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'compunex_theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeStateService {
  public readonly theme = signal<CompunexTheme>(this.readStoredTheme());
  public readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    effect(() => {
      this.applyThemeToDocument(this.theme());
    });
  }

  public toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  public setTheme(next: CompunexTheme): void {
    this.theme.set(next);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }

  private readStoredTheme(): CompunexTheme {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (saved === 'dark' || saved === 'light') {
          return saved;
        }
      }
    } catch {
      // Default to light on first visit or restricted storage
    }
    return 'light';
  }

  private applyThemeToDocument(mode: CompunexTheme): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', mode === 'dark');
    root.style.colorScheme = mode;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', mode === 'dark' ? '#061722' : '#0A3C55');
    }
  }
}
