import { useCallback, useEffect, useLayoutEffect } from 'react';
import { App as AntdApp } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { STORAGE_KEYS, type PageTheme } from '../../constants';
import { useMediaQuery } from '../../hooks/layout';
import { fetchUserById, updateUser } from '../access-and-permissions/users/clients';
import {
  CURRENT_USER_UPDATED_EVENT,
  getCurrentUser,
  setCurrentUser,
} from '../auth/utils/session/user';
import { SYSTEM_LIGHT_QUERY, THEME_TEXTS, type ThemePreference } from './constants';
import { selectThemePreference, setThemePreference } from './store';
import { applyPageTheme, readUserThemePreference, resolveTheme } from './utils';

// One count for every theme control, so a quick second choice wins wherever it was made.
let latestSave = 0;
// Saves run one at a time, so the server applies them in the order they were made.
let saveQueue: Promise<void> = Promise.resolve();
// Mid-save, a user stored by another fetch still holds the old theme, so the page ignores it.
let pendingSaves = 0;

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
      if (pendingSaves === 0) dispatch(setThemePreference(readUserThemePreference()));
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

// The server replaces settings whole, so the save starts from a fresh record. Every answer is
// stored, so a newer save that fails rolls back to what the server holds.
const saveThemeSetting = async (
  userId: string,
  theme: ThemePreference,
  isLatest: () => boolean,
): Promise<void> => {
  if (!isLatest()) return; // Overtaken while it waited: the newer choice makes its own save.
  const fresh = (await fetchUserById(userId, true)).data;
  if (!fresh) throw new Error(THEME_TEXTS.SAVE_ERROR);
  const saved = (await updateUser(userId, { settings: { ...fresh.settings, theme } })).data;
  if (!saved) throw new Error(THEME_TEXTS.SAVE_ERROR);
  setCurrentUser(saved);
};

/** Applies a theme choice at once and saves it on the user record, rolling back if that fails. */
export const useSaveThemePreference = (): ((theme: ThemePreference) => void) => {
  const { message } = AntdApp.useApp();
  const dispatch = useDispatch();

  return useCallback(
    (theme: ThemePreference) => {
      const userId = getCurrentUser()?.id;
      if (!userId) return;
      latestSave += 1;
      const save = latestSave;
      const isLatest = () => save === latestSave;
      dispatch(setThemePreference(theme));
      pendingSaves += 1;
      saveQueue = saveQueue
        .then(() => saveThemeSetting(userId, theme, isLatest))
        .catch(() => {
          if (!isLatest()) return;
          dispatch(setThemePreference(readUserThemePreference()));
          message.error(THEME_TEXTS.SAVE_ERROR);
        })
        .finally(() => {
          pendingSaves -= 1;
        });
    },
    [dispatch, message],
  );
};
