import type { ServiceHealth } from '../types';
import { COOLDOWN_MS, FAILURE_THRESHOLD, WINDOW_MS } from './constants';

export const initialHealth: ServiceHealth = {
  circuitState: 'closed',
  failureCount: 0,
  lastFailureAt: null,
  openUntil: null,
  cooldownLogAt: null,
};

const isInsideWindow = (lastFailureAt: string | null, now: Date): boolean => {
  if (!lastFailureAt) return false;
  return now.getTime() - new Date(lastFailureAt).getTime() <= WINDOW_MS;
};

const openCircuit = (now: Date): ServiceHealth => ({
  circuitState: 'open',
  failureCount: FAILURE_THRESHOLD,
  lastFailureAt: now.toISOString(),
  openUntil: new Date(now.getTime() + COOLDOWN_MS).toISOString(),
  cooldownLogAt: null,
});

export const recordFailure = (current: ServiceHealth, now: Date): ServiceHealth => {
  if (current.circuitState === 'half-open') {
    return openCircuit(now);
  }

  const inWindow = isInsideWindow(current.lastFailureAt, now);
  const nextCount = inWindow ? current.failureCount + 1 : 1;

  if (nextCount >= FAILURE_THRESHOLD) {
    return openCircuit(now);
  }

  return {
    circuitState: 'closed',
    failureCount: nextCount,
    lastFailureAt: now.toISOString(),
    openUntil: null,
    cooldownLogAt: null,
  };
};

export const recordSuccess = (current: ServiceHealth): ServiceHealth => {
  if (current.circuitState === 'closed' && current.failureCount === 0) {
    return current;
  }
  return { ...initialHealth };
};

export const canSend = (current: ServiceHealth, now: Date): boolean => {
  if (current.circuitState === 'closed') return true;
  if (current.circuitState === 'half-open') return true;
  if (!current.openUntil) return true;
  return now.getTime() >= new Date(current.openUntil).getTime();
};

export const transitionToHalfOpen = (current: ServiceHealth, now: Date): ServiceHealth => {
  if (current.circuitState !== 'open') return current;
  if (!current.openUntil) return current;
  if (now.getTime() < new Date(current.openUntil).getTime()) return current;
  return { ...current, circuitState: 'half-open' };
};
