import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { installBrowserStubs, resetLayoutWidth } from './browser';
import { server } from './server';

// Antd-heavy pages take longer than the 1 s default to settle when the whole suite runs in parallel.
configure({ asyncUtilTimeout: 10_000 });
MotionGlobalConfig.skipAnimations = true;
installBrowserStubs();

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));

afterEach(() => {
  // Without vitest globals, Testing Library can't register its own cleanup.
  cleanup();
  server.resetHandlers();
  resetLayoutWidth();
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => server.close());
