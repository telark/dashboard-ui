import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { APPEARANCE_SECTION_CONSTANTS, type ThemeOption } from './constants';
import { updateUser } from '../../../access-and-permissions/users/clients';
import {
  CURRENT_USER_UPDATED_EVENT,
  getCurrentUser,
  setCurrentUser,
} from '../../../auth/utils/session/user';
import type { User } from '../../../access-and-permissions/users/models';
import logger from '../../../../logging';

const { DEFAULT_THEME, THEME_OPTIONS } = APPEARANCE_SECTION_CONSTANTS;

const toThemeOption = (value?: string): ThemeOption =>
  THEME_OPTIONS.find((option) => option === value) ?? DEFAULT_THEME;

export interface AppearanceContextValue {
  theme: ThemeOption;
  setTheme: (option: ThemeOption) => void;
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
  const [theme, setThemeState] = useState<ThemeOption>(() =>
    toThemeOption(getCurrentUser()?.settings?.theme),
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () =>
      typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  const setTheme = useCallback((option: ThemeOption) => {
    setThemeState(option);
    const user = getCurrentUser();
    if (!user?.id) return;
    updateUser(user.id, { settings: { ...user.settings, theme: option } })
      .then((response) => {
        if (response?.data) setCurrentUser(response.data);
      })
      .catch((error) => logger.error(error));
  }, []);

  useEffect(() => {
    const handleUserUpdated = (e: Event) => {
      setThemeState(toThemeOption((e as CustomEvent<User>).detail?.settings?.theme));
    };
    globalThis.addEventListener(CURRENT_USER_UPDATED_EVENT, handleUserUpdated);
    return () => globalThis.removeEventListener(CURRENT_USER_UPDATED_EVENT, handleUserUpdated);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = () => setSystemPrefersDark(mq.matches);
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    const resolved = theme === 'Dark' ? 'dark' : 'light';
    const dataTheme = theme === 'System' && systemPrefersDark ? 'dark' : resolved;
    document.documentElement.setAttribute('data-theme', dataTheme);
  }, [theme, systemPrefersDark]);

  const contextValue = useMemo<AppearanceContextValue>(
    () => ({ theme, setTheme }),
    [theme, setTheme],
  );

  return <AppearanceContext.Provider value={contextValue}>{children}</AppearanceContext.Provider>;
};
