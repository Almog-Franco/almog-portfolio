import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  CANDIDATE_TESTS,
  CERTIFICATIONS,
  EDUCATION,
  JOBS,
  LANGUAGES,
  PROFILE,
  PROJECTS,
  SECTIONS,
  SKILL_GROUPS,
} from '../../data/resume';
import { ThemeService } from '../../shared/theme.service';
import { prefersReducedMotion, sleep } from '../../shared/motion';

export type LineKind = 'cmd' | 'out' | 'muted' | 'accent' | 'title' | 'test' | 'error' | 'success';

export interface TerminalLine {
  id: number;
  kind: LineKind;
  text: string;
  status?: string;
  href?: string;
  linkText?: string;
}

type LineInput = Omit<TerminalLine, 'id'>;

const COMMANDS: [string, string][] = [
  ['help', 'show this list'],
  ['whoami', 'who is this person?'],
  ['about', 'professional summary'],
  ['skills', 'technical skills by category'],
  ['experience', 'work history (alias: jobs)'],
  ['wins', 'key achievements per role'],
  ['projects', "things I've built"],
  ['education', 'degree, certs & languages'],
  ['contact', 'how to reach me'],
  ['cv', 'download my resume (PDF)'],
  ['pytest', 're-run the candidate test suite'],
  ['goto <section>', 'scroll to a section'],
  ['theme', 'toggle light / dark mode'],
  ['clear', 'clear the terminal'],
];

const COMPLETIONS = [
  ...COMMANDS.map(([c]) => c.split(' ')[0]),
  'jobs',
  'sudo hire almog',
  'ls',
  'history',
  ...SECTIONS.map((s) => `goto ${s.id}`),
];

const FILES: Record<string, string> = {
  'about.md': 'about',
  'skills.json': 'skills',
  'experience.log': 'experience',
  'wins.md': 'wins',
  'projects/': 'projects',
  'education.txt': 'education',
  'contact.vcf': 'contact',
};

@Component({
  selector: 'app-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.html',
  styleUrl: './terminal.scss',
  host: { '(document:keydown)': 'onGlobalKey($event)' },
})
export class Terminal {
  protected readonly lines = signal<TerminalLine[]>([]);
  protected readonly busy = signal(true);
  protected readonly suggestions = ['help', 'wins', 'projects', 'contact', 'sudo hire almog'];

  private readonly body = viewChild.required<ElementRef<HTMLElement>>('body');
  private readonly inputEl = viewChild.required<ElementRef<HTMLInputElement>>('inputEl');
  private readonly theme = inject(ThemeService);

