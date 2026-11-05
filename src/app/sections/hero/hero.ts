import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';
import { PROFILE } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { prefersReducedMotion, sleep } from '../../shared/motion';
import { Terminal } from '../terminal/terminal';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Terminal],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly profile = PROFILE;
  protected readonly typedRole = signal(PROFILE.roles[0]);
  private destroyed = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => (this.destroyed = true));
    afterNextRender(() => {
      if (!prefersReducedMotion()) void this.cycleRoles();
    });
  }

  private async cycleRoles(): Promise<void> {
    const roles = this.profile.roles;
    let index = 0;
    await sleep(2400);
    while (!this.destroyed) {
      const current = roles[index % roles.length];
      for (let i = current.length; i >= 0 && !this.destroyed; i--) {
        this.typedRole.set(current.slice(0, i));
        await sleep(28);
      }
      index++;
      const next = roles[index % roles.length];
      await sleep(250);
      for (let i = 1; i <= next.length && !this.destroyed; i++) {
        this.typedRole.set(next.slice(0, i));
        await sleep(65);
      }
      await sleep(2200);
    }
  }
}
