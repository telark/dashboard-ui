import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create two separate Axios instances
const exporterApiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:59342/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const configuratorApiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:60680/api/v1',
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

// Client function to handle API requests dynamically based on the client passed
export const Client = async <T>(
  client: AxiosInstance,   // Accept a specific Axios client
  url: string,
  config: AxiosRequestConfig = { method: 'GET' } // Default method is GET
): Promise<T> => {
  const response = await client(url, config); // Use the passed client to make the request
  return response.data;
};

// Export both clients if needed
export { exporterApiClient, configuratorApiClient };