  private fast = prefersReducedMotion();
  private destroyed = false;
  private nextId = 0;
  private history: string[] = [];
  private historyIndex = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => (this.destroyed = true));

    // Keep the newest output in view (scrolls the terminal body only, never the page).
    afterRenderEffect(() => {
      this.lines();
      const el = this.body().nativeElement;
      el.scrollTop = el.scrollHeight;
    });

    afterNextRender(() => void this.boot());
  }

  // ---------------------------------------------------------------- UI events

  protected focusInput(): void {
    if (window.getSelection()?.toString()) return; // don't steal a text selection
    this.inputEl().nativeElement.focus({ preventScroll: true });
  }

  protected onKey(event: KeyboardEvent): void {
    if (this.busy()) {
      if (event.key !== 'Tab') event.preventDefault(); // keep Tab free for keyboard navigation
      return;
    }
    switch (event.key) {
      case 'Enter': {
        const value = this.inputValue;
        this.setInput('');
        void this.run(value);
        break;
      }
      case 'ArrowUp':
        event.preventDefault();
        this.stepHistory(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.stepHistory(1);
        break;
      case 'Tab': {
        const current = this.inputValue.toLowerCase();
        if (!current) return; // empty prompt: let Tab move focus as usual
        event.preventDefault();
        const matches = COMPLETIONS.filter((c) => c.startsWith(current));
        if (matches.length === 1) this.setInput(matches[0]);
        else if (matches.length > 1) this.print({ kind: 'muted', text: matches.join('   ') });
        break;
      }
      case 'l':
        if (event.ctrlKey) {
          event.preventDefault();
          this.lines.set([]);
        }
        break;
    }
  }

  /** "/" anywhere on the page jumps into the terminal. */
  protected onGlobalKey(event: KeyboardEvent): void {
    if (event.key !== '/' || event.metaKey || event.ctrlKey) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, [contenteditable="true"]')) return;
    event.preventDefault();
    const el = this.inputEl().nativeElement;
    el.closest('app-terminal')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  }

  protected async runSuggestion(command: string): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    for (let i = 1; i <= command.length; i++) {
      this.setInput(command.slice(0, i));
      await this.wait(28);
    }
    await this.wait(120);
    this.setInput('');
    this.busy.set(false);
    await this.run(command);
  }

  /** Finish any running animation instantly. */
  protected skip(): void {
    this.fast = true;
  }

  // ---------------------------------------------------------------- engine

  private async boot(): Promise<void> {
    await this.wait(500);
    await this.typeCommand('pytest tests/test_candidate.py -v');
    await this.runSuite();
    this.print({ kind: 'muted', text: '💡 Type "help" — or tap a suggestion below — to explore.' });
    this.fast = prefersReducedMotion();
    this.busy.set(false);
  }

  private async typeCommand(command: string): Promise<void> {
    for (let i = 1; i <= command.length; i++) {
      this.setInput(command.slice(0, i));
      await this.wait(32);
    }
    await this.wait(250);
    this.setInput('');
    this.print({ kind: 'cmd', text: command });
  }

  private async runSuite(): Promise<void> {
    const started = performance.now();
    this.print({ kind: 'title', text: 'test session starts' });
    await this.wait(150);
    this.print({ kind: 'muted', text: 'platform recruiter-os -- Python 3.13, pytest-8.4' });
    this.print({ kind: 'muted', text: `collected ${CANDIDATE_TESTS.length} items` });
    await this.wait(300);
    for (const name of CANDIDATE_TESTS) {
      this.print({ kind: 'test', text: name, status: 'PASSED' });
      await this.wait(210);
    }
    const seconds = ((performance.now() - started) / 1000).toFixed(2);
    this.print({ kind: 'title', text: `${CANDIDATE_TESTS.length} passed in ${seconds}s` });
  }

  private async run(raw: string): Promise<void> {
    const line = raw.trim();
    this.print({ kind: 'cmd', text: line });
    if (!line) return;

    this.history.push(line);
    this.historyIndex = this.history.length;

    const [rawCmd, ...args] = line.split(/\s+/);
    const cmd = rawCmd.toLowerCase();
    const arg = args.join(' ').toLowerCase();

    this.busy.set(true);
    try {
      await this.dispatch(cmd, arg, line);
    } finally {
      this.fast = prefersReducedMotion();
      this.busy.set(false);
    }
  }

  private async dispatch(cmd: string, arg: string, line: string): Promise<void> {
    switch (cmd) {
      case 'help':
      case '?':
        this.print({ kind: 'accent', text: 'Available commands:' });
        for (const [name, desc] of COMMANDS) this.print({ kind: 'out', text: `  ${name.padEnd(16)}${desc}` });
        this.print({ kind: 'muted', text: 'Tip: Tab autocompletes, ↑/↓ browse history.' });
        return;

      case 'whoami':
        this.print({ kind: 'success', text: `${PROFILE.name} — ${PROFILE.title}` });
        this.print({ kind: 'out', text: `📍 ${PROFILE.location}` });
        return;

      case 'about':
      case 'summary':
        this.print({ kind: 'out', text: PROFILE.summary });
        return;

      case 'skills':
        for (const group of SKILL_GROUPS) {
          this.print({ kind: 'accent', text: `▸ ${group.label}` });
          this.print({ kind: 'out', text: `  ${group.skills.join(' · ')}` });
          await this.wait(90);
        }
        return;

      case 'experience':
      case 'jobs':
      case 'git':
        for (const job of JOBS) {
          this.print({ kind: 'out', text: `${job.current ? '●' : '○'} ${job.period.padEnd(15)}${job.role} @ ${job.company}` });
          await this.wait(90);
        }
        this.print({ kind: 'muted', text: '→ run "goto experience" for the full timeline.' });
        return;

      case 'wins':
      case 'achievements':
        for (const job of JOBS.filter((j) => j.wins?.length)) {
          this.print({ kind: 'accent', text: `▸ ${job.company}` });
          for (const win of job.wins ?? []) this.print({ kind: 'out', text: `  [${win.metric}] ${win.text}` });
          await this.wait(90);
        }
        return;

      case 'projects':
        for (const project of PROJECTS) {
          const link = project.links[0];
          this.print({
            kind: 'out',
            text: `● ${project.name} — ${project.tagline} `,
            ...(link ? { href: link.href, linkText: link.label.toLowerCase() } : {}),
          });
          await this.wait(90);
        }
        this.print({ kind: 'muted', text: '→ run "goto projects" for the cards.' });
        return;

      case 'education':
        this.print({ kind: 'accent', text: `🎓 ${EDUCATION.degree}` });
        this.print({ kind: 'out', text: `   ${EDUCATION.school} (${EDUCATION.period})` });
        for (const cert of CERTIFICATIONS) this.print({ kind: 'out', text: `🏅 ${cert.name} — ${cert.detail} (${cert.year})` });
        this.print({ kind: 'out', text: `🗣  ${LANGUAGES.map((l) => `${l.name}: ${l.level}`).join(' · ')}` });
        return;

      case 'contact':
        this.print({ kind: 'out', text: '✉  ', href: `mailto:${PROFILE.email}`, linkText: PROFILE.email });
        this.print({ kind: 'out', text: 'in ', href: PROFILE.linkedin, linkText: PROFILE.linkedinLabel });
        this.print({ kind: 'out', text: '☎  ', href: PROFILE.phoneHref, linkText: PROFILE.phone });
        return;

      case 'cv':
      case 'resume':
        this.print({ kind: 'out', text: `Downloading ${PROFILE.cvFileName}… ` });
        this.download();
        this.print({ kind: 'muted', text: 'Not started? ', href: PROFILE.cvUrl, linkText: 'open it here' });
        return;

      case 'pytest':
      case 'test':
      case 'run':
        await this.runSuite();
        return;

      case 'goto':
      case 'cd': {
        const target = SECTIONS.find((s) => s.id === arg || s.label.toLowerCase() === arg);
        if (!target) {
          this.print({ kind: 'error', text: `Unknown section "${arg}". Try: ${SECTIONS.map((s) => s.id).join(', ')}` });
          return;
        }
        this.print({ kind: 'muted', text: `Scrolling to ${target.label}…` });
        document.getElementById(target.id)?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      case 'theme':
        this.theme.toggle();
        this.print({ kind: 'success', text: `Switched to ${this.theme.theme()} mode.` });
        return;

      case 'ls':
        this.print({ kind: 'out', text: [...Object.keys(FILES), 'resume.pdf'].join('   ') });
        return;

      case 'cat': {
        if (arg === 'resume.pdf') return this.dispatch('cv', '', line);
        const mapped = FILES[arg];
        if (mapped) return this.dispatch(mapped, '', line);
        this.print({ kind: 'error', text: `cat: ${arg || '(missing file)'}: No such file. Try "ls".` });
        return;
      }

      case 'history':
        this.history.forEach((h, i) => this.print({ kind: 'out', text: `${String(i + 1).padStart(4)}  ${h}` }));
        return;

      case 'sudo':
        if (arg.includes('hire')) return this.hire();
        this.print({ kind: 'error', text: 'recruiter is not in the sudoers file. Try "sudo hire almog" 😉' });
        return;

      case 'hire':
        return this.hire();

      case 'echo':
        this.print({ kind: 'out', text: line.slice(5) });
        return;

      case 'pwd':
        this.print({ kind: 'out', text: '/home/recruiter/candidate' });
        return;

      case 'date':
        this.print({ kind: 'out', text: new Date().toString() });
        return;

      case 'rm':
        this.print({ kind: 'error', text: 'Permission denied: this portfolio is protected by a regression suite. 🛡️' });
        return;

      case 'exit':
      case 'quit':
        this.print({ kind: 'muted', text: "There's no exit — only a great next hire. 😄" });
        return;

      case 'clear':
      case 'cls':
        this.lines.set([]);
        return;

      default:
        this.print({ kind: 'error', text: `command not found: ${cmd}` });
        this.print({ kind: 'muted', text: 'Type "help" to see what I can do.' });
    }
  }

  private async hire(): Promise<void> {
    this.print({ kind: 'muted', text: '[sudo] password for recruiter: ********' });
    await this.wait(500);
    const steps: [string, string][] = [
      ['Running background check', 'PASSED'],
      ['Verifying 4+ years of automation', 'PASSED'],
      ['Checking flaky-test tolerance', '0%'],
      ['Preparing offer letter', 'READY'],
    ];
    for (const [label, status] of steps) {
      this.print({ kind: 'test', text: label, status });
      await this.wait(420);
    }
    this.print({ kind: 'success', text: '✔ Permission granted. Next step: ' });
    this.print({ kind: 'out', text: '📬 ', href: `mailto:${PROFILE.email}?subject=Let's%20talk`, linkText: PROFILE.email });
  }

  private download(): void {
    const a = document.createElement('a');
    a.href = PROFILE.cvUrl;
    a.download = PROFILE.cvFileName;
    a.click();
  }

  private stepHistory(direction: 1 | -1): void {
    if (!this.history.length) return;
    this.historyIndex = Math.min(this.history.length, Math.max(0, this.historyIndex + direction));
    this.setInput(this.history[this.historyIndex] ?? '');
  }

  /**
   * The input's DOM value is the source of truth. Writing it directly (instead of a one-way
   * [value] binding) guarantees it clears even if the user typed faster than change detection ran.
   */
  private get inputValue(): string {
    return this.inputEl().nativeElement.value;
  }

  private setInput(value: string): void {
    this.inputEl().nativeElement.value = value;
  }

  private print(line: LineInput): void {
    if (this.destroyed) return;
    this.lines.update((lines) => [...lines, { id: this.nextId++, ...line }]);
  }

  private wait(ms: number): Promise<void> {
    return this.fast || this.destroyed ? Promise.resolve() : sleep(ms);
  }
}
