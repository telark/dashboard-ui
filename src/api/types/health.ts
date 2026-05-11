export type CircuitState = 'closed' | 'open' | 'half-open';

export interface ServiceHealth {
  circuitState: CircuitState;
  failureCount: number;
  lastFailureAt: string | null;
  openUntil: string | null;
  cooldownLogAt: string | null;
}

export interface ServiceHealthMap {
  [serviceName: string]: ServiceHealth;
}
