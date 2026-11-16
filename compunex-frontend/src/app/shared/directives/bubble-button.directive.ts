import { Directive, ElementRef, HostBinding, HostListener, OnDestroy, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appBubbleButton]',
  standalone: true
})
export class BubbleButtonDirective implements OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private readonly cleanupTimers = new Set<ReturnType<typeof setTimeout>>();

  @HostBinding('class.btn-bubble')
  public readonly hasBubbleClass = true;

  @HostListener('mouseenter', ['$event'])
  public onMouseEnter(event: MouseEvent): void {
    this.spawnBubbles(event.clientX, event.clientY, 6);
  }

  @HostListener('pointerdown', ['$event'])
  public onPointerDown(event: PointerEvent): void {
    this.spawnBubbles(event.clientX, event.clientY, 8);
  }

  public ngOnDestroy(): void {
    for (const timer of this.cleanupTimers) {
      clearTimeout(timer);
    }
    this.cleanupTimers.clear();
  }

  private spawnBubbles(clientX: number, clientY: number, count: number): void {
    const host = this.el.nativeElement;
    if (!host || this.isDisabled(host) || this.prefersReducedMotion()) {
      return;
    }

    const rect = host.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const originX = clientX > 0 ? clientX - rect.left : rect.width / 2;
    const originY = clientY > 0 ? clientY - rect.top : rect.height / 2;

    for (let i = 0; i < count; i++) {
      const bubble = this.renderer.createElement('span') as HTMLSpanElement;
      this.renderer.addClass(bubble, 'btn-bubble-particle');

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const distance = 18 + Math.random() * 26;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 8;
      const size = 5 + Math.random() * 6;
      const dur = 380 + Math.round(Math.random() * 160);

      this.renderer.setStyle(bubble, 'left', `${originX}px`);
      this.renderer.setStyle(bubble, 'top', `${originY}px`);
      bubble.style.setProperty('--tx', `${tx.toFixed(1)}px`);
      bubble.style.setProperty('--ty', `${ty.toFixed(1)}px`);
      bubble.style.setProperty('--size', `${size.toFixed(1)}px`);
      bubble.style.setProperty('--dur', `${dur}ms`);

      this.renderer.appendChild(host, bubble);

      const timer = setTimeout(() => {
        this.cleanupTimers.delete(timer);
        if (bubble.parentNode === host) {
          this.renderer.removeChild(host, bubble);
        }
      }, dur + 40);
      this.cleanupTimers.add(timer);
    }
  }

  private isDisabled(host: HTMLElement): boolean {
    if ('disabled' in host && (host as HTMLButtonElement).disabled) {
      return true;
    }
    return host.getAttribute('aria-disabled') === 'true';
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
