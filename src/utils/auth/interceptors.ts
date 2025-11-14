import type { InternalAxiosRequestConfig } from 'axios';
import { HTTP_HEADERS } from '../../constants';
import { getSessionToken } from './session';

/**
 * Creates a request interceptor that adds the session token to the request headers.
 * This interceptor should be used for authenticated API clients.
 */
export const createSessionTokenInterceptor = () => {
  return (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const sessionToken = getSessionToken();
    if (sessionToken && config.headers) {
      config.headers[HTTP_HEADERS.CUSTOM.SESSION_TOKEN] = sessionToken;
    }
    return config;
  };
};

export const createRequestErrorHandler = () => {
  return (error: unknown) => {
    return Promise.reject(error);
  };
};
