export const SECURITY_SECTION_CONSTANTS = {
  LABELS: {
    BREADCRUMBS: {
      SETTINGS: 'Settings',
      SECURITY: 'Security',
      PASSKEYS: 'Passkeys',
    },
    PASSKEYS_CARD_TITLE: 'Passkeys',
    PASSKEYS_CARD_DESCRIPTION:
      'Sign in with passkeys on this device and others. Add or remove them to manage how you sign in.',
    PASSKEYS_MANAGE_LINK: 'Manage passkeys',
    ACTIVE_SESSIONS_CARD_TITLE: 'Active sessions',
    ACTIVE_SESSIONS_CARD_DESCRIPTION:
      'Devices where you’re signed in. Revoke any session you don’t recognize.',
    ACTIVE_SESSIONS_EMPTY: 'No other active sessions.',
    ACTIVE_SESSIONS_HEADER_DEVICE: 'Device',
    ACTIVE_SESSIONS_HEADER_BROWSER: 'Browser',
    ACTIVE_SESSIONS_HEADER_CREATED: 'Created',
    ACTIVE_SESSIONS_HEADER_EXPIRES: 'Expires',
    SESSIONS_THIS_DEVICE: 'This device',
    SESSIONS_OTHER_SESSION: 'Other session',
    SESSIONS_EXPIRED: 'Expired',
    SESSIONS_REVOKE: 'Revoke',
    SESSIONS_LOADING: 'Loading sessions…',
    SESSIONS_ERROR: 'Failed to load sessions.',
    SESSIONS_REVOKE_SUCCESS: 'Session revoked.',
    SESSIONS_REVOKE_ERROR: 'Failed to revoke session.',
    REVOKE_CONFIRM_MODAL: {
      TITLE: 'Revoke session',
      MESSAGE_CURRENT:
        'Revoking this session signs you out on this device, and you will need to sign in again.',
      MESSAGE_OTHER:
        'Revoking this session signs that device out, and it will need to sign in again.',
      MESSAGE_UNKNOWN:
        'Revoking this session signs that device out. If it is the device you are using now, you will be signed out here.',
      OK: 'Revoke',
      CANCEL: 'Cancel',
    },
  },
} as const;
