import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://localhost:5174',
    locale: 'de-DE',
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'npm run dev --workspace server',
      port: 4100,
      reuseExistingServer: true,
      env: {
        PORT: '4100',
        MONGODB_URI: 'mongodb://localhost:27017/shopping_test',
        CORS_ORIGIN: 'http://localhost:5174',
        NODE_ENV: 'test',
        DEFAULT_LIST_TITLE: 'Was brauchst du heute?',
      },
    },
    {
      command: 'npm run dev --workspace client -- --port 5174',
      port: 5174,
      reuseExistingServer: true,
      env: {
        VITE_API_URL: 'http://localhost:4100',
      },
    },
  ],
});
