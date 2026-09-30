export const AUTH_PERMISSIONS_LABELS = {
  NO_PERMISSIONS_TITLE: 'No permissions',
  NO_PERMISSIONS_DESCRIPTION:
    'Your account has no roles assigned. Contact your administrator to request access.',
  FULL_ACCESS_TITLE: 'Full access to Telark',
  FULL_ACCESS_DESCRIPTION: 'As the bootstrap administrator, you have full access to every scope.',
  SOURCE_DIRECT: 'Direct',
  SOURCE_INHERITED: (groupName?: string) => `Inherited from ${groupName || 'a group'}`,
  SOURCE_DIRECT_TOOLTIP: 'Role was assigned directly to your account',
  SOURCE_INHERITED_TOOLTIP: 'Role was inherited through a group membership',
};

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
  PASSKEYS_INSECURE_CONTEXT: {
    TITLE: 'Passkeys need a secure connection',
    DESCRIPTION:
      'Browsers only allow passkeys on https:// pages or on http://localhost. Ask your administrator to enable TLS on the ingress or load balancer, then open the dashboard over https://.',
    TAG: 'HTTPS required',
  },
  WEBAUTHN_CANCELLED: 'Authentication cancelled by user',
  WEBAUTHN_ERROR: 'WebAuthn operation failed',
  MISSING_DEVICE_NAME: 'Device name is required',
  MISSING_EMAIL: 'Email is required',
  LAST_PASSKEY_DELETE: 'Cannot delete last passkey',
  PASSKEY_ALREADY_EXISTS: 'A passkey with this name already exists',
  ORPHANED_PASSKEY_DETECTED: 'Found passkey in backend but not in browser. Cleaning up...',
  ORPHANED_PASSKEY_CLEANUP_FAILED: 'Failed to cleanup orphaned passkey',
  ORPHANED_PASSKEYS_LOGIN_WARNING:
    'Your browser does not have the passkeys that are registered in your account. This may happen if you cleared your browser data or switched devices.',
  CLEANUP_REQUIRES_AUTH:
    'Unable to automatically cleanup orphaned passkeys. Please contact support to reset your passkeys, or use a different browser/device where your passkeys are still available.',
  ORPHANED_PASSKEYS_MODAL: {
    TITLE: 'Authentication Failed',
    NOT_FOUND_MESSAGE:
      'No passkeys were found in your browser. This may happen if you cleared your browser data or switched devices.',
    NOT_FOUND_DESCRIPTION:
      'If you no longer have access to your passkeys, contact your administrator to restore access.',
    GENERAL_MESSAGE:
      'Unable to authenticate with your passkey. This may happen if you cancelled the authentication or if your passkey is no longer available.',
    GENERAL_DESCRIPTION:
      'You can try again. If you no longer have access to your passkeys, contact your administrator.',
    BUTTONS: {
      RETRY: 'Try Again',
      REMOVE: 'I lost my passkey',
      CANCEL: 'Cancel',
    },
  },
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Passkey registered successfully',
  LOGOUT_SUCCESS: 'You have been signed out.',
  PASSKEY_CREATED: 'Passkey created successfully',
  PASSKEY_UPDATED: 'Passkey updated successfully',
  PASSKEY_DELETED: 'Passkey deleted successfully',
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
  LOGOUT: {
    LOGS: {
      SERVER_ERROR: 'Server logout returned error; local session cleared regardless',
      PURGE_ERROR: 'Failed to purge locally persisted data on logout',
    },
    URL_TAG: 'auth/logout',
  },
} as const;
