export const ERROR_MESSAGES = {
  API: {
    NETWORK_ERROR: 'API Network Error:',
    TIMEOUT_ERROR: 'API Timeout:',
    NOT_FOUND_WARNING: 'API Warning (404):',
    FORBIDDEN_WARNING: 'API Warning (403):',
    GENERIC_ERROR: 'API Error:',
    UNKNOWN_ERROR: 'Unknown error',
  },

  CLIENT: {
    UPDATE_SYNC_MODE_FAILED: '[APIClient] Failed to update sync mode for',
  },
} as const;

export const FEATURE_ERROR_BOUNDARY_TEXT = {
  TITLE: (featureName: string) => `Error in ${featureName}`,
  TITLE_FALLBACK: 'Something went wrong',
  DESCRIPTION:
    'An error occurred while loading this section. You can try again or return to the dashboard.',
  TRY_AGAIN: 'Try Again',
  GO_TO_DASHBOARD: 'Go to Dashboard',
} as const;
