import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Standalone on purpose: vite.config.ts forces NODE_ENV to production, and React's production build has no act().
export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  define: {
    __DEV__: 'false',
    // Same-origin API URLs, as in production: the dev ports are cross-origin, and jsdom enforces CORS.
    __IN_CLUSTER__: 'true',
    __APP_VERSION__: JSON.stringify('0.0.0-test'),
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    // Expected failures log on purpose: keep the console for the tests that fail.
    silent: 'passed-only',
    testTimeout: 30_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/**/*.d.ts'],
      reporter: ['text-summary', 'lcov', 'json-summary'],
      reportsDirectory: 'coverage',
      thresholds: { lines: 40, statements: 40, functions: 40, branches: 40 },
    },
  },
});
