import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { REQUEST_CONFIG } from '../../constants';

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
