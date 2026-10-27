import { STORAGE_KEYS } from '../../../../constants/store/store';
import { USER_ERROR_MESSAGES } from '../../../../features/access-and-permissions/users/constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import type { User } from '../../../../features/access-and-permissions/users/models';

export const getCurrentUser = (): User | null => {
  try {
    const userStr = globalThis.localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userStr) {
      return JSON.parse(userStr) as User;
    }
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_ERROR_MESSAGES.LOGS.GET_CURRENT_USER_ERROR, error);
    }
  }
  return null;
};

export const CURRENT_USER_UPDATED_EVENT = 'currentUserUpdated';

// False when the browser refused to store it: a sign-in then fails, since the stored user is what "signed in" means.
export const setCurrentUser = (user: User): boolean => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    if (typeof globalThis.dispatchEvent === 'function') {
      globalThis.dispatchEvent(new CustomEvent(CURRENT_USER_UPDATED_EVENT, { detail: user }));
    }
    return true;
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_ERROR_MESSAGES.LOGS.SET_CURRENT_USER_ERROR, error);
    }
    return false;
  }
};

export const removeCurrentUser = (): void => {
  try {
    globalThis.localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_ERROR_MESSAGES.LOGS.REMOVE_CURRENT_USER_ERROR, error);
    }
  }
};
