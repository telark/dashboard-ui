export const PASSKEYS_PAGE_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Passkeys',
    HEADER_SUBTITLE: 'Manage your passkeys',
    VIEW_SUBTITLE: 'View passkey details',
    EDIT_SUBTITLE: 'Edit passkey details',
    CREATE_SUBTITLE: 'Register a new passkey',
    NOT_FOUND: 'Passkey not found',
    CREATE_BUTTON: 'Add Passkey',
    UPDATE_BUTTON: 'Update Passkey',
    CREATE_BUTTON_TEXT: 'Register Passkey',
    BREADCRUMBS: {
      PASSKEYS: 'Passkeys',
      EDIT: 'Edit',
      CREATE: 'Register Passkey',
    },
    MESSAGES: {
      CREATED: (name: string) => `Passkey "${name}" registered successfully`,
      UPDATED: (name: string) => `Passkey "${name}" updated successfully`,
      DELETED: (name: string) => `Passkey "${name}" deleted successfully`,
    },
    COLUMNS: {
      DEVICE_NAME: 'Device Name',
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
    DELETE_MODAL_CONTENT: (name: string) => `Are you sure you want to delete "${name}"? This action cannot be undone.`,
    DELETE_MODAL_OK: 'Delete',
    FORCE_DELETE_MODAL_TITLE: 'Delete Last Passkey',
    FORCE_DELETE_MODAL_CONTENT: (name: string) =>
      `Warning: "${name}" is your last passkey. Deleting it will lock you out of your account. You will need to contact support to regain access. Are you absolutely sure you want to proceed?`,
    FORCE_DELETE_MODAL_OK: 'Force Delete',
    DEVICE_TYPE_PLATFORM: 'Platform',
    DEVICE_TYPE_CROSS_PLATFORM: 'Cross-Platform',
    NEVER_USED: 'Never',
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
    TEXT_MUTED: '#64748b',
    SORT_ACTIVE: '#0ea5e9',
    SORT_MUTED: '#94a3b8',
  },
  VALUES: {
    DEVICE_TYPE_PLATFORM: 'platform',
    DEVICE_TYPE_CROSS_PLATFORM: 'cross-platform',
  },
  FORM: {
    TITLE: 'Register Passkey',
    SUBTITLE: 'Create a new passkey for your account',
    SECTION_TITLE: 'Device Information',
    SECTION_SUBTITLE: 'Provide a name for this device',
    BUTTON_TEXT: 'Register Passkey',
    DEVICE_NAME_LABEL: 'Device Name',
    DEVICE_NAME_PLACEHOLDER: 'e.g. My Laptop, iPhone 13',
    DEVICE_NAME_REQUIRED: 'Device name is required',
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
    MODAL_WIDTH: 360,
  },
} as const;

export type PasskeysPageConstants = typeof PASSKEYS_PAGE_CONSTANTS;

export type PasskeyDeviceType = 'platform' | 'cross-platform';

