export const NETWORK_CONFIG = {
  VALIDATE_STATUS: {
    ALWAYS_SUCCESS: () => true,
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_MULTIPLIER: 2,
  },
} as const;

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

export const REQUEST_CONFIG = {
  DEFAULT_METHOD: 'GET',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;
