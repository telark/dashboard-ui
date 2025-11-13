export const AUTH_ERROR_MESSAGES = {
  LOGIN_START_FAILED: 'Failed to start login',
  LOGIN_FINISH_FAILED: 'Failed to complete login',
  REGISTER_START_FAILED: 'Failed to start registration',
  REGISTER_FINISH_FAILED: 'Failed to complete registration',
  LOGOUT_FAILED: 'Failed to logout',
  FETCH_PASSKEYS_FAILED: 'Failed to fetch passkeys',
  FETCH_PASSKEY_FAILED: 'Failed to fetch passkey',
  CREATE_PASSKEY_FAILED: 'Failed to create passkey',
  UPDATE_PASSKEY_FAILED: 'Failed to update passkey',
  DELETE_PASSKEY_FAILED: 'Failed to delete passkey',
  USER_NOT_FOUND: 'User not found',
  CHALLENGE_EXPIRED: 'Challenge expired. Please try again',
  AUTHENTICATION_FAILED: 'Authentication failed',
  SESSION_EXPIRED: 'Session expired. Please login again',
  SESSION_INVALID: 'Invalid session. Please login again',
  WEBAUTHN_NOT_SUPPORTED: 'WebAuthn is not supported in this browser',
  WEBAUTHN_CANCELLED: 'Authentication cancelled by user',
  WEBAUTHN_ERROR: 'WebAuthn operation failed',
  MISSING_CREDENTIAL_ID: 'Credential ID is required',
  MISSING_DEVICE_NAME: 'Device name is required',
  MISSING_USERNAME: 'Username is required',
  LAST_PASSKEY_DELETE: 'Cannot delete last passkey',
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Passkey registered successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  PASSKEY_CREATED: 'Passkey created successfully',
  PASSKEY_UPDATED: 'Passkey updated successfully',
  PASSKEY_DELETED: 'Passkey deleted successfully',
} as const;

export const AUTH_INFO_MESSAGES = {
  LOGGING_IN: 'Authenticating...',
  REGISTERING: 'Registering passkey...',
  LOADING_PASSKEYS: 'Loading passkeys...',
  DELETING_PASSKEY: 'Deleting passkey...',
  UPDATING_PASSKEY: 'Updating passkey...',
} as const;

export const AUTH_CONSTANTS = {
  SESSION: {
    VALIDATION: {
      NO_TOKEN_ERROR: 'No session token found',
      FETCH_ERROR: 'Failed to fetch session details',
      VALIDATION_ERROR: 'Session validation error',
      UNKNOWN_ERROR: 'Unknown error during session validation',
      INVALID_TIMESTAMP_ERROR: 'Invalid timestamp format',
    },
    EXPIRATION: {
      MODAL: {
        TITLE: 'Session Expired',
        MESSAGE: 'Your session has expired. Please log in again to continue.',
        BUTTON_TEXT: 'Go to Login',
      },
      LOGS: {
        DELETE_NON_200_STATUS: 'Session delete returned non-200 status:',
        DELETE_FAILED: 'Failed to delete session from server:',
        LOCAL_CLEANUP_ERROR: 'Error during local cleanup:',
        HANDLE_LOGIN_ERROR: 'Error in handleGoToLogin:',
      },
    },
  },
} as const;

