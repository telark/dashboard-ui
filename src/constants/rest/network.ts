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

export const REQUEST_CONFIG = {
  DEFAULT_METHOD: 'GET',
  // A shed GET is retried once after the server's Retry-After, never waiting longer than this.
  RETRY_AFTER_CAP_MS: 5000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
