import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { HTTP_STATUS } from '../../constants';
import logger from '../../logging';
import { canSend } from '../health/circuit-breaker';
import type { ServiceHealth } from '../types';
import { cooldownLogged, requestFailed, requestStarted, requestSucceeded } from '../store/slice';
import { retryAfterMs } from './request';

type HealthAction =
  | ReturnType<typeof requestStarted>
  | ReturnType<typeof requestSucceeded>
  | ReturnType<typeof requestFailed>
  | ReturnType<typeof cooldownLogged>;

export interface HealthStoreBinding {
  getServiceHealth: (serviceName: string) => ServiceHealth;
  dispatch: (action: HealthAction) => void;
}

const SERVICE_UNAVAILABLE_MESSAGE = (name: string): string =>
  `Service '${name}' is temporarily unavailable. Please try again in a moment.`;

// Thunks reject with a string, so the CircuitOpenError instance is gone by the
// time a view decides how to render it. These survive that boundary.
// Both the raw CircuitOpenError text and the userFacingMessage rewrite of it
// reach views, depending on whether the thunk passed the message through.
const SERVICE_UNAVAILABLE_MARKERS = [
  'is temporarily unavailable',
  'Service temporarily unavailable',
];
const NETWORK_MARKERS = ['Cannot reach', 'Network Error', 'Failed to fetch'];

export interface ConnectivityIssue {
  kind: 'service' | 'network';
  serviceName?: string;
}

export const connectivityIssueFrom = (message: string | null): ConnectivityIssue | undefined => {
  if (!message) return undefined;
  if (SERVICE_UNAVAILABLE_MARKERS.some((marker) => message.includes(marker))) {
    return {
      kind: 'service',
      serviceName: /Service '([^']+)' is temporarily unavailable/.exec(message)?.[1],
    };
  }
  if (NETWORK_MARKERS.some((marker) => message.includes(marker))) return { kind: 'network' };
  return undefined;
};

const TIMEOUT_STATUS = 408;
const ABORT_CODE = 'ECONNABORTED';

const isHealthFailure = (status: number | null, code: string | undefined): boolean => {
  if (!status) return true;
  if (status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) return true;
  if (status === TIMEOUT_STATUS) return true;
  return code === ABORT_CODE;
};

export class CircuitOpenError extends Error {
  readonly serviceName: string;
  readonly isCircuitOpen: true;

  constructor(serviceName: string) {
    super(SERVICE_UNAVAILABLE_MESSAGE(serviceName));
    this.name = 'CircuitOpenError';
    this.serviceName = serviceName;
    this.isCircuitOpen = true;
  }
}

const onRequestFactory =
  (binding: HealthStoreBinding, serviceName: string) =>
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const health = binding.getServiceHealth(serviceName);
    const now = new Date();
    if (!canSend(health, now)) {
      if (!health.cooldownLogAt) {
        logger.warn(
          `Service ${serviceName} unavailable, requests suppressed until ${health.openUntil}`,
        );
        binding.dispatch(cooldownLogged(serviceName));
      }
      throw new CircuitOpenError(serviceName);
    }
    binding.dispatch(requestStarted(serviceName));
    return config;
  };

const onResponseFactory =
  (binding: HealthStoreBinding, serviceName: string) =>
  (response: AxiosResponse): AxiosResponse => {
    binding.dispatch(requestSucceeded(serviceName));
    return response;
  };

const onResponseErrorFactory =
  (binding: HealthStoreBinding, serviceName: string) =>
  (error: AxiosError | CircuitOpenError): Promise<never> => {
    if (error instanceof CircuitOpenError) {
      return Promise.reject(error);
    }
    const status = error.response?.status ?? null;
    if (isHealthFailure(status, error.code) && retryAfterMs(error) === undefined) {
      binding.dispatch(requestFailed(serviceName));
    }
    return Promise.reject(error);
  };

export const attachHealthInterceptors = (
  instance: AxiosInstance,
  serviceName: string,
  binding: HealthStoreBinding,
): void => {
  instance.interceptors.request.use(onRequestFactory(binding, serviceName));
  instance.interceptors.response.use(
    onResponseFactory(binding, serviceName),
    onResponseErrorFactory(binding, serviceName),
  );
};
