import { HTTP_HEADERS } from './headers';

export const API_RESPONSES = {
  SILENT_404: {
    data: null,
    status: 404,
    statusText: 'Not Found',
    headers: {},
  },
  NETWORK_ERROR: {
    _network: true,
  },
} as const;

// Lists and details pages refresh their data in the background at this pace.
export const POLL_INTERVAL_MS = 60_000;

// Event streams reconnect with a doubling backoff, spread ±20 % so tabs don't reconnect in step.
export const SSE_BACKOFF_MS = { min: 1000, max: 30000 } as const;
export const SSE_BACKOFF_JITTER = 0.2;
// Servers ping every 15 s, so this long without a byte means a dead link or a buffering proxy.
export const SSE_WATCHDOG_MS = 35_000;
// A stream must stay up this long before its backoff starts over, so one that dies at once keeps backing off.
export const SSE_STABLE_MS = 30_000;

export const REQUEST_CONFIG = {
  DEFAULT_METHOD: 'GET',
  // A shed GET is retried once after the server's Retry-After, never waiting longer than this.
  RETRY_AFTER_CAP_MS: 5000,
  // X-Requested-With lets a change through the backends' CSRF rule: a page on another origin can't add it.
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    [HTTP_HEADERS.CUSTOM.REQUESTED_WITH]: 'XMLHttpRequest',
  },
} as const;
