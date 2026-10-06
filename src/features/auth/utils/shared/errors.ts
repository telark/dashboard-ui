import { App as AntdApp } from 'antd';
import type { NormalizedAxiosErrorMeta } from '../../../../api/client/normalize';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { AUTH_REFUSAL_CODES, ERROR_MESSAGES, HTTP_STATUS } from '../../../../constants';
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

  return (
    normalized?.code === AUTH_REFUSAL_CODES.USER_NOT_FOUND ||
    normalized?.isNotFound ||
    normalized?.status === HTTP_STATUS.NOT_FOUND ||
    error?.status === HTTP_STATUS.NOT_FOUND ||
    error?.isNotFound ||
    error?.response?.status === HTTP_STATUS.NOT_FOUND
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

const clientErrorMessage = (errorMsg: string): string =>
  errorMsg && errorMsg !== ERROR_MESSAGES.API.UNKNOWN_ERROR
    ? errorMsg
    : LOGIN_CONSTANTS.MESSAGES.CLIENT_ERROR;

// A login the backend refuses for this account (403) or for its email (409, Google sign-in),
// which the login card explains inline.
export const getLoginRefusalMessage = (input: unknown): string | null => {
  const error = input as AuthErrorShape;
  if (!error?.normalized?.isForbidden && error?.normalized?.status !== HTTP_STATUS.CONFLICT) {
    return null;
  }
  const code = error.normalized?.code;
  if (code === AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED) {
    return LOGIN_CONSTANTS.MESSAGES.ACCOUNT_SUSPENDED;
  }
  if (code === AUTH_REFUSAL_CODES.BOOTSTRAP_PASSKEY_ONLY) {
    return LOGIN_CONSTANTS.MESSAGES.BOOTSTRAP_PASSKEY_ONLY;
  }
  // Auth's Google sign-in 409s carry no code.
  const errorMsg = extractErrorMessage(error);
  if (checkErrorPattern(errorMsg, LOGIN_CONSTANTS.ERROR_PATTERNS.EMAIL_SIGNS_IN_ANOTHER_WAY)) {
    return LOGIN_CONSTANTS.MESSAGES.EMAIL_SIGNS_IN_ANOTHER_WAY;
  }
  if (checkErrorPattern(errorMsg, LOGIN_CONSTANTS.ERROR_PATTERNS.EMAIL_AMBIGUOUS)) {
    return LOGIN_CONSTANTS.MESSAGES.EMAIL_AMBIGUOUS;
  }
  return null;
};

export const getUserFriendlyErrorMessage = (input: unknown): string => {
  const error = input as AuthErrorShape;
  const errorMsg = extractErrorMessage(error);
  const refusal = getLoginRefusalMessage(error);

  if (refusal) {
    return refusal;
  }

  if (isUserNotFoundError(error, errorMsg)) {
    return userNotFoundMessage();
  }

  if (isNoPasskeysError(error, errorMsg)) {
    return LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS;
  }

  const normalized = error.normalized;

  if (error?.isNetwork || normalized?.isNetwork) {
    return LOGIN_CONSTANTS.MESSAGES.NETWORK_ERROR;
  }

  if (error?.isTimeout || normalized?.isTimeout) {
    return LOGIN_CONSTANTS.MESSAGES.TIMEOUT_ERROR;
  }

  if (error?.isServer || normalized?.isServer) {
    return LOGIN_CONSTANTS.MESSAGES.SERVER_ERROR;
  }

  if (error?.isClient || normalized?.isClient) {
    return clientErrorMessage(errorMsg);
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
