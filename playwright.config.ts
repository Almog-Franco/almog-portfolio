import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['PORT'] ?? 4200);
const isCI = !!process.env['CI'];
/** Set BASE_URL to run the suite against a deployed site instead of a local server. */
const externalBaseUrl = process.env['BASE_URL'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: externalBaseUrl ?? `http://localhost:${PORT}`,
    // Reduced motion makes the terminal and reveal animations finish instantly → deterministic tests.
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: externalBaseUrl
    ? undefined
    : {
        command: `npx ng serve --configuration production --port ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
});
