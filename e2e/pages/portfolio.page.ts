import { expect, type Locator, type Page } from '@playwright/test';

/** Page object for the single-page portfolio. Locators prefer roles; test ids only where no role fits. */
export class PortfolioPage {
  readonly terminalOutput: Locator;
  readonly terminalInput: Locator;
  readonly themeToggle: Locator;
  readonly skillsSection: Locator;
  readonly skillSearch: Locator;
  readonly skillMatchCount: Locator;
  readonly skillInsight: Locator;
  readonly toast: Locator;
  readonly careerPipeline: Locator;

  constructor(readonly page: Page) {
    this.terminalOutput = page.getByTestId('terminal-output');
    this.terminalInput = page.getByRole('textbox', { name: 'Terminal command' });
    this.themeToggle = page.getByTestId('theme-toggle');
    this.skillsSection = page.locator('#skills');
    this.skillSearch = page.getByRole('searchbox', { name: 'Filter skills' });
    this.skillMatchCount = page.getByTestId('skill-match-count');
    this.skillInsight = page.getByTestId('skill-insight');
    this.toast = page.locator('app-toast').getByRole('status');
    this.careerPipeline = page.getByTestId('career-pipeline');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /** Waits until the boot "pytest" run has finished and the prompt accepts input. */
  async waitForTerminalReady(): Promise<void> {
    await expect(this.terminalOutput).toHaveAttribute('aria-busy', 'false');
  }

  async runCommand(command: string): Promise<void> {
    await this.waitForTerminalReady();
    await this.terminalInput.fill(command);
    await this.terminalInput.press('Enter');
    await this.waitForTerminalReady();
  }

  suggestion(command: string): Locator {
    return this.page.getByRole('button', { name: command, exact: true }).and(this.page.locator('.suggestions button'));
  }

  skillChip(skill: string): Locator {
    return this.skillsSection.getByRole('button', { name: skill, exact: true });
  }

  job(id: string): Locator {
    return this.page.getByTestId(`job-${id}`);
  }

  navLink(label: string): Locator {
    return this.page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: label, exact: true });
  }
}
