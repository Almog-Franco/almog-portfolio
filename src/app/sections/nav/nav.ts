import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { SECTIONS, SectionId } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { ThemeService } from '../../shared/theme.service';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
})
export class Nav {
  protected readonly theme = inject(ThemeService);
  protected readonly sections = SECTIONS;
  protected readonly active = signal<SectionId>('about');
  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  private readonly progressBar = viewChild.required<ElementRef<HTMLElement>>('progress');

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const root = document.documentElement;
      // Scroll handling writes styles directly and only touches signals when values change.
      const onScroll = () => {
        const max = root.scrollHeight - root.clientHeight;
        const ratio = max > 0 ? root.scrollTop / max : 0;
        this.progressBar().nativeElement.style.transform = `scaleX(${ratio})`;
        this.scrolled.set(root.scrollTop > 16);
        if (max > 0 && root.scrollTop >= max - 4) this.active.set('contact');
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));

      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(entry.target.id as SectionId);
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) observer.observe(el);
      }

      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
