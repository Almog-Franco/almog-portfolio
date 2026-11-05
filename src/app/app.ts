import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Contact } from './sections/contact/contact';
import { Education } from './sections/education/education';
import { Experience } from './sections/experience/experience';
import { Hero } from './sections/hero/hero';
import { Nav } from './sections/nav/nav';
import { Skills } from './sections/skills/skills';
import { Pipeline } from './sections/pipeline/pipeline';
import { Toast } from './shared/toast';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Nav, Hero, Pipeline, Skills, Experience, Education, Contact, Toast],
  template: `
    <div class="backdrop" aria-hidden="true">
      <span class="blob blob-a"></span>
      <span class="blob blob-b"></span>
      <span class="grid"></span>
    </div>
    <a class="skip-link" href="#skills">Skip to content</a>
    <app-nav />
    <main>
      <app-hero />
      <app-pipeline />
      <app-skills />
      <app-experience />
      <app-education />
      <app-contact />
    </main>
    <app-toast />
  `,
})
export class App {}
