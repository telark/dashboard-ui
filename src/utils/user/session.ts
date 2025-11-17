import { STORAGE_KEYS } from '../../constants/store/store';
import { USER_CONSTANTS } from '../../constants/user/user';
import { isDevelopment } from '../helpers/env';
import logger from '../../logging';
import type { User as AuthUser } from '../../interfaces/auth/credentials';

export const getCurrentUser = (): AuthUser | null => {
  try {
    const userStr = globalThis.localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userStr) {
      return JSON.parse(userStr) as AuthUser;
    }
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_CONSTANTS.LOGS.GET_CURRENT_USER_ERROR, error);
    }
  }
  return null;
};

export const setCurrentUser = (user: AuthUser): void => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_CONSTANTS.LOGS.SET_CURRENT_USER_ERROR, error);
    }
    // Don't throw - allow login to continue even if storage fails
  }
};

export const removeCurrentUser = (): void => {
  try {
    globalThis.localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    if (isDevelopment()) {
      logger.error(USER_CONSTANTS.LOGS.REMOVE_CURRENT_USER_ERROR, error);
    }
  }
};

export const getAuthUser = (): AuthUser | null => {
  return getCurrentUser();
};
