export const ERROR_MESSAGES = {
  API: {
    NETWORK_ERROR: 'API Network Error:',
    TIMEOUT_ERROR: 'API Timeout:',
    NOT_FOUND_WARNING: 'API Warning (404):',
    GENERIC_ERROR: 'API Error:',
    UNKNOWN_ERROR: 'Unknown error',
  },

  CLIENT: {
    UPDATE_SYNC_MODE_FAILED: '[APIClient] Failed to update sync mode for',
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
    'We cannot reach the services yet. We will retry with increasing intervals. Please start your backend if it is stopped.',
} as const;

export const INFO_MESSAGES = {
  STARTUP: {
    TITLE: 'Preparing your cluster analysis',
    DESCRIPTION:
      'We will scan your cluster to identify health issues, workload insights, and trends. Start your first analysis now — it is quick, read-only, and safe for production workloads.',
  },
} as const;
