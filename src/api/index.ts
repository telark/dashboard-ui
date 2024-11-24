import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:56367/api/v1', // Base API URL
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling responses
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses
  (error) => {
    // Centralized error handling
    const message =
      error.response?.data?.message || 'An error occurred while processing your request.';
    return Promise.reject(new Error(message));
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
