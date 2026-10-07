export const APPEARANCE_SECTION_CONSTANTS = {
  DEFAULT_THEME: 'Light',
  LABELS: {
    THEME_CARD_TITLE: 'Theme',
    THEME_CARD_DESCRIPTION:
      'Choose how the dashboard looks. System follows your device preference.',
    OPTION_LIGHT: 'Light',
    OPTION_DARK: 'Dark',
    OPTION_SYSTEM: 'System',
    COMING_SOON: 'Coming soon',
  },
  THEME_OPTIONS: ['Light', 'Dark', 'System'] as const,
} as const;

export type ThemeOption = (typeof APPEARANCE_SECTION_CONSTANTS.THEME_OPTIONS)[number];
