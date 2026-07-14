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
} as const;
