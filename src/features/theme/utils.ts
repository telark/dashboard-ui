import { applyColorVariables, PAGE_COLORS, type PageTheme } from '../../constants';
import { getCurrentUser } from '../auth/utils/session/user';
import {
  DEFAULT_THEME_PREFERENCE,
  SYSTEM_LIGHT_QUERY,
  THEME_PREFERENCES,
  type ThemePreference,
} from './constants';

// The user record (settings.theme) owns the choice. Its stored copy gives the first paint,
// before any request answers.
export const readUserThemePreference = (): ThemePreference =>
  THEME_PREFERENCES.find((preference) => preference === getCurrentUser()?.settings?.theme) ??
  DEFAULT_THEME_PREFERENCE;

export const resolveTheme = (preference: ThemePreference, systemIsLight: boolean): PageTheme => {
  if (preference !== 'system') return preference;
  return systemIsLight ? 'light' : 'dark';
};

export const applyPageTheme = (pageTheme: PageTheme): void => {
  applyColorVariables(pageTheme);
  document.documentElement.dataset.theme = pageTheme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', PAGE_COLORS[pageTheme].PAGE_BG);
};

/** For the entry point: the store rehydrates later, and the page may paint before it does. */
export const applyStoredTheme = (): void => {
  const systemIsLight = globalThis.matchMedia(SYSTEM_LIGHT_QUERY).matches;
  applyPageTheme(resolveTheme(readUserThemePreference(), systemIsLight));
};
