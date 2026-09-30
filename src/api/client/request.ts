import { isAxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { HTTP_HEADERS, HTTP_STATUS, REQUEST_CONFIG, TIME_CONFIGS } from '../../constants';

const DEFAULT_CLIENT_CONFIG: AxiosRequestConfig = {
  method: REQUEST_CONFIG.DEFAULT_METHOD,
};

// A 503 with Retry-After is load shedding, not an outage: an idempotent GET may try once more.
export const retryAfterMs = (error: unknown): number | undefined => {
  if (!isAxiosError(error) || error.response?.status !== HTTP_STATUS.SERVICE_UNAVAILABLE) {
    return undefined;
  }
  const seconds = Number(error.response.headers?.[HTTP_HEADERS.STANDARD.RETRY_AFTER]);
  if (!Number.isFinite(seconds) || seconds < 0) return undefined;
  return Math.min(seconds * TIME_CONFIGS.MS_PER_SECOND, REQUEST_CONFIG.RETRY_AFTER_CAP_MS);
};

export const Client = async <T>(
  client: AxiosInstance,
  url: string,
  config: AxiosRequestConfig = DEFAULT_CLIENT_CONFIG,
): Promise<T> => {
  try {
    const response = await client(url, config);
    return response.data;
  } catch (error) {
    const method = (config.method ?? REQUEST_CONFIG.DEFAULT_METHOD).toUpperCase();
    const delay = method === REQUEST_CONFIG.DEFAULT_METHOD ? retryAfterMs(error) : undefined;
    if (delay === undefined) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    const response = await client(url, config);
    return response.data;
  }
};
