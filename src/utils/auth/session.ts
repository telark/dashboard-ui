import { STORAGE_KEYS } from '../../constants/store/store';

export const getSessionToken = (): string | null => {
  try {
    return globalThis.localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  } catch {
    return null;
  }
};

export const setSessionToken = (token: string): void => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
  } catch {
    // Ignore persistence errors (e.g., localStorage quota exceeded)
  }
};

export const removeSessionToken = (): void => {
  try {
    globalThis.localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
  } catch {
    // Ignore removal errors
  }
};

export const hasSessionToken = (): boolean => {
  return getSessionToken() !== null;
};

