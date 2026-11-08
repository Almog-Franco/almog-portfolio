import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CERTIFICATIONS, EDUCATION, LANGUAGES } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { Spotlight } from '../../shared/spotlight';

@Component({
  selector: 'app-education',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Spotlight],
  template: `
    <section id="education" class="section">
      <div class="container">
        <header class="section-head" appReveal>
          <span class="kicker">04 · education.txt</span>
          <h2 class="section-title">Foundations</h2>
        </header>

        <div class="edu-grid">
          <article class="card edu" appSpotlight [appReveal]="0">
            <span class="edu-icon"><app-icon name="graduation" [size]="22" /></span>
            <p class="edu-label">Education</p>
            <h3>{{ education.degree }}</h3>
            <p class="edu-meta">{{ education.school }}</p>
            <p class="edu-year">{{ education.period }}</p>
          </article>

          @for (cert of certifications; track cert.name) {
            <article class="card edu" appSpotlight [appReveal]="90">
              <span class="edu-icon"><app-icon name="award" [size]="22" /></span>
              <p class="edu-label">Certification</p>
              <h3>{{ cert.name }}</h3>
              <p class="edu-meta">{{ cert.detail }}</p>
              <p class="edu-year">{{ cert.year }}</p>
            </article>
          }

          <article class="card edu" appSpotlight [appReveal]="180">
            <span class="edu-icon"><app-icon name="languages" [size]="22" /></span>
            <p class="edu-label">Languages</p>
            <ul class="langs">
              @for (lang of languages; track lang.name) {
                <li>
                  <span>{{ lang.name }}</span><span class="lvl">{{ lang.level }}</span>
                </li>
              }
            </ul>
          </article>
        </div>
      </div>
    </section>
  `,
  styles: `
    .edu-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 20px;
    }
    .edu {
      padding: 26px;
    }
    .edu-icon {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      color: var(--accent-2);
      background: color-mix(in srgb, var(--accent-2) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent-2) 30%, transparent);
    }
    .edu-label {
      margin: 18px 0 6px;
      font-family: var(--font-mono);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    h3 {
      margin: 0;
      font-size: 19px;
      font-weight: 700;
    }
    .edu-meta {
      margin: 6px 0 0;
      color: var(--muted);
    }
    .edu-year {
      margin: 14px 0 0;
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--accent);
    }
    .langs {
      margin: 0;
      padding: 0;
      list-style: none;
      li {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-weight: 600;
        & + li { border-top: 1px dashed var(--border); }
      }
      .lvl {
        font-weight: 500;
        color: var(--accent);
        font-family: var(--font-mono);
        font-size: 13px;
      }
    }
    @media (max-width: 900px) {
      .edu-grid { grid-template-columns: 1fr; }
    }
  `,
})
export class Education {
  protected readonly education = EDUCATION;
  protected readonly certifications = CERTIFICATIONS;
  protected readonly languages = LANGUAGES;
}
