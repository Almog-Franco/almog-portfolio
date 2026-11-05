import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="toast" [class.show]="toast.message()" role="status" aria-live="polite">{{ toast.message() }}</div>`,
  styles: `
    .toast {
      position: fixed;
      top: 84px;
      left: 50%;
      z-index: 120;
      padding: 10px 18px;
      border-radius: 12px;
      background: var(--accent);
      color: var(--on-accent);
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 16px 40px -12px var(--shadow);
      transform: translate(-50%, -16px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s, transform 0.25s;
    }
    .toast.show {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  `,
})
export class Toast {
  protected readonly toast = inject(ToastService);
}
