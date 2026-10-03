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
    EMAIL_LOCKED_HINT: "This email comes from your enrollment link and can't be changed",
    ENROLL_TITLE: 'Add a passkey on this device',
    ENROLL_SUBTITLE: 'Confirm your email and name this device to finish enrollment',
    ENROLL_LINK_INVALID:
      'This enrollment link is invalid, expired or already used. Ask an administrator for a new one.',
  },
  QUERY: {
    ENROLL: 'enroll',
    EMAIL: 'email',
  },
  ENROLL_STORAGE_KEY: 'telark:register:enroll',
} as const;
