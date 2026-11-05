import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PROFILE } from '../../data/resume';
import { Icon } from '../../shared/icon';
import { copyToClipboard } from '../../shared/motion';
import { Reveal } from '../../shared/reveal';
import { Spotlight } from '../../shared/spotlight';
import { ToastService } from '../../shared/toast.service';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, Spotlight],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  protected readonly profile = PROFILE;
  protected readonly copied = signal(false);
  protected readonly year = new Date().getFullYear();
  private readonly toast = inject(ToastService);

  protected async copyEmail(): Promise<void> {
    const ok = await copyToClipboard(this.profile.email);
    this.toast.show(ok ? 'Email copied to clipboard ✓' : `Copy failed — it's ${this.profile.email}`);
    if (ok) {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    }
  }
}
