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
  (response: AxiosResponse) => response, // Pass successful responses
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error); // Return the original error without throwing a new one
  }
);

// Interceptor for handling responses on the configuratorApiClient
configuratorApiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const Client = async <T>(
  client: AxiosInstance,   // Accept a specific Axios client
  url: string,
  config: AxiosRequestConfig = { method: 'GET' }
): Promise<T> => {
  const response = await client(url, config);
  return response.data;
};

export { exporterApiClient, configuratorApiClient };