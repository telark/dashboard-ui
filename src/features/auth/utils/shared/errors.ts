import { App as AntdApp } from 'antd';
import type { NormalizedAxiosErrorMeta } from '../../../../api/client/normalize';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { HTTP_STATUS } from '../../../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { selectSelfRegistrationEnabled } from '../../store';
import store from '../../../../store';
import logger from '../../../../logging';

interface AuthErrorShape {
  message?: string;
  status?: number;
  isNotFound?: boolean;
  isClient?: boolean;
  isServer?: boolean;
  isNetwork?: boolean;
  isTimeout?: boolean;
  response?: { status?: number; data?: { message?: string } };
  normalized?: NormalizedAxiosErrorMeta;
}

interface ErrorHandlingOptions {
  onUserNotFound?: () => void;
  customMessage?: string;
}

type MessageApi = ReturnType<typeof AntdApp.useApp>['message'];

const extractErrorMessage = (error: AuthErrorShape): string => {
  if (error.normalized?.message) {
    return String(error.normalized.message);
  }

  if (error?.message && typeof error === 'object' && 'status' in error && !error.response) {
    return String(error.message);
  }

  return String(
    error?.response?.data?.message || error?.message || AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED,
  );
};

const checkErrorPattern = (errorMsg: string, patterns: readonly string[]): boolean => {
  const lowerMsg = errorMsg.toLowerCase();
  return patterns.some((pattern) => lowerMsg.includes(pattern));
};

const isUserNotFoundError = (error: AuthErrorShape, errorMsg?: string): boolean => {
  const msg = errorMsg || extractErrorMessage(error);
  const normalized = error.normalized;

  if (isNoPasskeysError(error, msg)) {
    return false;
  }

  if (
    normalized?.isNotFound ||
    normalized?.status === HTTP_STATUS.NOT_FOUND ||
    error?.status === HTTP_STATUS.NOT_FOUND ||
    error?.isNotFound
  ) {
    return true;
  }

  if (
    normalized?.isServer ||
    error?.isServer ||
    error?.status === HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    return checkErrorPattern(msg, LOGIN_CONSTANTS.ERROR_PATTERNS.USER_NOT_FOUND);
  }

  return (
    error?.response?.status === HTTP_STATUS.NOT_FOUND ||
    checkErrorPattern(msg, LOGIN_CONSTANTS.ERROR_PATTERNS.USER_NOT_FOUND)
  );
};

const isNoPasskeysError = (error: AuthErrorShape, errorMsg?: string): boolean => {
  const msg = errorMsg || extractErrorMessage(error);
  return checkErrorPattern(msg, LOGIN_CONSTANTS.ERROR_PATTERNS.NO_PASSKEYS);
};

const userNotFoundMessage = (): string =>
  selectSelfRegistrationEnabled(store.getState())
    ? LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND
    : LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND_NO_SELF_REGISTRATION;

export const getUserFriendlyErrorMessage = (input: unknown): string => {
  const error = input as AuthErrorShape;
  const errorMsg = extractErrorMessage(error);

  if (isUserNotFoundError(error, errorMsg)) {
    return userNotFoundMessage();
  }

  if (isNoPasskeysError(error, errorMsg)) {
    return LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS;
  }

  const normalized = error.normalized;
  const lowerMsg = errorMsg.toLowerCase();

  if (error?.isNetwork || normalized?.isNetwork) {
    return LOGIN_CONSTANTS.MESSAGES.NETWORK_ERROR;
  }

  if (error?.isTimeout || normalized?.isTimeout) {
    return LOGIN_CONSTANTS.MESSAGES.TIMEOUT_ERROR;
  }

  if (error?.isServer || normalized?.isServer) {
    return checkErrorPattern(lowerMsg, LOGIN_CONSTANTS.ERROR_PATTERNS.USER_NOT_FOUND)
      ? userNotFoundMessage()
      : LOGIN_CONSTANTS.MESSAGES.SERVER_ERROR;
  }

  if (error?.isClient || normalized?.isClient) {
    return errorMsg && errorMsg !== 'Unknown error'
      ? errorMsg
      : LOGIN_CONSTANTS.MESSAGES.CLIENT_ERROR;
  }

  return errorMsg || AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED;
};

const showErrorMessage = (messageApi: MessageApi, content: string, callback?: () => void): void => {
  messageApi.open({
    type: 'error',
    content,
    duration: LOGIN_CONSTANTS.TIMING.MESSAGE_DURATION,
  });

  if (callback) {
    setTimeout(callback, LOGIN_CONSTANTS.TIMING.CALLBACK_DELAY);
  }
};

const showInfoMessage = (messageApi: MessageApi, content: string): void => {
  messageApi.open({
    type: 'info',
    content,
    duration: LOGIN_CONSTANTS.TIMING.MESSAGE_DURATION,
  });
};

export const handleAuthError = (
  error: unknown,
  messageApi: MessageApi,
  options?: ErrorHandlingOptions,
): void => {
  const { onUserNotFound, customMessage } = options || {};

  if (customMessage) {
    showErrorMessage(messageApi, customMessage);
    return;
  }

  const authError = error as AuthErrorShape;
  const errorMsg = extractErrorMessage(authError);

  if (isNoPasskeysError(authError, errorMsg)) {
    showInfoMessage(messageApi, LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS);
    return;
  }

  if (isUserNotFoundError(authError, errorMsg)) {
    showErrorMessage(messageApi, userNotFoundMessage(), onUserNotFound);
    return;
  }

  const friendlyMessage = getUserFriendlyErrorMessage(authError);
  showErrorMessage(messageApi, friendlyMessage);
  logger.error(LOGIN_CONSTANTS.LOGS.AUTH_ERROR, error);
};
