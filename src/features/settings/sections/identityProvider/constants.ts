import { DEFAULT_COLORS } from '../../../../constants';

export const IDENTITY_PROVIDER_CONSTANTS = {
  LABELS: {
    CARD_TITLE: 'Single Sign-On',
    CARD_DESCRIPTION:
      'Let users sign in with an external identity provider. Changes take effect on the next sign-in.',
    ENABLE_LABEL: 'Enable single sign-on',
    CLIENT_ID_LABEL: 'Client ID',
    CLIENT_ID_PLACEHOLDER: 'Client ID issued by the provider',
    EGRESS_LABEL: 'Fetch signing keys from the provider',
    EGRESS_HINT:
      'On, this cluster reaches the provider to fetch its signing keys. Off, paste the key set below.',
    JWK_LABEL: 'Pinned signing keys (JWK set)',
    JWK_PLACEHOLDER: '{"keys":[...]}',
    SAVE_BUTTON: 'Save',
    PERMISSION_DENIED: 'You do not have permission to change sign-on settings',
    NO_VIEW_PERMISSION: 'You do not have permission to manage sign-on settings.',
  },
  MESSAGES: {
    SAVE_SUCCESS: 'Sign-on settings saved',
    SAVE_FAILED: 'Failed to save sign-on settings',
    CLIENT_ID_REQUIRED: 'A client ID is required when single sign-on is enabled',
    TRUST_SOURCE_REQUIRED: 'Either allow fetching signing keys, or paste a key set to pin',
    JWK_INVALID: 'The key set must be valid JSON',
  },
  LAYOUT: {
    FIELD_GAP: 12,
    ROW_GAP: 10,
    JWK_ROWS: 6,
  },
  COLORS: {
    ERROR_TEXT: DEFAULT_COLORS.ERROR,
  },
} as const;
