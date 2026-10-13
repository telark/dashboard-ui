export const IDENTITY_PROVIDER_CONSTANTS = {
  LABELS: {
    CARD_TITLE: 'Google sign-in',
    CARD_DESCRIPTION:
      'Let people sign in with their Google account. Changes apply at the next sign-in.',
    ENABLE_LABEL: 'Enable Google sign-in',
    CLIENT_ID_LABEL: 'Google OAuth client ID',
    CLIENT_ID_PLACEHOLDER: '123456789012-abc.apps.googleusercontent.com',
    CLIENT_ID_REDACTED: '***',
    EGRESS_LABEL: "Fetch Google's signing keys automatically",
    EGRESS_HINT:
      "When on, this cluster downloads Google's signing keys. When off (a cluster without internet access), paste them below.",
    JWK_LABEL: 'Google signing keys (JWK set)',
    JWK_PLACEHOLDER: 'Paste the current key set ({"keys":[...]})',
    JWK_SOURCE_HINT: "Copy Google's current keys from",
    JWK_SOURCE_HINT_END: '.',
    JWK_KEEP_HINT: 'Leave it empty to keep the pinned keys.',
    SAVE_BUTTON: 'Save',
    PERMISSION_DENIED: 'You do not have permission to change sign-in settings',
    BOOTSTRAP_ONLY: 'Only the bootstrap account can change how people sign in',
    SELF_REGISTRATION_TITLE: 'Self-registration',
    SELF_REGISTRATION_LABEL: 'Allow self-registration',
    SELF_REGISTRATION_HINT:
      'Anyone who reaches the login page can create a ReadOnly account with a passkey.',
  },
  SETUP: {
    CLIENT_TITLE: 'Google OAuth client',
    CLIENT_HINT_START: 'Create a "Web application" OAuth client in the',
    CONSOLE_LINK: 'Google Cloud console',
    CLIENT_HINT_END: ', add the redirect URI below, then paste the client ID.',
    GUIDE_LINK: 'Setup guide',
    REDIRECT_URI_LABEL: 'Authorized redirect URI',
    REDIRECT_URI_INFO: 'Add this address under "Authorized redirect URIs" on the OAuth client.',
    COPY_LABEL: 'Copy redirect URI',
    KEYS_TITLE: 'Signing keys',
  },
  MESSAGES: {
    SAVE_SUCCESS: 'Google sign-in settings saved',
    SAVE_FAILED: 'Failed to save Google sign-in settings',
    SELF_REGISTRATION_SAVED: 'Self-registration saved',
    SELF_REGISTRATION_SAVE_FAILED: 'Failed to save self-registration',
    CLIENT_ID_REQUIRED: 'A Google OAuth client ID is required when Google sign-in is enabled',
    TRUST_SOURCE_REQUIRED: 'Either allow fetching signing keys, or paste a key set to pin',
    JWK_INVALID: 'The key set must be valid JSON',
    REDIRECT_URI_COPIED: 'Redirect URI copied',
    REDIRECT_URI_COPY_FAILED: 'Could not copy the redirect URI',
  },
  LINKS: {
    JWKS_URL: 'https://www.googleapis.com/oauth2/v3/certs',
    CONSOLE_URL: 'https://console.cloud.google.com/apis/credentials',
    GUIDE_URL:
      'https://developers.google.com/identity/openid-connect/openid-connect#getcredentials',
  },
  LAYOUT: {
    FIELD_GAP: 12,
    ROW_GAP: 10,
    JWK_ROWS: 6,
  },
} as const;
