import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const exporterApiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:58588/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const configuratorApiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:58553/api/v1',
  timeout: 10000,
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
