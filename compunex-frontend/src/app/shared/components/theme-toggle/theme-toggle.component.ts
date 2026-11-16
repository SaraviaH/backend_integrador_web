import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeStateService } from '../../../core/state/theme-state.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      (click)="themeState.toggleTheme()"
      [class]="compact
        ? 'w-9 h-9 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-[#E1F2FA]/70 hover:bg-[#98D5EE]/50 dark:bg-[#0F3043] dark:hover:bg-[#1D4960] text-[#0A3C55] dark:text-[#4FB3DA] flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA] shrink-0 active:scale-95'
        : 'h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-[#E1F2FA]/70 hover:bg-[#98D5EE]/50 dark:bg-[#0F3043] dark:hover:bg-[#1D4960] text-[#0A3C55] dark:text-[#4FB3DA] flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1786B4] dark:focus-visible:ring-[#4FB3DA] shrink-0 active:scale-95'"
      [attr.aria-label]="themeState.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      [attr.aria-pressed]="themeState.isDark()"
      [title]="themeState.isDark() ? 'Modo claro' : 'Modo oscuro'"
    >
      @if (themeState.isDark()) {
        <svg class="w-5 h-5 transition-transform duration-300 motion-safe:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      } @else {
        <svg class="w-5 h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      }
    </button>
  `
})
export class ThemeToggleComponent {
  public readonly themeState = inject(ThemeStateService);
  @Input() compact = false;
}
