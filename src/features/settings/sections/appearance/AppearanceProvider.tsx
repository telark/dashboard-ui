import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  APPEARANCE_SECTION_CONSTANTS,
  type DensityOption,
  type ThemeOption,
  type FontSizeOption,
} from './constants';

const { STORAGE_KEYS, DENSITY_VALUES, FONT_SIZE_CSS_VAR, FONT_SIZE_SCALES } =
  APPEARANCE_SECTION_CONSTANTS;

function resolveTheme(theme: ThemeOption): 'light' | 'dark' {
  if (theme === 'System' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme === 'Dark' ? 'dark' : 'light';
}

function getStored<K extends keyof typeof STORAGE_KEYS>(
  key: (typeof STORAGE_KEYS)[K],
  fallback: string,
): string {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

export interface AppearanceContextValue {
  theme: ThemeOption;
  setTheme: (option: ThemeOption) => void;
  density: DensityOption;
  setDensity: (option: DensityOption) => void;
  fontSize: FontSizeOption;
  setFontSize: (option: FontSizeOption) => void;
  rowHeight: number;
  contentGap: number;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export function useAppearance(): AppearanceContextValue {
  const value = useContext(AppearanceContext);
  if (value == null) {
    throw new Error('useAppearance must be used within AppearanceProvider');
  }
  return value;
}

interface AppearanceProviderProps {
  children: React.ReactNode;
}

export const AppearanceProvider: React.FC<AppearanceProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>(
    () => getStored(STORAGE_KEYS.THEME, 'Light') as ThemeOption,
  );
  const [density, setDensityState] = useState<DensityOption>(
    () => getStored(STORAGE_KEYS.DENSITY, 'Comfortable') as DensityOption,
  );
  const [fontSize, setFontSizeState] = useState<FontSizeOption>(
    () => getStored(STORAGE_KEYS.FONT_SIZE, 'Medium') as FontSizeOption,
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  const setTheme = useCallback((option: ThemeOption) => {
    setThemeState(option);
    localStorage.setItem(STORAGE_KEYS.THEME, option);
  }, []);

  const setDensity = useCallback((option: DensityOption) => {
    setDensityState(option);
    localStorage.setItem(STORAGE_KEYS.DENSITY, option);
  }, []);

  const setFontSize = useCallback((option: FontSizeOption) => {
    setFontSizeState(option);
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, option);
  }, []);

  const { rowHeight, contentGap } = DENSITY_VALUES[density];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = () => setSystemPrefersDark(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    if (theme === 'System') {
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', resolved);
    }
  }, [theme, systemPrefersDark]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      FONT_SIZE_CSS_VAR,
      String(FONT_SIZE_SCALES[fontSize]),
    );
  }, [fontSize]);

  const contextValue = useMemo<AppearanceContextValue>(
    () => ({
      theme,
      setTheme,
      density,
      setDensity,
      fontSize,
      setFontSize,
      rowHeight,
      contentGap,
    }),
    [theme, setTheme, density, setDensity, fontSize, setFontSize, rowHeight, contentGap],
  );

  return <AppearanceContext.Provider value={contextValue}>{children}</AppearanceContext.Provider>;
};
