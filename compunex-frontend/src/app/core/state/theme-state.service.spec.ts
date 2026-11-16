import { TestBed } from '@angular/core/testing';
import { ThemeStateService } from './theme-state.service';

describe('ThemeStateService', () => {
  beforeEach(() => {
    localStorage.removeItem('compunex_theme');
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.removeItem('compunex_theme');
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light mode on first visit and toggles/persists dark mode', () => {
    const service = TestBed.inject(ThemeStateService);
    expect(service.theme()).toBe('light');
    expect(service.isDark()).toBeFalse();

    service.toggleTheme();
    TestBed.flushEffects();

    expect(service.theme()).toBe('dark');
    expect(service.isDark()).toBeTrue();
    expect(localStorage.getItem('compunex_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBeTrue();

    service.toggleTheme();
    TestBed.flushEffects();

    expect(service.theme()).toBe('light');
    expect(localStorage.getItem('compunex_theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBeFalse();
  });
});
