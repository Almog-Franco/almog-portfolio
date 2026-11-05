import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { STATS } from '../../data/resume';
import { prefersReducedMotion } from '../../shared/motion';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="stats" aria-label="Highlights">
      <div class="container stats-grid">
        @for (stat of stats; track stat.label; let i = $index) {
          <div class="stat" [appReveal]="i * 90">
            <span class="stat-value" data-testid="stat-value">{{ current()[i] }}{{ stat.suffix }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        }
      </div>
    </section>
  `,
  styleUrl: './stats.scss',
})
export class Stats {
  protected readonly stats = STATS;
  protected readonly current = signal(STATS.map(() => 0));

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        this.current.set(STATS.map((s) => s.value));
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            this.countUp();
          }
        },
        { threshold: 0.4 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private countUp(durationMs = 1400): void {
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const frame = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      this.current.set(STATS.map((s) => Math.round(s.value * ease(progress))));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}
