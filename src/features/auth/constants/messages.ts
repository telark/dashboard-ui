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
  EFFECTIVE_PERMISSIONS_TITLE: 'Effective Permissions',
  ALL_SCOPES_TITLE: 'All Scopes',
  DENY_PREFIX: 'Deny: ',
  EMPTY_VALUE: '—',
};

export const AUTH_ERROR_MESSAGES = {
  FETCH_PASSKEYS_FAILED: 'Failed to fetch passkeys',
  CREATE_PASSKEY_FAILED: 'Failed to create passkey',
  UPDATE_PASSKEY_FAILED: 'Failed to update passkey',
  DELETE_PASSKEY_FAILED: 'Failed to delete passkey',
  AUTHENTICATION_FAILED: 'Authentication failed',
  PASSKEYS_INSECURE_CONTEXT: {
    TITLE: 'Passkeys need a secure connection',
    DESCRIPTION:
      'Browsers only allow passkeys on https:// pages or on http://localhost. Ask your administrator to enable TLS on the ingress or load balancer, then open the dashboard over https://.',
    TAG: 'HTTPS required',
  },
  MISSING_DEVICE_NAME: 'Device name is required',
  MISSING_EMAIL: 'Email is required',
  PASSKEY_ALREADY_EXISTS: 'A passkey with this name already exists',
  ORPHANED_PASSKEY_CLEANUP_FAILED: 'Failed to cleanup orphaned passkey',
  ORPHANED_PASSKEYS_MODAL: {
    TITLE: 'Authentication Failed',
    NOT_FOUND_MESSAGE:
      'No passkeys were found in this browser. This can happen after you clear browser data or switch devices.',
    NOT_FOUND_DESCRIPTION:
      'If you no longer have access to your passkeys, contact your administrator to restore access.',
    GENERAL_MESSAGE:
      'Could not sign in with your passkey. This can happen if you canceled the prompt or the passkey is no longer available.',
    GENERAL_DESCRIPTION:
      'You can try again. If you no longer have access to your passkeys, contact your administrator.',
    BUTTONS: {
      RETRY: 'Try Again',
      REMOVE: 'I lost my passkey',
    },
  },
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Passkey registered successfully',
  LOGOUT_SUCCESS: 'You have been signed out.',
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
        MESSAGE: 'Your session has expired. Sign in again to continue.',
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
