import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomeHeroComponent, HeroSlide } from './home-hero.component';
import { ThemeToggleComponent } from '../../../../shared/components/theme-toggle/theme-toggle.component';
import { ThemeStateService } from '../../../../core/state/theme-state.service';

const SAMPLE_SLIDES: HeroSlide[] = [
  {
    id: 1,
    tituloPre: 'Conecta con el',
    tituloDestacado: 'mundo del hardware',
    descripcion: 'Descripción 1',
    botonTexto: 'Explorar catálogo',
    botonRuta: '/catalog',
    imagenUrl: '/images/compunex-hero.png'
  },
  {
    id: 2,
    tituloPre: 'Aprovisionamiento en',
    tituloDestacado: 'servidores y redes',
    descripcion: 'Descripción 2',
    botonTexto: 'Ver categorías',
    botonRuta: '/categories',
    imagenUrl: '/images/compunex-hero.png'
  },
  {
    id: 3,
    tituloPre: 'Componentes y',
    tituloDestacado: 'almacenamiento masivo',
    descripcion: 'Descripción 3',
    botonTexto: 'Ver catálogo completo',
    botonRuta: '/catalog',
    imagenUrl: '/images/compunex-hero.png'
  }
];

describe('HomeHeroComponent & ThemeToggleComponent', () => {
  beforeEach(async () => {
    localStorage.removeItem('compunex_theme');
    document.documentElement.classList.remove('dark');

    await TestBed.configureTestingModule({
      imports: [HomeHeroComponent, ThemeToggleComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem('compunex_theme');
    document.documentElement.classList.remove('dark');
  });

  it('advances linear progress and cycles slides at 100%', () => {
    const fixture = TestBed.createComponent(HomeHeroComponent);
    const component = fixture.componentInstance;
    component.slides = SAMPLE_SLIDES;
    fixture.detectChanges();
    component.isPaused.set(false);

    expect(component.activeSlideIndex()).toBe(0);
    expect(component.progress()).toBe(0);

    component.advanceTick(50);
    expect(component.progress()).toBe(50);
    expect(component.activeSlideIndex()).toBe(0);

    component.advanceTick(50);
    expect(component.progress()).toBe(0);
    expect(component.activeSlideIndex()).toBe(1);

    component.goToSlide(2);
    expect(component.activeSlideIndex()).toBe(2);
    expect(component.progress()).toBe(0);

    component.advanceTick(100);
    expect(component.activeSlideIndex()).toBe(0);
    expect(component.progress()).toBe(0);
  });

  it('resets progress on manual controls and respects pause/resume', () => {
    const fixture = TestBed.createComponent(HomeHeroComponent);
    const component = fixture.componentInstance;
    component.slides = SAMPLE_SLIDES;
    fixture.detectChanges();
    component.isPaused.set(false);

    component.advanceTick(60);
    expect(component.progress()).toBe(60);

    component.nextSlide();
    expect(component.activeSlideIndex()).toBe(1);
    expect(component.progress()).toBe(0);

    component.advanceTick(40);
    component.togglePause();
    component.advanceTick(40);
    expect(component.progress()).toBe(40);

    component.togglePause();
    component.advanceTick(20);
    expect(component.progress()).toBe(60);

    component.prevSlide();
    expect(component.activeSlideIndex()).toBe(0);
    expect(component.progress()).toBe(0);
  });

  it('toggles global theme through ThemeToggleComponent', () => {
    const themeService = TestBed.inject(ThemeStateService);
    const fixture = TestBed.createComponent(ThemeToggleComponent);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(themeService.isDark()).toBeFalse();

    button.click();
    fixture.detectChanges();
    TestBed.flushEffects();

    expect(themeService.isDark()).toBeTrue();
    expect(document.documentElement.classList.contains('dark')).toBeTrue();
  });
});
