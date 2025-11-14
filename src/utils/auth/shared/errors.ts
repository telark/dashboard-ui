import { App as AntdApp } from 'antd';
import { AxiosError } from 'axios';
import { AUTH_ERROR_MESSAGES } from '../../../constants/auth';
import { HTTP_STATUS } from '../../../constants';
import { LOGIN_CONSTANTS } from '../../../constants/pages/login';
import logger from '../../../logging';

interface ExtendedAxiosError extends AxiosError {
  normalized?: {
    status: number | null;
    message: string;
    isNotFound: boolean;
    isClient: boolean;
    isServer: boolean;
    isNetwork: boolean;
    isTimeout: boolean;
  };
}

interface ErrorHandlingOptions {
  onUserNotFound?: () => void;
  onNoPasskeys?: () => void;
  customMessage?: string;
}

type MessageApi = ReturnType<typeof AntdApp.useApp>['message'];

const extractErrorMessage = (error: any): string => {
  const axiosError = error as ExtendedAxiosError;

  if (axiosError.normalized?.message) {
    return String(axiosError.normalized.message);
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

const isUserNotFoundError = (error: any, errorMsg?: string): boolean => {
  const msg = errorMsg || extractErrorMessage(error);
  const axiosError = error as ExtendedAxiosError;
  const normalized = axiosError.normalized;

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

const isNoPasskeysError = (error: any, errorMsg?: string): boolean => {
  const msg = errorMsg || extractErrorMessage(error);
  return checkErrorPattern(msg, LOGIN_CONSTANTS.ERROR_PATTERNS.NO_PASSKEYS);
};

const getUserFriendlyErrorMessage = (error: any): string => {
  const errorMsg = extractErrorMessage(error);

  if (isUserNotFoundError(error, errorMsg)) {
    return LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND;
  }

  if (isNoPasskeysError(error, errorMsg)) {
    return LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS;
  }

  const axiosError = error as ExtendedAxiosError;
  const normalized = axiosError.normalized;
  const lowerMsg = errorMsg.toLowerCase();

  if (error?.isNetwork || normalized?.isNetwork) {
    return LOGIN_CONSTANTS.MESSAGES.NETWORK_ERROR;
  }

  if (error?.isTimeout || normalized?.isTimeout) {
    return LOGIN_CONSTANTS.MESSAGES.TIMEOUT_ERROR;
  }

  if (error?.isServer || normalized?.isServer) {
    return checkErrorPattern(lowerMsg, LOGIN_CONSTANTS.ERROR_PATTERNS.USER_NOT_FOUND)
      ? LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND
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

export const handleAuthError = (
  error: any,
  messageApi: MessageApi,
  options?: ErrorHandlingOptions,
): void => {
  const { onUserNotFound, onNoPasskeys, customMessage } = options || {};

  if (customMessage) {
    showErrorMessage(messageApi, customMessage);
    return;
  }

  const errorMsg = extractErrorMessage(error);

  if (isNoPasskeysError(error, errorMsg)) {
    showErrorMessage(messageApi, LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS, onNoPasskeys);
    return;
  }

  if (isUserNotFoundError(error, errorMsg)) {
    showErrorMessage(messageApi, LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND, onUserNotFound);
    return;
  }

  const friendlyMessage = getUserFriendlyErrorMessage(error);
  showErrorMessage(messageApi, friendlyMessage);
  logger.error(LOGIN_CONSTANTS.LOGS.AUTH_ERROR, error);
};

