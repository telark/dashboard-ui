import type { AxiosError } from 'axios';
import { ERROR_CODES, ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

export interface NormalizedAxiosErrorMeta {
  status: number | null;
  message: string;
  url: string;
  method: string;
  isNotFound: boolean;
  isUnauthenticated: boolean;
  isForbidden: boolean;
  isClient: boolean;
  isServer: boolean;
  isNetwork: boolean;
  isTimeout: boolean;
}

export interface ExtendedAxiosError extends AxiosError {
  normalized?: NormalizedAxiosErrorMeta;
}

interface ServerErrorPayload {
  message?: string;
}

const readDataMessage = (data: AxiosError['response']): string | undefined => {
  const payload = data?.data as ServerErrorPayload | undefined;
  return payload && typeof payload === 'object' && typeof payload.message === 'string'
    ? payload.message
    : undefined;
};

export const normalizeError = (error: AxiosError): NormalizedAxiosErrorMeta => {
  const status = error?.response?.status ?? null;
  const dataMessage = readDataMessage(error?.response);
  const message = dataMessage || error?.message || ERROR_MESSAGES.API.UNKNOWN_ERROR;
  const url = error?.config?.url ?? '';
  const method = error?.config?.method ?? '';
  const isNotFound = status === HTTP_STATUS.NOT_FOUND;
  const isUnauthenticated = status === HTTP_STATUS.UNAUTHORIZED;
  const isForbidden = status === HTTP_STATUS.FORBIDDEN;
  const isClient =
    status != null &&
    status >= HTTP_STATUS.BAD_REQUEST &&
    status < HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isServer = status != null && status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isNetwork = !status && error?.code === ERROR_CODES.NETWORK;
  const isTimeout = error?.code === ERROR_CODES.TIMEOUT || /timeout/i.test(String(message));
  return {
    status,
    message,
    url,
    method,
    isNotFound,
    isUnauthenticated,
    isForbidden,
    isClient,
    isServer,
    isNetwork,
    isTimeout,
  };
};
