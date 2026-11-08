import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS, UNIVERSITY_PROJECTS } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { Spotlight } from '../../shared/spotlight';
import { CiStatus } from './ci-status';

@Component({
  selector: 'app-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Spotlight, CiStatus],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  protected readonly projects = PROJECTS;
  protected readonly university = UNIVERSITY_PROJECTS;
}
