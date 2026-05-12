import axios, { type AxiosInstance } from 'axios';
import {
  API_TIMEOUT,
  AUTH_API,
  DISCOVERY_API,
  ENRICHMENT_API,
  EXPORTER_API,
  REQUEST_CONFIG,
} from '../../constants';
import { createSessionTokenInterceptor } from '../../features/auth/utils';
import { createRequestErrorHandler } from '../../utils/shared/errors';
import { SERVICE_NAMES } from '../health/constants';
import { createErrorInterceptor } from './error-interceptor';
import { attachHealthInterceptors, type HealthStoreBinding } from './health-interceptor';

const buildInstance = (baseURL: string): AxiosInstance =>
  axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: REQUEST_CONFIG.DEFAULT_HEADERS,
  });

export const exporterApiClient: AxiosInstance = buildInstance(EXPORTER_API.BASE_URL);
export const discoveryApiClient: AxiosInstance = buildInstance(DISCOVERY_API.BASE_URL);
export const authApiClient: AxiosInstance = buildInstance(AUTH_API.BASE_URL);
export const enrichmentApiClient: AxiosInstance = buildInstance(ENRICHMENT_API.BASE_URL);

authApiClient.interceptors.request.use(
  createSessionTokenInterceptor(),
  createRequestErrorHandler(),
  { synchronous: true },
);

exporterApiClient.interceptors.response.use(...createErrorInterceptor({ silent404: true }));
discoveryApiClient.interceptors.response.use(...createErrorInterceptor());
authApiClient.interceptors.response.use(...createErrorInterceptor());
enrichmentApiClient.interceptors.response.use(...createErrorInterceptor());

interface ServiceInstance {
  name: string;
  instance: AxiosInstance;
}

const SERVICE_INSTANCES: readonly ServiceInstance[] = [
  { name: SERVICE_NAMES.EXPORTER, instance: exporterApiClient },
  { name: SERVICE_NAMES.DISCOVERY, instance: discoveryApiClient },
  { name: SERVICE_NAMES.AUTH, instance: authApiClient },
  { name: SERVICE_NAMES.ENRICHMENT, instance: enrichmentApiClient },
];

let healthRegistered = false;

export const registerHealthInterceptors = (binding: HealthStoreBinding): void => {
  if (healthRegistered) return;
  healthRegistered = true;
  for (const { name, instance } of SERVICE_INSTANCES) {
    attachHealthInterceptors(instance, name, binding);
  }
};
