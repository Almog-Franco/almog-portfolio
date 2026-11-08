import { expect, test } from '@playwright/test';
import { ALL_SKILLS, JOBS, jobsUsingSkill } from '../src/app/data/resume';
import { PortfolioPage } from './pages/portfolio.page';

test.describe('Skills ↔ experience cross-highlighting', () => {
  let portfolio: PortfolioPage;

  test.beforeEach(async ({ page }) => {
    portfolio = new PortfolioPage(page);
    await portfolio.goto();
  });

  test('selecting a skill highlights every role that used it and dims the rest', async () => {
    const skill = 'PyTest';
    const matching = new Set(jobsUsingSkill(skill).map((j) => j.id));
    expect(matching.size, 'fixture sanity: PyTest should map to at least one role').toBeGreaterThan(0);

    await portfolio.skillChip(skill).click();
    await expect(portfolio.skillChip(skill)).toHaveAttribute('aria-pressed', 'true');
    await expect(portfolio.skillInsight).toContainText(`assert "${skill}" in experience`);
    await expect(portfolio.skillInsight).toContainText('PASSED');

    for (const job of JOBS) {
      if (matching.has(job.id)) {
        await expect(portfolio.job(job.id)).toHaveClass(/\bmatch\b/);
        await expect(portfolio.skillInsight).toContainText(job.company);
      } else {
        await expect(portfolio.job(job.id)).toHaveClass(/\bdim\b/);
      }
    }
  });

  test('clicking the selected skill again clears the highlight', async () => {
    await portfolio.skillChip('Playwright').click();
    await portfolio.skillChip('Playwright').click();
    await expect(portfolio.skillChip('Playwright')).toHaveAttribute('aria-pressed', 'false');
    await expect(portfolio.skillInsight).toBeEmpty();
    await expect(portfolio.page.locator('.tl-item.dim')).toHaveCount(0);
  });

  test('a toolkit skill with no tagged role says so instead of failing', async () => {
    const toolkitSkill = ALL_SKILLS.find((s) => jobsUsingSkill(s).length === 0)!;
    await portfolio.skillChip(toolkitSkill).click();
    await expect(portfolio.skillInsight).toContainText('TOOLKIT');
    await expect(portfolio.skillInsight).toContainText('day-to-day toolkit');
  });

  test('clicking a tag on a job card selects that skill', async () => {
    const droxi = portfolio.job('droxi');
    await droxi.getByRole('button', { name: 'Xray', exact: true }).click();
    await expect(portfolio.skillChip('Xray')).toHaveAttribute('aria-pressed', 'true');
    await expect(droxi).toHaveClass(/\bmatch\b/);
  });

  test('search filters skills and reports the match count', async () => {
    const query = 'git';
    const expected = ALL_SKILLS.filter((s) => s.toLowerCase().includes(query)).length;
    await portfolio.skillSearch.fill(query);
    await expect(portfolio.skillMatchCount).toHaveText(`${expected}/${ALL_SKILLS.length}`);
    await expect(portfolio.skillChip('GitHub Actions')).not.toHaveClass(/\bdim\b/);
    await expect(portfolio.skillChip('Python')).toHaveClass(/\bdim\b/);
  });

  test('job details expand and collapse', async () => {
    const nutrino = portfolio.job('nutrino');
    const toggle = nutrino.getByRole('button', { name: /details/ });
    const firstHighlight = nutrino.getByRole('list', { name: 'Role details' }).getByRole('listitem').first();

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstHighlight).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(firstHighlight).toBeVisible();

    await toggle.click();
    await expect(firstHighlight).toBeHidden();
  });
});
