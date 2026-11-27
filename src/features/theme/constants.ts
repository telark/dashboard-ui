// public/theme-init.js mirrors the stored values, the default and this query.
export const THEME_PREFERENCES = ['dark', 'light', 'system'] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export const DEFAULT_THEME_PREFERENCE: ThemePreference = 'dark';
export const SYSTEM_LIGHT_QUERY = '(prefers-color-scheme: light)';

export const THEME_TEXTS = {
  SAVE_ERROR: 'Failed to update the theme',
} as const;
