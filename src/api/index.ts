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

// Interceptor for handling responses on the exporterApiClient
exporterApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Suppress noisy logs for explicitly silenced 404s (e.g., missing maintenance feature)
    const isSilent404 =
      error?.response?.status === 404 && error?.config?.headers?.['X-Silent-404'] === 'true';
    if (!isSilent404) {
      console.error('API Error:', error.response?.data?.message || error.message);
    }
    return Promise.reject(error); // Return original error
  },
);

// Interceptor for handling responses on the configuratorApiClient
configuratorApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
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
