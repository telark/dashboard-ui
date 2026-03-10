const STORAGE_KEY_PREFIX = 'appearance';

export const APPEARANCE_SECTION_CONSTANTS = {
  STORAGE_KEYS: {
    THEME: `${STORAGE_KEY_PREFIX}-theme`,
    DENSITY: `${STORAGE_KEY_PREFIX}-density`,
    FONT_SIZE: `${STORAGE_KEY_PREFIX}-font-size`,
  },
  LAYOUT: {
    /** Match Ant Design middle/small primary button size. */
    OPTION_BUTTON_HEIGHT: 32,
    OPTION_BUTTON_BORDER_RADIUS: 6,
    OPTION_BUTTON_PADDING: '4px 15px',
    OPTION_BUTTON_GAP: 8,
  },
  /** CSS variable set on document.documentElement for font scaling. */
  FONT_SIZE_CSS_VAR: '--app-font-size-scale',
  LABELS: {
    THEME_CARD_TITLE: 'Theme',
    THEME_CARD_DESCRIPTION:
      'Choose how the dashboard looks. System follows your device preference.',
    DENSITY_CARD_TITLE: 'Density',
    DENSITY_CARD_DESCRIPTION: 'Compact or comfortable spacing for lists and tables.',
    FONT_SIZE_CARD_TITLE: 'Font size',
    FONT_SIZE_CARD_DESCRIPTION: 'Base text size for the interface.',
    OPTION_LIGHT: 'Light',
    OPTION_DARK: 'Dark',
    OPTION_SYSTEM: 'System',
    DENSITY_COMFORTABLE: 'Comfortable (default)',
    DENSITY_COMPACT: 'Compact',
    DENSITY_LIVE_EXAMPLE_LABEL: 'Live preview',
    DENSITY_PREVIEW_HEADER_NAME: 'Name',
    DENSITY_PREVIEW_HEADER_ROLE: 'Role',
    FONT_SIZE_SMALL: 'Small',
    FONT_SIZE_MEDIUM: 'Medium (default)',
    FONT_SIZE_LARGE: 'Large',
  },
  THEME_OPTIONS: ['Light', 'Dark', 'System'] as const,
  DENSITY_OPTIONS: ['Comfortable', 'Compact'] as const,
  /** Short names, 2 rows so both densities fit inside fixed box without clipping. */
  DENSITY_PREVIEW_SAMPLES: {
    names: ['Alex M.', 'Jordan L.'],
    roles: ['Admin', 'Editor'],
  } as const,
  /** Row height (px) and content gap (px) per density; used by tables and page layout. */
  DENSITY_VALUES: {
    Comfortable: { rowHeight: 44, contentGap: 32 },
    Compact: { rowHeight: 36, contentGap: 24 },
  } as const,
  /** Fixed size for both preview boxes: same width and height. */
  DENSITY_PREVIEW_BOX: {
    WIDTH: 144,
    HEIGHT: 160,
  } as const,
  FONT_SIZE_OPTIONS: ['Small', 'Medium', 'Large'] as const,
  /** Font scale values for --app-font-size-scale (e.g. 0.9, 1, 1.1). */
  FONT_SIZE_SCALES: { Small: 0.9375, Medium: 1, Large: 1.0625 } as const,
} as const;

export type ThemeOption = (typeof APPEARANCE_SECTION_CONSTANTS.THEME_OPTIONS)[number];
export type DensityOption = (typeof APPEARANCE_SECTION_CONSTANTS.DENSITY_OPTIONS)[number];
export type FontSizeOption = (typeof APPEARANCE_SECTION_CONSTANTS.FONT_SIZE_OPTIONS)[number];
