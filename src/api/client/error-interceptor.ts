import type { AxiosError, AxiosResponse } from 'axios';
import {
  ACCOUNT_SUSPENDED_EVENT,
  AUTH_REFUSAL_CODES,
  ERROR_MESSAGES,
  HEADER_VALUES,
  HTTP_HEADERS,
  HTTP_STATUS,
} from '../../constants';
import { ErrorInterceptorOptions } from '../../interfaces/http';
import logger from '../../logging';
import {
  type ExtendedAxiosError,
  type NormalizedAxiosErrorMeta,
  normalizeError,
} from './normalize';

type FulfilledHandler = (response: AxiosResponse) => AxiosResponse;
type RejectedHandler = (error: AxiosError) => Promise<AxiosResponse | AxiosError>;

const logApiFault = (meta: NormalizedAxiosErrorMeta): void => {
  if (meta.isForbidden) {
    logger.warn(ERROR_MESSAGES.API.FORBIDDEN_WARNING, meta);
  } else if (meta.isNotFound) {
    logger.warn(ERROR_MESSAGES.API.NOT_FOUND_WARNING, meta);
  } else if (meta.isNetwork) {
    logger.error(ERROR_MESSAGES.API.NETWORK_ERROR, meta);
  } else if (meta.isTimeout) {
    logger.error(ERROR_MESSAGES.API.TIMEOUT_ERROR, meta);
  } else {
    logger.error(ERROR_MESSAGES.API.GENERIC_ERROR, meta);
  }
};

export const createErrorInterceptor = (
  options: ErrorInterceptorOptions = {},
): readonly [FulfilledHandler, RejectedHandler] => {
  const { silent404 = false } = options;

  const onSuccess: FulfilledHandler = (response) => response;

  const onError: RejectedHandler = (error) => {
    const meta = normalizeError(error);
    (error as ExtendedAxiosError).normalized = meta;

    const isSilent404 =
      silent404 &&
      meta.isNotFound &&
      error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_404] === HEADER_VALUES.SILENT_404;
    const isSilentNetwork =
      meta.isNetwork &&
      error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_NETWORK] === HEADER_VALUES.SILENT_NETWORK;

    // A silenced 404 resolves as an empty response, so the caller reads "nothing there".
    // isNotFound reads the response's status, so the response is always there.
    if (isSilent404) return Promise.resolve({ ...(error.response as AxiosResponse), data: null });
    if (isSilentNetwork) {
      return Promise.reject(error);
    }
    // A rejected session is the caller's to react to, not something to log as
    // an API fault: it is the normal end of every session.
    const isSessionExpired = meta.status === HTTP_STATUS.GONE || meta.isUnauthenticated;
    if (isSessionExpired) {
      return Promise.reject(error);
    }
    // A suspension ends the session too: the app opens its modal instead of logging a fault.
    if (meta.isForbidden && meta.code === AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED) {
      globalThis.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
      return Promise.reject(error);
    }
    logApiFault(meta);
    return Promise.reject(error);
  };

  return [onSuccess, onError] as const;
};
