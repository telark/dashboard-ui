import { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_KEYS, type PageTheme } from '../../constants';
import { useMediaQuery } from '../../hooks/layout';
import { CURRENT_USER_UPDATED_EVENT } from '../auth/utils/session/user';
import { SYSTEM_LIGHT_QUERY } from './constants';
import { selectThemePreference, setThemePreference } from './store';
import { applyPageTheme, readUserThemePreference, resolveTheme } from './utils';

export const useResolvedTheme = (): PageTheme => {
  const preference = useSelector(selectThemePreference);
  const systemIsLight = useMediaQuery(SYSTEM_LIGHT_QUERY);
  return resolveTheme(preference, systemIsLight);
};

/** For the app root only: applies the theme before paint and follows the stored user, here and in other tabs. */
export const useAppliedTheme = (): PageTheme => {
  const pageTheme = useResolvedTheme();
  const dispatch = useDispatch();

  useLayoutEffect(() => applyPageTheme(pageTheme), [pageTheme]);

  useEffect(() => {
    const followUser = () => {
      dispatch(setThemePreference(readUserThemePreference()));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEYS.CURRENT_USER) followUser();
    };
    globalThis.addEventListener(CURRENT_USER_UPDATED_EVENT, followUser);
    globalThis.addEventListener('storage', onStorage);
    return () => {
      globalThis.removeEventListener(CURRENT_USER_UPDATED_EVENT, followUser);
      globalThis.removeEventListener('storage', onStorage);
    };
  }, [dispatch]);

  return pageTheme;
};
