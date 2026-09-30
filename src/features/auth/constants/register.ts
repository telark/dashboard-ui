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
      'Self-registration is disabled on this instance. Please contact your administrator to request an account.',
    BACK_TO_LOGIN: 'Back to login',
    ENROLL_TITLE: 'Add a passkey on this device',
    ENROLL_SUBTITLE: 'Confirm your email and name this device to finish enrollment',
  },
  QUERY: {
    ENROLL: 'enroll',
  },
  ENROLL_STORAGE_KEY: 'telark:register:enroll',
} as const;
