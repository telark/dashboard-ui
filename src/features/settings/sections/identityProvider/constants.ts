import { DEFAULT_COLORS } from '../../../../constants';

export const IDENTITY_PROVIDER_CONSTANTS = {
  LABELS: {
    CARD_TITLE: 'Single Sign-On',
    CARD_DESCRIPTION:
      'Let users sign in with an external identity provider. Changes take effect on the next sign-in.',
    ENABLE_LABEL: 'Enable single sign-on',
    CLIENT_ID_LABEL: 'Client ID',
    CLIENT_ID_PLACEHOLDER: 'Client ID issued by the provider',
    CLIENT_ID_REDACTED: '***',
    EGRESS_LABEL: 'Fetch signing keys from the provider',
    EGRESS_HINT:
      'On, this cluster reaches the provider to fetch its signing keys. Off, paste the key set below.',
    JWK_LABEL: 'Pinned signing keys (JWK set)',
    JWK_PLACEHOLDER: 'Paste the current key set ({"keys":[...]})',
    JWK_SOURCE_HINT: "Copy the provider's current keys from",
    JWK_SOURCE_HINT_END: '.',
    JWK_KEEP_HINT: 'Leave it empty to keep the pinned keys.',
    SAVE_BUTTON: 'Save',
    PERMISSION_DENIED: 'You do not have permission to change sign-on settings',
    BOOTSTRAP_ONLY: 'Only the bootstrap account can change how people sign in',
    SELF_REGISTRATION_TITLE: 'Self-registration',
    SELF_REGISTRATION_LABEL: 'Allow self-registration',
    SELF_REGISTRATION_HINT:
      'Anyone who reaches the login page can create a ReadOnly account with a passkey.',
  },
  MESSAGES: {
    SAVE_SUCCESS: 'Sign-on settings saved',
    SAVE_FAILED: 'Failed to save sign-on settings',
    SELF_REGISTRATION_SAVED: 'Self-registration saved',
    SELF_REGISTRATION_SAVE_FAILED: 'Failed to save self-registration',
    CLIENT_ID_REQUIRED: 'A client ID is required when single sign-on is enabled',
    TRUST_SOURCE_REQUIRED: 'Either allow fetching signing keys, or paste a key set to pin',
    JWK_INVALID: 'The key set must be valid JSON',
  },
  LINKS: {
    JWKS_URL: 'https://www.googleapis.com/oauth2/v3/certs',
  },
  LAYOUT: {
    FIELD_GAP: 12,
    ROW_GAP: 10,
    JWK_ROWS: 6,
  },
  COLORS: {
    ERROR_TEXT: DEFAULT_COLORS.DANGER,
  },
} as const;
