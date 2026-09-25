import { DEFAULT_COLORS } from '../../../constants';

export const PASSKEYS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Passkeys',
    HEADER_SUBTITLE: 'Manage your passkeys',
    NOT_FOUND: 'Passkey not found',
    CREATE_BUTTON: 'Register New Passkey',
    UPDATE_BUTTON: 'Update Passkey',
    CREATE_BUTTON_TEXT: 'Register Passkey',
    BREADCRUMBS: {
      PASSKEYS: 'Passkeys',
      EDIT: 'Edit',
      CREATE: 'Register Passkey',
    },
    EMPTY: {
      TITLE: 'No passkeys yet',
      DESCRIPTION: 'Add a passkey to sign in securely without a password.',
      BUTTON: 'Register New Passkey',
    },
    MESSAGES: {
      CREATED: (name: string) => `Passkey "${name}" registered successfully`,
      UPDATED: (name: string) => `Passkey "${name}" updated successfully`,
      DELETED: (name: string) => `Passkey "${name}" deleted successfully`,
    },
    COLUMNS: {
      DEVICE_NAME: 'Passkey Name',
      DEVICE_TYPE: 'Device Type',
      CREATED: 'Created',
      LAST_USED: 'Last Used',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
      DELETE: 'Delete',
    },
    DELETE_MODAL_TITLE: 'Delete Passkey',
    DELETE_MODAL_CONTENT: (name: string) =>
      `You are about to delete ${name} from your account. This will remove the passkey from our system and it will no longer be available for authentication.\n\nPlease note that this action will not remove the passkey from your browser's stored credentials. If you wish to remove it from your browser as well, you will need to do so manually through your browser settings. However, deleted passkeys will be automatically filtered out and will not appear during login.`,
    DELETE_MODAL_OK: 'Delete',
    FORCE_DELETE_MODAL_TITLE: 'Delete Last Passkey',
    FORCE_DELETE_MODAL_CONTENT: (name: string) =>
      `${name} is your last passkey. You will need to register a new passkey to regain access. Are you absolutely sure you want to proceed?`,
    FORCE_DELETE_MODAL_OK: 'Force Delete',
    DEVICE_TYPE_PLATFORM: 'Platform',
    DEVICE_TYPE_CROSS_PLATFORM: 'Cross-Platform',
    NEVER_USED: 'Never',
    PUBLIC_KEY: 'Public key',
    SHOW_PUBLIC_KEY: 'Show public key',
    HIDE_PUBLIC_KEY: 'Hide public key',
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
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      DEVICE_NAME: 150,
      DEVICE_TYPE: 120,
      CREATED: 140,
      LAST_USED: 140,
      ACTIONS: 50,
    },
  },
  COLORS: {
    HEADER_BG: '#fff',
    CHIP_PLATFORM_BG: '#0ea5e930',
    CHIP_PLATFORM_TEXT: '#0369a1',
    CHIP_CROSS_PLATFORM_BG: '#bbf7d080',
    CHIP_CROSS_PLATFORM_TEXT: '#047857',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    SORT_ACTIVE: '#0ea5e9',
    SORT_MUTED: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
  },
  VALUES: {
    DEVICE_TYPE_PLATFORM: 'platform',
    DEVICE_TYPE_CROSS_PLATFORM: 'cross-platform',
  },
  FORM: {
    TITLE: 'Register New Passkey',
    EDIT_TITLE: 'Edit Passkey',
    SECTION_TITLE: 'Device Information',
    BUTTON_TEXT: 'Register',
    EDIT_BUTTON_TEXT: 'Update',
    DEVICE_NAME_LABEL: 'Passkey Name',
    DEVICE_NAME_PLACEHOLDER: 'e.g. My Laptop, iPhone 13',
    DEVICE_NAME_REQUIRED: 'Device name is required',
    DEVICE_NAME_DUPLICATE: 'A passkey with this name already exists',
    SUGGESTIONS_TITLE: 'Suggestions',
    FIELDS: [
      {
        type: 'input',
        name: 'deviceName',
        label: 'Device Name',
        placeholder: 'e.g. My Laptop, iPhone 13',
        required: true,
        marginBottom: 18,
      },
    ],
    INITIAL_VALUES: {
      deviceName: '',
    },
    MODAL_WIDTH: 300,
    STYLES: {
      CARD_PADDING: 16,
      FORM_GAP: 18,
      FULL_WIDTH: '100%',
    },
  },
  ERRORS: {
    DEVICE_NAME_REQUIRED: 'Device name is required',
    INVALID_RESPONSE_STRUCTURE: 'Invalid response structure from server',
    AUTHENTICATOR_ALREADY_HAS_CREDENTIAL:
      'This device already has a passkey registered. Platform authenticators (Windows Hello, Touch ID, etc.) can only store one passkey per account. To add another passkey, please use a different device or a security key.',
    RETRY_WITHOUT_EXCLUDE:
      'Would you like to try creating a passkey without checking for duplicates? This may allow the authenticator to create a new credential, but there is a risk of duplicate credential IDs.',
  },
  LOGS: {
    FAILED_TO_LOAD_PASSKEYS: 'Failed to load passkeys:',
    FAILED_TO_LOAD_PASSKEY: 'Failed to load passkey:',
    MISSING_DEVICE_NAME: 'Passkey record missing deviceName:',
    FAILED_TO_CREATE_ENROLL_LINK: 'Failed to create enrollment link:',
  },
} as const;
