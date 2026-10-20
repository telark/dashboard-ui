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
};

export const AUTH_ERROR_MESSAGES = {
  FETCH_PASSKEYS_FAILED: 'Failed to fetch passkeys',
  CREATE_PASSKEY_FAILED: 'Failed to create passkey',
  UPDATE_PASSKEY_FAILED: 'Failed to update passkey',
  DELETE_PASSKEY_FAILED: 'Failed to delete passkey',
  AUTHENTICATION_FAILED: 'Authentication failed',
  LOGOUT_FAILED: "Couldn't sign you out. Try again.",
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
      'Select Try Again to use a passkey on another device or in a password manager. Lost your passkey? Ask your administrator for a new enrollment link. If you are the only administrator, run the break-glass enroll command from the install notes.',
    GENERAL_MESSAGE:
      'Could not sign in with your passkey. This can happen if you canceled the prompt or the passkey is no longer available.',
    GENERAL_DESCRIPTION:
      'Select Try Again and confirm the passkey prompt. Lost your passkey? Ask your administrator for a new enrollment link. If you are the only administrator, run the break-glass enroll command from the install notes.',
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
      NOT_SIGNED_IN_ERROR: 'Not signed in',
      FETCH_ERROR: 'Failed to fetch session details',
      VALIDATION_ERROR: 'Session validation error',
      UNKNOWN_ERROR: 'Unknown error during session validation',
      INVALID_TIMESTAMP_ERROR: 'Invalid timestamp format',
    },
    EXPIRATION: {
      MODAL: {
        TITLE: 'Session Expired',
        MESSAGE: 'Your session has expired. Sign in again to continue.',
        DUPLICATE_COOKIE_MESSAGE:
          "Your browser has two Telark session cookies. Clear this site's cookies, then sign in again.",
        BUTTON_TEXT: 'Go to Login',
      },
      LOGS: {
        DELETE_FAILED: 'Failed to end the session on the server:',
        HANDLE_LOGIN_ERROR: 'Error in handleGoToLogin:',
      },
    },
    SUSPENDED: {
      MODAL: {
        TITLE: 'Your account is suspended',
        MESSAGE:
          "An administrator has suspended your Telark account, so this session can't continue. If you think this is a mistake, contact your administrator.",
        BUTTON_TEXT: 'Sign out',
      },
    },
  },
  LOGOUT: {
    LOGS: {
      SERVER_ERROR: 'Server logout failed, so this browser stays signed in',
      PURGE_ERROR: 'Failed to purge locally persisted data on logout',
    },
  },
} as const;
