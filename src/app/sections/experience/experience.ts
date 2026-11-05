import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ALL_SKILLS, JOBS, Job } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { SkillFocusService } from '../../shared/skill-focus.service';
import { Spotlight } from '../../shared/spotlight';

const SKILL_SET = new Set(ALL_SKILLS);

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Spotlight],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly focus = inject(SkillFocusService);
  protected readonly jobs = JOBS;
  /** The current role starts expanded so recruiters see detail immediately. */
  protected readonly expanded = signal(new Set<string>([JOBS[0].id]));

  protected isExpanded(job: Job): boolean {
    return this.expanded().has(job.id);
  }

  protected toggle(job: Job): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      if (next.has(job.id)) next.delete(job.id);
      else next.add(job.id);
      return next;
    });
  }

  protected isMatch(job: Job): boolean {
    return this.focus.matchingJobIds()?.has(job.id) ?? false;
  }

  protected isDimmed(job: Job): boolean {
    const ids = this.focus.matchingJobIds();
    return !!ids && !ids.has(job.id);
  }

  protected isSkill(tag: string): boolean {
    return SKILL_SET.has(tag);
  }
}
