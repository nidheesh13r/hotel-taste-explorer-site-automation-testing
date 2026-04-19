const { defineConfig } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: {
    timeout: 8_000,
  },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  outputDir: 'test-results/artifacts',
  reporter: [
    ['list', { printSteps: true }],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  projects: [
    {
      name: 'hotels-frontend',
      testMatch: /hotels.*\.spec\.ts$/,
      use: {
        baseURL: process.env.HOTELS_BASE_URL || 'http://localhost:5174',
        testIdAttribute: 'data-testid',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
      },
    },
    {
      name: 'taste-frontend',
      testMatch: /taste.*\.spec\.ts$/,
      use: {
        baseURL: process.env.TASTE_BASE_URL || 'http://localhost:5176',
        testIdAttribute: 'data-testid',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
      },
    },
    {
      name: 'login-frontend',
      testMatch: /auth.*\.spec\.ts$/,
      use: {
        baseURL: process.env.LOGIN_BASE_URL || 'http://localhost:5173',
        testIdAttribute: 'data-testid',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
      },
    },
    // Optionally, add backend API test projects here
     {
       name: 'hotels-backend',
       testMatch: /api-hotels.*\.spec\.ts$/,
       use: { baseURL: process.env.HOTELS_API_URL || 'http://localhost:8001' }
     },
     {
       name: 'taste-backend',
       testMatch: /api-taste.*\.spec\.ts$/,
       use: { baseURL: process.env.TASTE_API_URL || 'http://localhost:8002' }
     },
  ],
  // Optional: globalSetup for login/session reuse, seeding, etc.
   globalSetup: require.resolve('./global-setup'),
  // Optional: Xray/Jira mapping (use grep or test annotations in your tests)
   grep: /@TAHA-/,
});
