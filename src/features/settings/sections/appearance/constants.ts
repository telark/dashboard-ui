export const APPEARANCE_SECTION_CONSTANTS = {
  LAYOUT: {
    /** Match Ant Design middle/small primary button size. */
    OPTION_BUTTON_HEIGHT: 32,
    OPTION_BUTTON_BORDER_RADIUS: 6,
    OPTION_BUTTON_PADDING: '4px 15px',
    OPTION_BUTTON_GAP: 8,
  },
  LABELS: {
    THEME_CARD_TITLE: 'Theme',
    THEME_CARD_DESCRIPTION:
      'Choose how the dashboard looks. System preference support coming soon.',
    DENSITY_CARD_TITLE: 'Density',
    DENSITY_CARD_DESCRIPTION: 'Compact or comfortable spacing for lists and tables.',
    OPTION_LIGHT: 'Light',
    OPTION_DARK: 'Dark',
    OPTION_SYSTEM: 'System',
    DENSITY_COMFORTABLE: 'Comfortable (default)',
    DENSITY_COMPACT: 'Compact',
  },
  THEME_OPTIONS: ['Light', 'Dark', 'System'] as const,
  DENSITY_OPTIONS: ['Comfortable', 'Compact'] as const,
} as const;

export type ThemeOption = (typeof APPEARANCE_SECTION_CONSTANTS.THEME_OPTIONS)[number];
export type DensityOption = (typeof APPEARANCE_SECTION_CONSTANTS.DENSITY_OPTIONS)[number];
