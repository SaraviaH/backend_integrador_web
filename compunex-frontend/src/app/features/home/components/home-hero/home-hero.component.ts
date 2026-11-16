import { Component, Input, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselControlsComponent } from '../carousel-controls/carousel-controls.component';
import { BubbleButtonDirective } from '../../../../shared/directives/bubble-button.directive';

export interface HeroSlide {
  id: number;
  tituloPre: string;
  tituloDestacado: string;
  descripcion: string;
  botonTexto: string;
  botonRuta: string;
  imagenUrl: string;
}

@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule, RouterModule, CarouselControlsComponent, BubbleButtonDirective],
  template: `
    <section
      class="relative rounded-3xl overflow-hidden border border-[#98D5EE] dark:border-[#1D4960] bg-gradient-to-br from-[#E1F2FA] via-[#F2F9FD] to-white dark:from-[#0A2535] dark:via-[#0F3043] dark:to-[#061722] shadow-card transition-colors duration-200"
      aria-label="Presentación de COMPUNEX"
    >
      <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <!-- Columna de contenido editorial (sin desbordes ni recortes) -->
        <div class="lg:col-span-7 p-6 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between gap-7 min-w-0">
          <div class="space-y-5 min-w-0">
            <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#061722]/75 border border-[#98D5EE]/80 dark:border-[#1D4960] text-[10px] font-extrabold tracking-[0.14em] uppercase text-[#0F5E83] dark:text-[#4FB3DA]">
              <span class="w-2 h-2 rounded-full bg-[#1786B4] dark:bg-[#4FB3DA] motion-safe:animate-pulse" aria-hidden="true"></span>
              PLATAFORMA MAYORISTA DE HARDWARE B2B
            </span>

            @for (slide of slides; track slide.id; let i = $index) {
              @if (activeSlideIndex() === i) {
                <div class="space-y-4 motion-safe:animate-slide-in min-w-0">
                  <h1 class="font-display font-bold tracking-tight text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] leading-[1.14] text-[#04202E] dark:text-[#E1F2FA] break-words">
                    {{ slide.tituloPre }}
                    <em class="not-italic text-[#1786B4] dark:text-[#4FB3DA] block sm:inline">
                      {{ slide.tituloDestacado }}
                    </em>
                  </h1>

                  <p class="text-sm sm:text-base text-[#0A3C55] dark:text-[#98D5EE] leading-relaxed max-w-xl">
                    {{ slide.descripcion }}
                  </p>

                  <div class="flex flex-wrap items-center gap-3 pt-1">
                    <a
                      [routerLink]="slide.botonRuta"
                      appBubbleButton
                      class="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1786B4] hover:bg-[#0F5E83] text-white text-xs sm:text-sm font-bold shadow-xs"
                    >
                      <span>{{ slide.botonTexto }}</span>
                      <span aria-hidden="true">↗</span>
                    </a>

                    <a
                      routerLink="/categories"
                      appBubbleButton
                      class="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#98D5EE] dark:border-[#1D4960] bg-white/90 dark:bg-[#0A2535] hover:border-[#1786B4] dark:hover:border-[#4FB3DA] text-[#04202E] dark:text-[#E1F2FA] text-xs sm:text-sm font-bold shadow-2xs"
                    >
                      Explorar categorías
                    </a>
                  </div>
                </div>
              }
            }
          </div>

          <app-carousel-controls
            [slidesCount]="slides.length"
            [activeIndex]="activeSlideIndex()"
            [progress]="progress()"
            [isPaused]="isPaused()"
            (prev)="prevSlide()"
            (next)="nextSlide()"
            (togglePause)="togglePause()"
            (selectSlide)="goToSlide($event)"
          />
        </div>

        <!-- Columna visual del carrusel con fundido cruzado y zoom sutil -->
        <div class="lg:col-span-5 relative min-h-[250px] sm:min-h-[330px] lg:min-h-[450px] bg-[#0A3C55] dark:bg-[#04202E] overflow-hidden">
          @for (slide of slides; track slide.id; let i = $index) {
            <img
              [src]="slide.imagenUrl"
              [alt]="activeSlideIndex() === i ? slide.tituloPre + ' ' + slide.tituloDestacado : ''"
              [attr.aria-hidden]="activeSlideIndex() !== i"
              class="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
              [class.opacity-100]="activeSlideIndex() === i"
              [class.scale-100]="activeSlideIndex() === i"
              [class.opacity-0]="activeSlideIndex() !== i"
              [class.scale-105]="activeSlideIndex() !== i"
              [class.pointer-events-none]="activeSlideIndex() !== i"
            />
          }

          <!-- Gradiente sutil de integración entre columna de texto e imagen -->
          <div
            class="hidden lg:block absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/55 dark:from-[#061722]/75 to-transparent pointer-events-none"
            aria-hidden="true"
          ></div>

          <div class="absolute inset-x-4 bottom-4 sm:left-auto sm:right-5 sm:bottom-5 bg-[#04202E]/90 dark:bg-[#061722]/90 backdrop-blur-md border border-[#98D5EE]/25 rounded-2xl px-4 py-3 text-white shadow-lg">
            <span class="block text-[9px] font-bold tracking-[0.14em] uppercase text-[#98D5EE]">
              INFRAESTRUCTURA PARA TU EMPRESA
            </span>
            <strong class="block text-xs sm:text-sm font-bold text-[#E1F2FA] mt-0.5">
              Cotiza. Consolida. Gestiona.
            </strong>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeHeroComponent implements OnInit, OnDestroy {
  @Input({ required: true }) slides: HeroSlide[] = [];

  public readonly SLIDE_DURATION_MS = 6000;
  public readonly TICK_MS = 50;

  public readonly activeSlideIndex = signal<number>(0);
  public readonly progress = signal<number>(0);
  public readonly isPaused = signal<boolean>(false);

  public readonly currentSlide = computed<HeroSlide | null>(() => {
    if (!this.slides.length) return null;
    const safeIndex = Math.min(Math.max(0, this.activeSlideIndex()), this.slides.length - 1);
    return this.slides[safeIndex];
  });

  private tickTimer?: ReturnType<typeof setInterval>;

  public ngOnInit(): void {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      this.isPaused.set(true);
    }
    this.startProgressLoop();
  }

  public ngOnDestroy(): void {
    this.stopProgressLoop();
  }

  public nextSlide(): void {
    if (!this.slides.length) return;
    this.activeSlideIndex.update(idx => (idx + 1) % this.slides.length);
    this.progress.set(0);
    this.restartProgressLoop();
  }

  public prevSlide(): void {
    if (!this.slides.length) return;
    this.activeSlideIndex.update(idx => (idx - 1 + this.slides.length) % this.slides.length);
    this.progress.set(0);
    this.restartProgressLoop();
  }

  public goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;
    this.activeSlideIndex.set(index);
    this.progress.set(0);
    this.restartProgressLoop();
  }

  public togglePause(): void {
    this.isPaused.update(paused => !paused);
  }

  public advanceTick(stepPercent?: number): void {
    if (this.isPaused() || this.slides.length <= 1) return;
    const increment = stepPercent ?? (this.TICK_MS / this.SLIDE_DURATION_MS) * 100;
    const nextProgress = this.progress() + increment;
    if (nextProgress >= 100) {
      this.progress.set(0);
      this.activeSlideIndex.update(idx => (idx + 1) % this.slides.length);
    } else {
      this.progress.set(nextProgress);
    }
  }

  private startProgressLoop(): void {
    this.stopProgressLoop();
    this.tickTimer = setInterval(() => {
      this.advanceTick();
    }, this.TICK_MS);
  }

  private restartProgressLoop(): void {
    this.startProgressLoop();
  }

  private stopProgressLoop(): void {
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
  }
}
