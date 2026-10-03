import { DEFAULT_COLORS } from '../../../constants';

export const PASSKEYS_CONSTANTS = {
  LABELS: {
    CREATE_BUTTON: 'Register New Passkey',
    EMPTY: {
      TITLE: 'No passkeys yet',
      DESCRIPTION: 'Register a passkey to sign in securely without a password.',
      BUTTON: 'Register New Passkey',
    },
    MESSAGES: {
      CREATED: (name: string) => `Passkey "${name}" registered successfully`,
      UPDATED: (name: string) => `Passkey "${name}" updated successfully`,
      DELETED: (name: string) => `Passkey "${name}" deleted successfully`,
    },
    COLUMNS: {
      CREATED: 'Created',
      LAST_USED: 'Last Used',
    },
    ACTIONS: {
      EDIT: 'Edit',
      DELETE: 'Delete',
    },
    DELETE_MODAL_TITLE: 'Delete Passkey',
    DELETE_MODAL_CONTENT: (name: string) =>
      `Deleting ${name} removes it from your account, so it can no longer be used to sign in.\n\nIt stays in your browser's stored credentials until you remove it in your browser settings, but deleted passkeys are filtered out and do not appear at sign-in.`,
    DELETE_MODAL_OK: 'Delete',
    FORCE_DELETE_MODAL_TITLE: 'Delete Last Passkey',
    FORCE_DELETE_MODAL_CONTENT: (name: string) =>
      `${name} is your last passkey. You will need to register a new passkey to regain access. Delete it anyway?`,
    FORCE_DELETE_MODAL_OK: 'Force Delete',
    DEVICE_TYPE_PLATFORM: 'Platform',
    DEVICE_TYPE_CROSS_PLATFORM: 'Cross-Platform',
    NEVER_USED: 'Never',
    PUBLIC_KEY: 'Public key',
    PUBLIC_KEY_UNAVAILABLE: 'Not available',
    COPY_PUBLIC_KEY: 'Copy to clipboard',
    COPIED: 'Copied',
  },
  TOOLBAR: {
    SEARCH_PLACEHOLDER: 'Search passkeys by name...',
    SEARCH_BUTTON_LABEL: 'Search',
  },
  ENROLL: {
    BUTTON: 'Add on another device',
    MODAL_TITLE: 'Add a passkey on another device or host',
    MODAL_DESCRIPTION:
      'Open this link in the browser where you want the new passkey, then register it there. The link works once and expires in 10 minutes.',
    COPY: 'Copy link',
    COPIED: 'Link copied',
    COPY_FAILED: 'Failed to copy link',
    CREATE_FAILED: 'Failed to create enrollment link',
  },
  KEYS: {
    DEVICE_NAME: 'deviceName',
    DEVICE_TYPE: 'deviceType',
    CREATED_AT: 'creationTimestamp',
    LAST_USED_AT: 'lastUsedTimestamp',
  } as const,
  SIZES: {
    CHIP_FONT: 12,
  },
  COLORS: {
    TEXT_PRIMARY: DEFAULT_COLORS.TEXT_ON_SURFACE,
    TEXT_MUTED: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  VALUES: {
    DEVICE_TYPE_PLATFORM: 'platform',
  },
  FORM: {
    TITLE: 'Register New Passkey',
    EDIT_TITLE: 'Edit Passkey',
    BUTTON_TEXT: 'Register',
    EDIT_BUTTON_TEXT: 'Update',
    DEVICE_NAME_LABEL: 'Passkey Name',
    DEVICE_NAME_PLACEHOLDER: 'e.g. My Laptop, iPhone 13',
    DEVICE_NAME_REQUIRED: 'Device name is required',
    DEVICE_NAME_DUPLICATE: 'A passkey with this name already exists',
    SUGGESTIONS_TITLE: 'Suggestions',
    INITIAL_VALUES: {
      deviceName: '',
    },
    MODAL_WIDTH: 300,
  },
  ERRORS: {
    DEVICE_NAME_REQUIRED: 'Device name is required',
  },
  LOGS: {
    FAILED_TO_LOAD_PASSKEYS: 'Failed to load passkeys:',
    MISSING_DEVICE_NAME: 'Passkey record missing deviceName:',
    FAILED_TO_CREATE_ENROLL_LINK: 'Failed to create enrollment link:',
  },
} as const;
