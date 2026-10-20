export const REGISTER_CONSTANTS = {
  UI: {
    TITLE: 'Create Passkey',
    SUBTITLE: 'Register a new passkey for your account',
    EMAIL_PLACEHOLDER: 'name@company.com',
    DEVICE_NAME_PLACEHOLDER: 'My Laptop',
    DEVICE_NAME_LABEL: 'Device Name',
    EMAIL_LABEL: 'Email',
    BUTTON_LOADING: 'Registering...',
    BUTTON_TEXT: 'Register Passkey',
    FOOTER_TEXT: 'Already have an account?',
    FOOTER_LINK: 'Login',
    DISABLED_TITLE: 'Registration disabled',
    DISABLED_MESSAGE:
      'Self-registration is disabled on this instance. Ask your administrator for an account.',
    BACK_TO_LOGIN: 'Back to login',
    EMAIL_LOCKED_HINT: 'From your enrollment link',
    ENROLL_TITLE: 'Add a passkey on this device',
    ENROLL_SUBTITLE:
      'Name this device, then confirm with your fingerprint, face or screen lock. Finish in this tab.',
    ENROLL_SIGNED_IN: 'You are signed in. Sign out to use this enrollment link on this device.',
    SIGN_OUT: 'Sign out',
    BACK_TO_DASHBOARD: 'Back to the dashboard',
    ENROLL_LINK_INVALID:
      'This enrollment link is invalid, expired or already used. Ask an administrator for a new one.',
    ENROLL_RETRY:
      'Your passkey was not saved. Select Register Passkey to try again. This link works until a passkey is saved with it or it expires.',
  },
  // Auth's message for a refused link (ErrEnrollTokenInvalid), at register start and at the finish.
  ERROR_PATTERNS: {
    ENROLL_LINK_REFUSED: 'invalid or expired enrollment token',
  },
  QUERY: {
    ENROLL: 'enroll',
    EMAIL: 'email',
  },
  ENROLL_STORAGE_KEY: 'telark:register:enroll',
} as const;
