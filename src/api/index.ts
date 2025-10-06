import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EXPORTER_API, CONFIGURATOR_API, SYNC_MANAGER_API, API_TIMEOUT } from '../constants/api';

const exporterApiClient: AxiosInstance = axios.create({
  baseURL: EXPORTER_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const configuratorApiClient: AxiosInstance = axios.create({
  baseURL: CONFIGURATOR_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

const syncManagerApiClient: AxiosInstance = axios.create({
  baseURL: SYNC_MANAGER_API.BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helpers to normalize error handling
const normalizeError = (error: any) => {
  const status = error?.response?.status ?? null;
  const message = error?.response?.data?.message || error?.message || 'Unknown error';
  const url = error?.config?.url ?? '';
  const method = error?.config?.method ?? '';
  const isNotFound = status === 404;
  const isClient = status != null && status >= 400 && status < 500;
  const isServer = status != null && status >= 500;
  const isNetwork = !status && error?.code === 'ERR_NETWORK';
  const isTimeout = error?.code === 'ECONNABORTED' || /timeout/i.test(String(message));
  return { status, message, url, method, isNotFound, isClient, isServer, isNetwork, isTimeout };
};

// Interceptor for handling responses on the exporterApiClient
exporterApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const meta = normalizeError(error);
    (error as any).normalized = meta;
    const isSilent404 = meta.isNotFound && error?.config?.headers?.['X-Silent-404'] === 'true';
    if (isSilent404) {
      // Treat 404 as a successful, empty response when explicitly marked silent
      const resp: AxiosResponse = error?.response ?? {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: error?.config,
      };
      return Promise.resolve({ ...resp, data: null });
    }
    if (meta.isNotFound) {
      console.warn('API Warning (404):', meta);
    } else if (meta.isNetwork) {
      console.error('API Network Error:', meta);
    } else if (meta.isTimeout) {
      console.error('API Timeout:', meta);
    } else {
      console.error('API Error:', meta);
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
    if (meta.isNotFound) {
      console.warn('API Warning (404):', meta);
    } else if (meta.isNetwork) {
      console.error('API Network Error:', meta);
    } else if (meta.isTimeout) {
      console.error('API Timeout:', meta);
    } else {
      console.error('API Error:', meta);
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
    if (meta.isNotFound) {
      console.warn('API Warning (404):', meta);
    } else if (meta.isNetwork) {
      console.error('API Network Error:', meta);
    } else if (meta.isTimeout) {
      console.error('API Timeout:', meta);
    } else {
      console.error('API Error:', meta);
    }
    return Promise.reject(error);
  },
);

export const Client = async <T>(
  client: AxiosInstance,
  url: string,
  config: AxiosRequestConfig = { method: 'GET' },
): Promise<T> => {
  const response = await client(url, config);
  return response.data;
};

export { exporterApiClient, configuratorApiClient, syncManagerApiClient };
