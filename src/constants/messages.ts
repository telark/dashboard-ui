export const ERROR_MESSAGES = {
  API: {
    NETWORK_ERROR: 'API Network Error:',
    TIMEOUT_ERROR: 'API Timeout:',
    NOT_FOUND_WARNING: 'API Warning (404):',
    GENERIC_ERROR: 'API Error:',
    UNKNOWN_ERROR: 'Unknown error',
  },

  CLIENT: {
    FETCH_GROUPERS_FAILED: '[APIClient] Failed to fetch all groupers:',
    FETCH_GROUPER_DETAILS_FAILED: '[APIClient] Failed to fetch grouper details for',
    UPDATE_SYNC_MODE_FAILED: '[APIClient] Failed to update sync mode for',
    FETCH_MAINTENANCE_MODE_FAILED: '[APIClient] Failed to fetch maintenance mode for',
    ENABLE_MAINTENANCE_MODE_FAILED: '[APIClient] Failed to enable maintenance mode for',
    UPDATE_MAINTENANCE_MODE_FAILED: '[APIClient] Failed to update maintenance mode for',
    REMOVE_MAINTENANCE_MODE_FAILED: '[APIClient] Failed to remove maintenance mode for',
    START_CLUSTER_ANALYSIS_FAILED: '[APIClient] Failed to start cluster analysis:',
  },

  INSIGHTS: {
    NETWORK_UNAVAILABLE: 'NETWORK_UNAVAILABLE',
    CHECK_CLUSTER_FAILED: 'Failed to check cluster insights',
  },
} as const;

export const SUCCESS_MESSAGES = {
  WELCOME: 'Welcome to our App!',
  WELCOME_SUBTITLE: 'Your cluster analysis is ready',
} as const;

export const WARNING_MESSAGES = {
  BACKEND_UNAVAILABLE: 'Backend unavailable',
  BACKEND_UNAVAILABLE_DESCRIPTION:
    "We're unable to connect to the backend service. Retrying with increasing intervals.",
} as const;

export const INFO_MESSAGES = {
  STARTUP: {
    TITLE: 'Preparing your cluster analysis',
    DESCRIPTION:
      "We'll scan your cluster to surface health, workload insights, and trends. Kick off the first analysis now — it's quick, read‑only, and safe for production workloads.",
  },
} as const;
