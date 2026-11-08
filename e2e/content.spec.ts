import { expect, test } from '@playwright/test';
import { JOBS, PROJECTS, UNIVERSITY_PROJECTS } from '../src/app/data/resume';
import { PortfolioPage } from './pages/portfolio.page';

test.describe('Key wins', () => {
  test('every role with wins shows each metric and its description', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();

    for (const job of JOBS.filter((j) => j.wins?.length)) {
      const wins = portfolio.job(job.id).getByRole('list', { name: 'Key wins' }).getByRole('listitem');
      await expect(wins).toHaveCount(job.wins!.length);
      for (const [i, win] of job.wins!.entries()) {
        await expect(wins.nth(i)).toContainText(win.metric);
        await expect(wins.nth(i)).toContainText(win.text);
      }
    }
  });
});

test.describe('Projects', () => {
  test('renders every project with its tech, links and accessible images', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();

    for (const project of PROJECTS) {
      const card = portfolio.project(project.id);
      await expect(card.getByRole('heading', { name: project.name })).toBeVisible();
      for (const tech of project.tech) await expect(card).toContainText(tech);
      for (const link of project.links) {
        await expect(card.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
      }
      if (project.image) await expect(card.getByRole('img', { name: project.image.alt })).toBeVisible();
      if (project.note) await expect(card).toContainText(project.note);
    }
    for (const uni of UNIVERSITY_PROJECTS) {
      await expect(page.getByRole('link', { name: uni.name })).toHaveAttribute('href', uni.href);
    }
  });

  test('project images are served', async ({ request }) => {
    for (const project of PROJECTS.filter((p) => p.image)) {
      const response = await request.get(project.image!.src);
      expect(response.status(), project.image!.src).toBe(200);
      expect(response.headers()['content-type']).toContain('image/');
    }
  });

  test('no project or page text refers to a home assignment', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    const text = await page.locator('main').innerText();
    expect(text).not.toMatch(/assignment|home[- ]?task|\bexam\b|\bness\b/i);
    for (const href of await page.locator('a[href*="github.com"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(href).not.toMatch(/Ness-task|Droxi-Assignment/i);
    }
  });

  test.describe('live CI badge', () => {
    const cases = [
      { ci: 'success', label: /CI passing · 2 hours ago/, state: 'success' },
      { ci: 'failure', label: /CI failing · 2 hours ago/, state: 'failure' },
      { ci: 'error', label: /view CI runs/, state: 'unknown' },
    ] as const;

    for (const { ci, label, state } of cases) {
      test(`shows "${state}" when the latest run is ${ci}`, async ({ page }) => {
        const portfolio = new PortfolioPage(page);
        await portfolio.goto({ ci });
        const badge = portfolio.project('portfolio').getByTestId('ci-status');
        await expect(badge).toHaveAttribute('data-state', state);
        await expect(badge).toHaveText(label);
        await expect(badge).toHaveAttribute('href', ci === 'error' ? /actions\/workflows\/ci\.yml$/ : 'https://github.com/run/123');
      });
    }
  });
});
