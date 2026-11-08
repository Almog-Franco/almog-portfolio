import { expect, test } from '@playwright/test';
import { CANDIDATE_TESTS, JOBS, PROFILE, PROJECTS } from '../src/app/data/resume';
import { PortfolioPage } from './pages/portfolio.page';

test.describe('Interactive terminal', () => {
  let portfolio: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolio = new PortfolioPage(page);
    await portfolio.goto();
    await portfolio.waitForTerminalReady();
  });

  test('runs the candidate test suite on load and every test passes', async () => {
    await expect(portfolio.terminalOutput).toContainText('pytest tests/test_candidate.py -v');
    for (const name of CANDIDATE_TESTS) {
      await expect(portfolio.terminalOutput.locator('.test', { hasText: name })).toContainText('PASSED');
    }
    await expect(portfolio.terminalOutput).toContainText(`${CANDIDATE_TESTS.length} passed in`);
  });

  test('help lists the available commands', async () => {
    await portfolio.runCommand('help');
    await expect(portfolio.terminalOutput).toContainText('Available commands:');
    for (const command of ['whoami', 'skills', 'experience', 'contact', 'cv', 'goto <section>']) {
      await expect(portfolio.terminalOutput).toContainText(command);
    }
  });

  test('prompt clears after each command so consecutive commands do not merge', async () => {
    await portfolio.runCommand('whoami');
    await expect(portfolio.terminalInput).toHaveValue('');
    await portfolio.runCommand('pwd');
    await expect(portfolio.terminalOutput).toContainText('/home/recruiter/candidate');
    await expect(portfolio.terminalOutput).not.toContainText('command not found');
  });

  test('contact prints clickable email and LinkedIn links', async () => {
    await portfolio.runCommand('contact');
    await expect(portfolio.terminalOutput.getByRole('link', { name: PROFILE.email })).toHaveAttribute(
      'href',
      `mailto:${PROFILE.email}`,
    );
    await expect(portfolio.terminalOutput.getByRole('link', { name: PROFILE.linkedinLabel })).toHaveAttribute(
      'href',
      PROFILE.linkedin,
    );
  });

  test('wins lists every achievement metric, projects lists every project', async () => {
    await portfolio.runCommand('wins');
    for (const win of JOBS.flatMap((j) => j.wins ?? [])) {
      await expect(portfolio.terminalOutput).toContainText(`[${win.metric}]`);
    }
    await portfolio.runCommand('projects');
    for (const project of PROJECTS) await expect(portfolio.terminalOutput).toContainText(project.name);
  });

  test('unknown commands show a helpful error', async () => {
    await portfolio.runCommand('make-coffee');
    await expect(portfolio.terminalOutput).toContainText('command not found: make-coffee');
    await expect(portfolio.terminalOutput).toContainText('Type "help"');
  });

  test('Tab autocompletes and ArrowUp recalls history', async () => {
    await portfolio.terminalInput.fill('expe');
    await portfolio.terminalInput.press('Tab');
    await expect(portfolio.terminalInput).toHaveValue('experience');

    await portfolio.terminalInput.press('Enter');
    await portfolio.waitForTerminalReady();
    await portfolio.terminalInput.press('ArrowUp');
    await expect(portfolio.terminalInput).toHaveValue('experience');
  });

  test('suggestion chips run the easter-egg hire flow', async () => {
    await portfolio.suggestion('sudo hire almog').click();
    await expect(portfolio.terminalOutput).toContainText('Permission granted');
    await expect(portfolio.terminalOutput.getByRole('link', { name: PROFILE.email })).toBeVisible();
  });

  test('clear empties the output', async () => {
    await portfolio.runCommand('clear');
    await expect(portfolio.terminalOutput.locator('.line:not(.input-line)')).toHaveCount(0);
  });

  test('"/" shortcut focuses the prompt from anywhere on the page', async ({ page }) => {
    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await page.keyboard.press('/');
    await expect(portfolio.terminalInput).toBeFocused();
  });

  test('theme command toggles the colour scheme', async ({ page }) => {
    const html = page.locator('html');
    const before = await html.getAttribute('data-theme');
    await portfolio.runCommand('theme');
    await expect(html).not.toHaveAttribute('data-theme', before ?? '');
  });
});
