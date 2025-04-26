import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { EXPORTER_API, CONFIGURATOR_API, API_TIMEOUT } from '../constants/api';

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

// Interceptor for handling responses on the exporterApiClient
exporterApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error); // Return original error
  }
);

// Interceptor for handling responses on the configuratorApiClient
configuratorApiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const Client = async <T>(
  client: AxiosInstance,
  url: string,
  config: AxiosRequestConfig = { method: 'GET' }
): Promise<T> => {
  const response = await client(url, config);
  return response.data;
};

export { exporterApiClient, configuratorApiClient };
