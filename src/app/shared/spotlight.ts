import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Adds a soft glow that follows the pointer across a card.
 * Writes CSS custom properties directly (outside change detection) for smoothness.
 */
@Directive({
  selector: '[appSpotlight]',
  host: { class: 'spotlight' },
})
export class Spotlight {
  constructor() {
    const el: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        el.style.setProperty('--my', `${e.clientY - rect.top}px`);
      };
      el.addEventListener('pointermove', onMove, { passive: true });
      destroyRef.onDestroy(() => el.removeEventListener('pointermove', onMove));
    });
  }
}
