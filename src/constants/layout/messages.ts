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
  },
} as const;
