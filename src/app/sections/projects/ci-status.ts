import { ChangeDetectionStrategy, Component, afterNextRender, computed, input, signal } from '@angular/core';
import { timeAgo } from '../../shared/time';

type CiState = 'loading' | 'success' | 'failure' | 'unknown';

interface WorkflowRunsResponse {
  workflow_runs?: { conclusion: string | null; updated_at: string; html_url: string }[];
}

/** Live status of the latest completed GitHub Actions run on main (public API, no token needed). */
@Component({
  selector: 'app-ci-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="ci" [href]="href()" target="_blank" rel="noopener" [attr.data-state]="state()" data-testid="ci-status">
      <span class="dot" aria-hidden="true"></span>{{ label() }}
    </a>
  `,
  styles: `
    .ci {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid var(--border);
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--muted);
      white-space: nowrap;
      transition: border-color 0.2s;
      &:hover { border-color: var(--accent); }
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--muted);
    }
    [data-state='success'] { color: var(--accent); .dot { background: var(--accent); } }
    [data-state='failure'] { color: var(--danger); .dot { background: var(--danger); } }
    [data-state='loading'] .dot { animation: blink 1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0.2; } }
  `,
})
export class CiStatus {
  readonly repo = input.required<string>();
  readonly workflow = input.required<string>();

  protected readonly state = signal<CiState>('loading');
  private readonly finishedAt = signal<Date | null>(null);
  private readonly runUrl = signal<string | null>(null);

  protected readonly href = computed(
    () => this.runUrl() ?? `https://github.com/${this.repo()}/actions/workflows/${this.workflow()}`,
  );

  protected readonly label = computed(() => {
    const when = this.finishedAt();
    const ago = when ? ` · ${timeAgo(when)}` : '';
    switch (this.state()) {
      case 'loading':
        return 'checking CI…';
      case 'success':
        return `CI passing${ago}`;
      case 'failure':
        return `CI failing${ago}`;
      default:
        return 'view CI runs';
    }
  });

  constructor() {
    afterNextRender(() => void this.load());
  }

  private async load(): Promise<void> {
    const url = `https://api.github.com/repos/${this.repo()}/actions/workflows/${this.workflow()}/runs?branch=main&status=completed&per_page=1`;
    try {
      const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const run = ((await response.json()) as WorkflowRunsResponse).workflow_runs?.[0];
      if (!run) throw new Error('no runs');
      this.finishedAt.set(new Date(run.updated_at));
      this.runUrl.set(run.html_url);
      this.state.set(run.conclusion === 'success' ? 'success' : 'failure');
    } catch {
      this.state.set('unknown'); // rate-limited or offline: fall back to a plain link
    }
  }
}
