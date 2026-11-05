import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { CAREER_PIPELINE, PIPELINE_META } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { prefersReducedMotion } from '../../shared/motion';

/**
 * Career shown as a CI workflow run: each role is a job, connected oldest → newest.
 * The run "executes" (connectors fill, checks pop in) the first time it scrolls into view.
 */
@Component({
  selector: 'app-pipeline',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.scss',
})
export class Pipeline {
  protected readonly jobs = CAREER_PIPELINE;
  protected readonly meta = PIPELINE_META;
  protected readonly passed = CAREER_PIPELINE.filter((j) => !j.current).length;
  protected readonly running = CAREER_PIPELINE.length - this.passed;
  protected readonly started = signal(false);

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
        this.started.set(true);
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer.disconnect();
            this.started.set(true);
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(host);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
