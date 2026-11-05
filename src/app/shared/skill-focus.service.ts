import { Injectable, computed, signal } from '@angular/core';
import { jobsUsingSkill } from '../data/resume';

/** Shared state: the skill a visitor clicked, used to cross-highlight the experience timeline. */
@Injectable({ providedIn: 'root' })
export class SkillFocusService {
  readonly selected = signal<string | null>(null);
  readonly matchingJobIds = computed(() => {
    const skill = this.selected();
    return skill ? new Set(jobsUsingSkill(skill).map((j) => j.id)) : null;
  });

  toggle(skill: string): void {
    this.selected.update((current) => (current === skill ? null : skill));
  }

  clear(): void {
    this.selected.set(null);
  }
}
