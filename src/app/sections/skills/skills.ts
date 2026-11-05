import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ALL_SKILLS, SKILL_GROUPS, jobsUsingSkill } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';
import { SkillFocusService } from '../../shared/skill-focus.service';
import { Spotlight } from '../../shared/spotlight';

@Component({
  selector: 'app-skills',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Spotlight],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  protected readonly focus = inject(SkillFocusService);
  protected readonly groups = SKILL_GROUPS;
  protected readonly total = ALL_SKILLS.length;
  protected readonly query = signal('');

  protected readonly normalizedQuery = computed(() => this.query().trim().toLowerCase());
  protected readonly matchCount = computed(() => {
    const q = this.normalizedQuery();
    return q ? ALL_SKILLS.filter((s) => s.toLowerCase().includes(q)).length : this.total;
  });

  /** Companies where the currently selected skill was used. */
  protected readonly selectedUsage = computed(() => {
    const skill = this.focus.selected();
    return skill ? jobsUsingSkill(skill) : [];
  });

  protected matches(skill: string): boolean {
    const q = this.normalizedQuery();
    return !q || skill.toLowerCase().includes(q);
  }

  protected usedAtCount(skill: string): number {
    return jobsUsingSkill(skill).length;
  }

  protected onSearch(value: string): void {
    this.query.set(value);
  }
}
