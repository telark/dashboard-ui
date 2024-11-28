import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:55138/api/v1', // Base API URL
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses
  (error) => {
    // Log or process error here if needed
    console.error("API Error:", error.response?.data?.message || error.message);
    // Return the original error without throwing a new one
    return Promise.reject(error);
  }
);

// Client function to handle API requests with different methods
export const Client = async <T>(
  url: string,
  config: AxiosRequestConfig = { method: 'GET' } // Default method is GET
): Promise<T> => {
  const response = await apiClient(url, config); // Make request based on method in config
  return response.data;
};

export default apiClient;
