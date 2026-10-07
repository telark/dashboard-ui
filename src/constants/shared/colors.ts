// Hand-mirrored copies that cannot import this file: index.html theme-color and its inline --color-page-bg, public/manifest.json (PAGE_BG), public/telark-*.svg (PAGE_BG, SUCCESS, TEXT_PRIMARY).
export const DEFAULT_COLORS = {
  // Status accents; SUCCESS is also the brand primary.
  SUCCESS: '#20C997',
  DANGER: '#E05252',
  WARNING: '#E2A336',
  INFO: '#bfdbfe',
  INFO_STRONG: '#2563eb', // info blue that reads on white (5.17:1)
  NEUTRAL: '#999',
  // Brand primary interaction states.
  SUCCESS_HOVER: '#1db584',
  SUCCESS_ACTIVE: '#1aa572',
  // Status tints (accent at low alpha) and the primary focus ring.
  SUCCESS_TINT: 'rgba(32, 201, 151, 0.12)',
  DANGER_TINT: 'rgba(224, 82, 82, 0.12)',
  WARNING_TINT: 'rgba(226, 163, 54, 0.12)',
  NEUTRAL_TINT: 'rgba(153, 153, 153, 0.12)',
  SUCCESS_RING: 'rgba(32, 201, 151, 0.2)',
  // Dark surfaces: the page, then elevated cards one step above it so they read as raised
  // without shadows and still sit below CHIP_CUSTOM_BG used inside them.
  PAGE_BG: '#111827',
  HOVER_BG: '#1f2937',
  SURFACE_ELEVATED: '#161f2e',
  SURFACE_ELEVATED_HOVER: '#1c2738',
  // Text on dark surfaces.
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#d1d5db',
  TEXT_MUTED: '#9ca3af',
  TEXT_DISABLED: '#6b7280',
  // Borders on dark surfaces; BORDER_SUBTLE is darker than BORDER_DEFAULT.
  BORDER_DEFAULT: '#374151',
  BORDER_SUBTLE: '#1f2937',
  BORDER_HOVER: '#4b5563',
  BORDER_ELEVATED: '#2a3648',
  // Icons on dark surfaces.
  ICON_MUTED: '#4b5563',
  ICON_SECONDARY: '#6b7280',
  // Chips on dark surfaces; CHIP_ON_SURFACE_* is the light counterpart.
  INFO_BG: '#1e3a8a',
  CHIP_CUSTOM_BG: '#1f2937',
  // Light surfaces: panels, modals, dropdowns, popovers.
  SURFACE_WHITE: '#ffffff',
  SURFACE_SUBTLE: '#f8fafc',
  SURFACE_HOVER: '#f1f5f9',
  SURFACE_BORDER: '#d9d9d9',
  SURFACE_BORDER_LIGHT: '#f0f0f0',
  TEXT_ON_SURFACE: '#111827',
  TEXT_ON_SURFACE_MUTED: '#64748b',
  TEXT_ON_SURFACE_DISABLED: '#94a3b8',
  CHIP_ON_SURFACE_BG: '#f1f5f9',
  CHIP_ON_SURFACE_TEXT: '#334155',
  // Text and glyphs on a solid accent (pills, primary buttons, badges).
  PILL_TEXT: '#ffffff',
  // Overlays, shadows (vary alpha with withAlpha) and text selection.
  OVERLAY_BACKDROP: 'rgba(0, 0, 0, 0.45)',
  SHADOW: 'rgba(0, 0, 0, 0.08)',
  SELECTION_BG: 'rgba(148, 163, 184, 0.35)',
  // Auth pages: their own slate palette with a light and a dark theme.
  AUTH_LIGHT_BG: '#f8fafc',
  AUTH_LIGHT_CARD_BG: '#ffffff',
  AUTH_LIGHT_BORDER: '#e2e8f0',
  AUTH_LIGHT_TEXT: '#0b1f33',
  AUTH_LIGHT_TEXT_MUTED: '#64748b',
  AUTH_LIGHT_DIVIDER: '#f1f5f9',
  AUTH_DARK_BG: '#020617',
  AUTH_DARK_CARD_BG: '#0f172a',
  AUTH_DARK_BORDER: '#1e293b',
  AUTH_DARK_TEXT: '#f8fafc',
  AUTH_DARK_TEXT_MUTED: '#94a3b8',
  // YAML syntax highlighting in the manifest viewer (VS Code Dark+).
  IDE_SYNTAX_TEXT: '#d4d4d4',
  IDE_SYNTAX_KEY: '#9cdcfe',
  IDE_SYNTAX_STRING: '#ce9178',
  IDE_SYNTAX_NUMBER: '#b5cea8',
  IDE_SYNTAX_KEYWORD: '#569cd6',
  IDE_SYNTAX_COMMENT: '#6a9955',
  IDE_SYNTAX_COPY_BUTTON: '#c8c8c8',
} as const;

