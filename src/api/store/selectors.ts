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
