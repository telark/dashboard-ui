import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  EXPORTER_API,
  CONFIGURATOR_API,
  SYNC_MANAGER_API,
  AUTH_API,
  API_TIMEOUT,
  HTTP_HEADERS,
  HEADER_VALUES,
  HTTP_STATUS,
  ERROR_CODES,
  ERROR_MESSAGES,
  REQUEST_CONFIG,
  API_RESPONSES,
} from '../constants';
import { ErrorInterceptorOptions } from '../interfaces/api';
import {
  createSessionTokenInterceptor,
  createRequestErrorHandler,
} from '../utils/auth/interceptors';

interface ExtendedAxiosError extends AxiosError {
  normalized?: ReturnType<typeof normalizeError>;
}

const exporterApiClient: AxiosInstance = axios.create({
  baseURL: EXPORTER_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: REQUEST_CONFIG.DEFAULT_HEADERS,
});

const configuratorApiClient: AxiosInstance = axios.create({
  baseURL: CONFIGURATOR_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: REQUEST_CONFIG.DEFAULT_HEADERS,
});

const syncManagerApiClient: AxiosInstance = axios.create({
  baseURL: SYNC_MANAGER_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: REQUEST_CONFIG.DEFAULT_HEADERS,
});

const authApiClient: AxiosInstance = axios.create({
  baseURL: AUTH_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: REQUEST_CONFIG.DEFAULT_HEADERS,
});

// Add session token interceptor for auth client
authApiClient.interceptors.request.use(
  createSessionTokenInterceptor(),
  createRequestErrorHandler(),
);

const normalizeError = (error: AxiosError) => {
  const status = error?.response?.status ?? null;
  const responseData = error?.response?.data;
  const dataMessage =
    responseData && typeof responseData === 'object' && 'message' in responseData
      ? String(responseData.message)
      : undefined;
  const message = dataMessage || error?.message || ERROR_MESSAGES.API.UNKNOWN_ERROR;
  const url = error?.config?.url ?? '';
  const method = error?.config?.method ?? '';
  const isNotFound = status === HTTP_STATUS.NOT_FOUND;
  const isClient =
    status != null &&
    status >= HTTP_STATUS.BAD_REQUEST &&
    status < HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isServer = status != null && status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isNetwork = !status && error?.code === ERROR_CODES.NETWORK;
  const isTimeout = error?.code === ERROR_CODES.TIMEOUT || /timeout/i.test(String(message));
  return { status, message, url, method, isNotFound, isClient, isServer, isNetwork, isTimeout };
};

const createErrorInterceptor = (options: ErrorInterceptorOptions = {}) => {
  const { silent404 = false } = options;

  return [
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const meta = normalizeError(error);
      (error as ExtendedAxiosError).normalized = meta;

      const isSilent404 =
        silent404 &&
        meta.isNotFound &&
        error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_404] === HEADER_VALUES.SILENT_404;
      const isSilentNetwork =
        meta.isNetwork &&
        error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_NETWORK] ===
          HEADER_VALUES.SILENT_NETWORK;

      if (isSilent404) {
        if (error?.response) {
          return Promise.resolve({ ...error.response, data: null });
        }
        if (!error?.config) {
          return Promise.reject(error);
        }
        const resp: AxiosResponse = {
          ...API_RESPONSES.SILENT_404,
          config: error.config,
          statusText: 'Not Found',
          headers: {},
        };
        return Promise.resolve(resp);
      }
      if (isSilentNetwork) {
        return Promise.reject(error);
      }
      if (meta.isNotFound) {
        console.warn(ERROR_MESSAGES.API.NOT_FOUND_WARNING, meta);
      } else if (meta.isNetwork) {
        console.error(ERROR_MESSAGES.API.NETWORK_ERROR, meta);
      } else if (meta.isTimeout) {
        console.error(ERROR_MESSAGES.API.TIMEOUT_ERROR, meta);
      } else {
        console.error(ERROR_MESSAGES.API.GENERIC_ERROR, meta);
      }
      return Promise.reject(error);
    },
  ] as const;
};

exporterApiClient.interceptors.response.use(...createErrorInterceptor({ silent404: true }));
configuratorApiClient.interceptors.response.use(...createErrorInterceptor());
syncManagerApiClient.interceptors.response.use(...createErrorInterceptor());
authApiClient.interceptors.response.use(...createErrorInterceptor());

const DEFAULT_CLIENT_CONFIG: AxiosRequestConfig = {
  method: REQUEST_CONFIG.DEFAULT_METHOD,
};

export const Client = async <T>(
  client: AxiosInstance,
  url: string,
  config: AxiosRequestConfig = DEFAULT_CLIENT_CONFIG,
): Promise<T> => {
  const response = await client(url, config);
  return response.data;
};

export { exporterApiClient, configuratorApiClient, syncManagerApiClient, authApiClient };