// Fixed by Google's sign-in branding guidelines, so deliberately outside the theme.
export const GOOGLE_BRAND_COLORS = {
  BLUE: '#4285F4',
  GREEN: '#34A853',
  YELLOW: '#FBBC05',
  RED: '#EA4335',
  BUTTON_BG: '#ffffff',
  BUTTON_BORDER: '#dadce0',
  BUTTON_TEXT: '#3c4043',
} as const;

const HEX_SHORT_LENGTH = 4;

const rgbChannels = (color: string): string => {
  if (!color.startsWith('#')) return (color.match(/\d+/g) ?? []).slice(0, 3).join(', ');
  const hex =
    color.length === HEX_SHORT_LENGTH
      ? [...color.slice(1)].map((c) => c + c).join('')
      : color.slice(1, 7);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ');
};

/** A token at another opacity, so alpha variants never become new literals. */
export const withAlpha = (color: string, alpha: number): string =>
  `rgba(${rgbChannels(color)}, ${alpha})`;

/** CSS can't import this file: every token is exposed as `--color-<kebab-key>` on :root. */
export const applyColorVariables = (root: HTMLElement = document.documentElement): void => {
  Object.entries(DEFAULT_COLORS).forEach(([key, value]) =>
    root.style.setProperty(`--color-${key.toLowerCase().replace(/_/g, '-')}`, value),
  );
};

interface PillSurface {
  background: string;
  color: string;
}

// A pill is the declared case color itself with white text (user decision, 2026-10-01).
// INFO is too light for a solid fill, so its pill uses the declared INFO_STRONG.
const PILL_NEUTRAL = '#374151';

const PILL_CASES: Record<string, string> = {
  [DEFAULT_COLORS.SUCCESS]: DEFAULT_COLORS.SUCCESS,
  [DEFAULT_COLORS.DANGER]: DEFAULT_COLORS.DANGER,
  [DEFAULT_COLORS.WARNING]: DEFAULT_COLORS.WARNING,
  [DEFAULT_COLORS.INFO]: DEFAULT_COLORS.INFO_STRONG,
  [DEFAULT_COLORS.NEUTRAL]: DEFAULT_COLORS.NEUTRAL,
  [DEFAULT_COLORS.TEXT_MUTED]: DEFAULT_COLORS.TEXT_MUTED,
};

/** Pill background for a case accent (an antd `Tag` color); no accent means the neutral pill. */
export const getPillColor = (accent?: string): string =>
  (accent && PILL_CASES[accent]) || PILL_NEUTRAL;

/** Pill background and text color for a case accent; no accent means a neutral pill. */
export const getPillSurface = (accent?: string): PillSurface => ({
  background: getPillColor(accent),
  color: DEFAULT_COLORS.PILL_TEXT,
});

/** Quick-filter pill: selected = the accent's pill, idle = neutral. */
export const getQuickFilterPillColors = (
  accent: string,
  active: boolean,
): PillSurface & { border: string } => ({
  ...getPillSurface(active ? accent : undefined),
  border: '1px solid transparent',
});
