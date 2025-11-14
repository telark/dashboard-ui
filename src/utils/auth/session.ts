import { STORAGE_KEYS } from '../../constants/store/store';
import { LOGIN_CONSTANTS } from '../../constants/pages/login';
import { isDevelopment } from '../helpers/env';
import logger from '../../logging';
import { removeCurrentUser } from '../user/session';

export const getSessionToken = (): string | null => {
  try {
    return globalThis.localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
  } catch (error) {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.SESSION_GET_ERROR, error);
    }
    return null;
  }
};

export const setSessionToken = (token: string): void => {
  try {
    globalThis.localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, token);
  } catch (error) {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.SESSION_SET_ERROR, error);
    }

    const errorMessage =
      error instanceof DOMException && error.name === 'QuotaExceededError'
        ? LOGIN_CONSTANTS.SESSION.QUOTA_EXCEEDED
        : LOGIN_CONSTANTS.SESSION.SET_FAILED;

    throw new Error(errorMessage);
  }
};

export const removeSessionToken = (): void => {
  try {
    globalThis.localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
    removeCurrentUser();
  } catch (error) {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.SESSION_REMOVE_ERROR, error);
    }

    throw new Error(LOGIN_CONSTANTS.SESSION.REMOVE_FAILED);
  }
};

export const hasSessionToken = (): boolean => {
  return getSessionToken() !== null;
};
