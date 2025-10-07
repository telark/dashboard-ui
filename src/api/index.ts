import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { 
  EXPORTER_API, 
  CONFIGURATOR_API, 
  SYNC_MANAGER_API, 
  API_TIMEOUT,
  HTTP_HEADERS,
  HEADER_VALUES,
  HTTP_STATUS,
  ERROR_CODES,
  RESPONSE_STATUS,
  ERROR_MESSAGES,
  REQUEST_CONFIG,
  API_RESPONSES
} from '../constants';

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

// Helpers to normalize error handling
const normalizeError = (error: any) => {
  const status = error?.response?.status ?? null;
  const message = error?.response?.data?.message || error?.message || ERROR_MESSAGES.API.UNKNOWN_ERROR;
  const url = error?.config?.url ?? '';
  const method = error?.config?.method ?? '';
  const isNotFound = status === HTTP_STATUS.NOT_FOUND;
  const isClient = status != null && status >= HTTP_STATUS.BAD_REQUEST && status < HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isServer = status != null && status >= HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const isNetwork = !status && error?.code === ERROR_CODES.NETWORK;
  const isTimeout = error?.code === ERROR_CODES.TIMEOUT || /timeout/i.test(String(message));
  return { status, message, url, method, isNotFound, isClient, isServer, isNetwork, isTimeout };
};

// Interceptor for handling responses on the exporterApiClient
exporterApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const meta = normalizeError(error);
    (error as any).normalized = meta;
    const isSilent404 = meta.isNotFound && error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_404] === HEADER_VALUES.SILENT_404;
    const isSilentNetwork = meta.isNetwork && error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_NETWORK] === HEADER_VALUES.SILENT_NETWORK;
    
    if (isSilent404) {
      // Treat 404 as a successful, empty response when explicitly marked silent
      const resp: AxiosResponse = error?.response ?? {
        ...API_RESPONSES.SILENT_404,
        config: error?.config,
      };
      return Promise.resolve({ ...resp, data: null });
    }
    if (isSilentNetwork) {
      // Suppress logging and just propagate silently
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
    return Promise.reject(error); // Return original error
  },
);

// Interceptor for handling responses on the configuratorApiClient
configuratorApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const meta = normalizeError(error);
    (error as any).normalized = meta;
    const isSilentNetwork = meta.isNetwork && error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_NETWORK] === HEADER_VALUES.SILENT_NETWORK;
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
);

// Interceptor for handling responses on the syncManagerApiClient
syncManagerApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const meta = normalizeError(error);
    (error as any).normalized = meta;
    const isSilentNetwork = meta.isNetwork && error?.config?.headers?.[HTTP_HEADERS.CUSTOM.SILENT_NETWORK] === HEADER_VALUES.SILENT_NETWORK;
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
);

export const Client = async <T>(
  client: AxiosInstance,
  url: string,
  config: AxiosRequestConfig = { method: REQUEST_CONFIG.DEFAULT_METHOD },
): Promise<T> => {
  const response = await client(url, config);
  return response.data;
};

export { exporterApiClient, configuratorApiClient, syncManagerApiClient };
