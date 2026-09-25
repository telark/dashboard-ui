export const DEFAULT_COLORS = {
  SUCCESS: '#20C997',
  DANGER: '#FF4D4F',
  DEFAULT: '#999',
  WARNING: '#faad14',
  SWITCH_OFF: '#374151',
  PAGE_BG: '#111827',
  HOVER_BG: '#1f2937',
  // Text colors
  TEXT_PRIMARY: '#ffffff',
  TEXT_MUTED: '#9ca3af',
  TEXT_SECONDARY: '#d1d5db',
  // Background colors
  BACKGROUND_WHITE: '#111827',
  BACKGROUND_LIGHT: '#111827',
  BACKGROUND_HOVER: '#1f2937',
  // Border colors
  BORDER_DEFAULT: '#374151',
  BORDER_LIGHT: '#1f2937',
  BORDER_HOVER: '#4b5563',
  // Chip/Tag colors
  CHIP_BLUE_BG: '#1e3a8a',
  CHIP_BLUE_TEXT: '#bfdbfe',
  CHIP_CUSTOM_BG: '#1f2937',
  CHIP_CUSTOM_TEXT: '#d1d5db',
  // Icon colors
  ICON_MUTED: '#4b5563',
  ICON_SECONDARY: '#6b7280',
  ERROR: '#ef4444',
  // Elevated surfaces: one step above PAGE_BG so cards read as raised without
  // shadows, and still sit below CHIP_CUSTOM_BG used inside them.
  SUCCESS_TINT: 'rgba(32, 201, 151, 0.12)',
  DANGER_TINT: 'rgba(255, 77, 79, 0.12)',
  WARNING_TINT: 'rgba(250, 173, 20, 0.12)',
  DEFAULT_TINT: 'rgba(153, 153, 153, 0.12)',
  SURFACE_ELEVATED: '#161f2e',
  SURFACE_ELEVATED_HOVER: '#1c2738',
  BORDER_ELEVATED: '#2a3648',
  // Light surfaces (dropdown/popover panels reversed against the dark theme)
  SURFACE_WHITE: '#ffffff',
  SURFACE_HOVER: '#f1f5f9',
  SURFACE_BORDER: '#d9d9d9',
  SURFACE_BORDER_LIGHT: '#f0f0f0',
  TEXT_ON_SURFACE: '#111827',
  TEXT_ON_SURFACE_MUTED: '#64748b',
  TEXT_ON_SURFACE_DISABLED: '#94a3b8',
  /** Chips on light surfaces; CHIP_CUSTOM_* is the dark-theme counterpart. */
  CHIP_ON_SURFACE_BG: '#f1f5f9',
  CHIP_ON_SURFACE_TEXT: '#334155',
  PILL_TEXT: '#ffffff',
} as const;

// A pill is a solid case colour with white text. The accents themselves are too light
// for white text, so each case has a darker pill shade (white-text contrast in brackets).
const PILL_SUCCESS = '#047857'; // 5.48:1
const PILL_DANGER = '#dc2626'; // 4.83:1
const PILL_WARNING = '#b45309'; // 5.02:1
const PILL_INFO = '#2563eb'; // 5.17:1
const PILL_MUTED = '#6b7280'; // 4.83:1
const PILL_NEUTRAL = '#374151'; // 10.31:1

const PILL_CASES: Record<string, string> = {
  [DEFAULT_COLORS.SUCCESS]: PILL_SUCCESS,
  [DEFAULT_COLORS.DANGER]: PILL_DANGER,
  [DEFAULT_COLORS.ERROR]: PILL_DANGER,
  [DEFAULT_COLORS.WARNING]: PILL_WARNING,
  [DEFAULT_COLORS.CHIP_BLUE_TEXT]: PILL_INFO,
  [DEFAULT_COLORS.DEFAULT]: PILL_MUTED,
  [DEFAULT_COLORS.TEXT_MUTED]: PILL_MUTED,
};

const resolvePillBackground = (accent?: string): string =>
  (accent && PILL_CASES[accent]) || PILL_NEUTRAL;

/** Pill background for a case accent; no accent means a neutral pill. */
export const getPillSurface = (accent?: string): { background: string } => ({
  background: resolvePillBackground(accent),
});

/** Quick-filter pill: selected = the accent's pill colour, idle = neutral. */
export const getQuickFilterPillColors = (
  accent: string,
  active: boolean,
): { background: string; border: string; color: string } => ({
  background: active ? resolvePillBackground(accent) : PILL_NEUTRAL,
  border: '1px solid transparent',
  color: DEFAULT_COLORS.PILL_TEXT,
});
