export type SettingsSectionKey =
  | 'profile'
  | 'appearance'
  | 'timezone'
  | 'security'
  | 'aiInsights'
  | 'discovery'
  | 'storage'
  | 'identityProvider'
  | 'myPermissions'
  | 'about';

export interface SettingsSectionConfig {
  key: SettingsSectionKey;
  label: string;
  description: string;
  badge?: string;
}

export const SETTINGS_CONSTANTS = {
  SECTIONS: {
    PROFILE: {
      key: 'profile' as const,
      label: 'Profile',
      description: 'Your personal information',
    },
    APPEARANCE: {
      key: 'appearance' as const,
      label: 'Appearance',
      description: 'Theme options',
    },
    TIMEZONE: {
      key: 'timezone' as const,
      label: 'Timezone',
      description: 'Time zone and region used to display dates and times.',
    },
    SECURITY: {
      key: 'security' as const,
      label: 'Security',
      description: 'Passkeys and active sessions',
    },
    AI_INSIGHTS: {
      key: 'aiInsights' as const,
      label: 'Insights',
      description: 'On by default. Choose the local model and when incident analysis runs.',
      badge: 'Experimental',
    },
    DISCOVERY: {
      key: 'discovery' as const,
      label: 'Discovery',
      description: 'Choose the namespaces discovery skips.',
    },
    STORAGE: {
      key: 'storage' as const,
      label: 'Storage',
      description: 'Snapshot and report volume usage.',
    },
    IDENTITY_PROVIDER: {
      key: 'identityProvider' as const,
      label: 'Authentication',
      description: 'Choose how users sign in: Google sign-in and passkey self-registration.',
    },
    MY_PERMISSIONS: {
      key: 'myPermissions' as const,
      label: 'My Permissions',
      description: 'Your effective permissions resolved across all assigned roles.',
    },
    ABOUT: {
      key: 'about' as const,
      label: 'About',
      description: 'Version, documentation, and third-party licenses.',
    },
  },
  CONTENT: {
    MAX_WIDTH: 640,
    CARD_BORDER_RADIUS: 8,
    CARD_PADDING: 20,
    // Below this a header action wraps under the title instead of squeezing it.
    CARD_TITLE_MIN_WIDTH_PX: 120,
    CARD_TITLE_TO_DESCRIPTION_GAP_PX: -4,
    SECTION_TITLE_FONT_SIZE: 20,
    HINT_FONT_SIZE: 12,
    CARD_TITLE_FONT_SIZE: 15,
    CARD_DESCRIPTION_FONT_SIZE: 13,
    /** Label/value lists (runtime status, model details, storage figures). */
    DETAILS_COLUMN_GAP: 12,
    DETAILS_ROW_GAP: 2,
    GAP_BETWEEN_CARDS: 20,
  },
  TOOLBAR: {
    SAVE_KEY: 'save',
  },
} as const;

export const SETTINGS_SECTIONS_LIST: SettingsSectionConfig[] = [
  SETTINGS_CONSTANTS.SECTIONS.PROFILE,
  SETTINGS_CONSTANTS.SECTIONS.APPEARANCE,
  SETTINGS_CONSTANTS.SECTIONS.TIMEZONE,
  SETTINGS_CONSTANTS.SECTIONS.MY_PERMISSIONS,
  SETTINGS_CONSTANTS.SECTIONS.SECURITY,
  SETTINGS_CONSTANTS.SECTIONS.AI_INSIGHTS,
  SETTINGS_CONSTANTS.SECTIONS.DISCOVERY,
  SETTINGS_CONSTANTS.SECTIONS.STORAGE,
  SETTINGS_CONSTANTS.SECTIONS.IDENTITY_PROVIDER,
  SETTINGS_CONSTANTS.SECTIONS.ABOUT,
];
