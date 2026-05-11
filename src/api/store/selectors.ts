import { canSend } from '../health/circuit-breaker';
import { initialHealth } from '../health/circuit-breaker';
import type { ServiceHealth } from '../types';
import type { ApiHealthState } from './slice';

export interface ApiHealthRootSlice {
  apiHealth: ApiHealthState;
}

export const selectServiceHealth = (
  state: ApiHealthRootSlice,
  serviceName: string,
): ServiceHealth => state.apiHealth.services[serviceName] ?? { ...initialHealth };

export const selectCanSendToService = (state: ApiHealthRootSlice, serviceName: string): boolean =>
  canSend(selectServiceHealth(state, serviceName), new Date());

export const selectIsAnyServiceDown = (state: ApiHealthRootSlice): boolean =>
  Object.values(state.apiHealth.services).some((h) => h.circuitState === 'open');
