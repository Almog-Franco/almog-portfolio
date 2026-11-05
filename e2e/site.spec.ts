import { expect, test } from '@playwright/test';
import { PROFILE } from '../src/app/data/resume';
import { PortfolioPage } from './pages/portfolio.page';

test.describe('Site basics', () => {
  test('loads at the top with no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    await portfolio.waitForTerminalReady();

    await expect(page).toHaveTitle(/Almog Franco/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${PROFILE.name}.`);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    expect(errors).toEqual([]);
  });

  test('nav links scroll to their section and mark it current', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    await portfolio.navLink('Experience').click();
    await expect(page).toHaveURL(/#experience$/);
    await expect(page.locator('#experience')).toBeInViewport();
    await expect(portfolio.navLink('Experience')).toHaveAttribute('aria-current', 'true');
  });

  test('theme choice persists across reloads', async ({ page }) => {
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    const html = page.locator('html');
    const initial = (await html.getAttribute('data-theme'))!;
    const flipped = initial === 'dark' ? 'light' : 'dark';

    await portfolio.themeToggle.click();
    await expect(html).toHaveAttribute('data-theme', flipped);
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', flipped);
  });

  test('resume PDF is served and linked', async ({ page, request }) => {
    const response = await request.get(PROFILE.cvUrl);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/pdf');

    const portfolio = new PortfolioPage(page);
    await portfolio.goto();
    await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', PROFILE.cvUrl);
  });

  test('copy-email button puts the address on the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const portfolio = new PortfolioPage(page);
    await portfolio.goto();

    await page.getByRole('button', { name: 'Copy email address' }).click();
    await expect(portfolio.toast).toHaveText(/Email copied/);
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(PROFILE.email);
  });

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('hamburger menu opens, navigates and closes', async ({ page }) => {
      const portfolio = new PortfolioPage(page);
      await portfolio.goto();
      const menuButton = page.getByRole('button', { name: 'Open menu' });

      await expect(portfolio.navLink('Skills')).toBeHidden();
      await menuButton.click();
      await expect(portfolio.navLink('Skills')).toBeVisible();

      await portfolio.navLink('Skills').click();
      await expect(page).toHaveURL(/#skills$/);
      await expect(portfolio.navLink('Skills')).toBeHidden();
    });

    test('page never scrolls horizontally', async ({ page }) => {
      const portfolio = new PortfolioPage(page);
      await portfolio.goto();
      await portfolio.waitForTerminalReady();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
});
