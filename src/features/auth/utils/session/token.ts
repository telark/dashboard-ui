import type { InternalAxiosRequestConfig } from 'axios';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AUTH_CONFIG, AUTH_CONSTANTS } from '../../constants';
import { HTTP_HEADERS } from '../../../../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { removeCurrentUser } from './user';

const INVALID_TOKEN_VALUES = new Set(['undefined', 'null', '']);

export const getSessionToken = (): string | null => {
  try {
    const token = globalThis.localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN);
    if (token === null || INVALID_TOKEN_VALUES.has(token)) {
      if (token !== null) {
        globalThis.localStorage.removeItem(STORAGE_KEYS.SESSION_TOKEN);
      }
      return null;
    }
    return token;
  } catch (error) {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.SESSION_GET_ERROR, error);
    }
    return null;
  }
};

export const setSessionToken = (token: string): void => {
  if (!token || INVALID_TOKEN_VALUES.has(token)) {
    throw new Error(LOGIN_CONSTANTS.SESSION.SET_FAILED);
  }
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

const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');

// The API never hands back a session's token, so a session is identified by its
// resource name: the prefixed SHA-256 digest of that token. Deriving it locally
// is the only way to tell which listed session belongs to this device.
// Returns null outside a secure context, where crypto.subtle is undefined —
// callers must treat that as "unknown", never as "not this device".
export const getCurrentSessionName = async (): Promise<string | null> => {
  const token = getSessionToken();
  if (!token) {
    return null;
  }
  try {
    const digest = await globalThis.crypto.subtle.digest(
      AUTH_CONFIG.SESSION.NAME_DIGEST_ALGORITHM,
      new TextEncoder().encode(token),
    );
    return `${AUTH_CONFIG.SESSION.NAME_PREFIX}${toHex(digest)}`;
  } catch (error) {
    if (isDevelopment()) {
      logger.error(LOGIN_CONSTANTS.LOGS.SESSION_NAME_ERROR, error);
    }
    return null;
  }
};

export const createSessionTokenInterceptor = () => {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.url?.includes(AUTH_CONSTANTS.LOGOUT.URL_TAG)) {
      return config;
    }
    if (config.headers?.[HTTP_HEADERS.CUSTOM.SESSION_TOKEN]) {
      return config;
    }
    const sessionToken = getSessionToken();
    if (sessionToken && config.headers) {
      config.headers[HTTP_HEADERS.CUSTOM.SESSION_TOKEN] = sessionToken;
    }
    return config;
  };
};
