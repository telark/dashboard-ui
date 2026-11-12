import { describe, expect, it } from 'vitest';
import { EXPORTER_API } from '../../constants/rest/api';
import { selectServiceHealth } from '../store/selectors';
import {
  apiHealthReducer,
  cooldownLogged,
  requestFailed,
  requestStarted,
  requestSucceeded,
  resetService,
} from '../store/slice';
import type { ServiceHealth } from '../types';
import {
  canSend,
  COOLDOWN_MS,
  FAILURE_THRESHOLD,
  initialHealth,
  recordFailure,
  recordSuccess,
  resolveService,
  SERVICE_NAMES,
  transitionToHalfOpen,
  WINDOW_MS,
} from '.';

const NOW = new Date('2026-06-01T12:00:00Z');
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();
const ahead = (ms: number) => new Date(NOW.getTime() + ms).toISOString();
const health = (overrides: Partial<ServiceHealth>): ServiceHealth => ({
  ...initialHealth,
  ...overrides,
});
const open = (openUntil: string | null) => health({ circuitState: 'open', openUntil });

describe('circuit breaker', () => {
  it('counts failures inside the window and restarts after it', () => {
    const recent = health({ failureCount: 2, lastFailureAt: ago(WINDOW_MS - 1) });
    const old = health({ failureCount: 2, lastFailureAt: ago(WINDOW_MS + 1) });

    expect(recordFailure(recent, NOW).failureCount).toBe(3);
    expect(recordFailure(old, NOW).failureCount).toBe(1);
    expect(recordFailure(initialHealth, NOW).circuitState).toBe('closed');
  });

  it('opens at the threshold, and at once from half-open', () => {
    const atLimit = health({ failureCount: FAILURE_THRESHOLD - 1, lastFailureAt: ago(1) });
    const expected = { circuitState: 'open', openUntil: ahead(COOLDOWN_MS) };

    expect(recordFailure(atLimit, NOW)).toMatchObject(expected);
    expect(recordFailure(health({ circuitState: 'half-open' }), NOW)).toMatchObject(expected);
  });

  it('resets on success and keeps a clean state as is', () => {
    const failing = health({ failureCount: 1 });

    expect(recordSuccess(failing)).toEqual(initialHealth);
    expect(recordSuccess(initialHealth)).toBe(initialHealth);
  });

  it.each<[string, ServiceHealth, boolean]>([
    ['closed', initialHealth, true],
    ['half-open', health({ circuitState: 'half-open' }), true],
    ['open without an end', open(null), true],
    ['open and cooling', open(ahead(1000)), false],
    ['open and cooled', open(ago(1000)), true],
  ])('canSend while %s', (_, state, expected) => {
    expect(canSend(state, NOW)).toBe(expected);
  });

  it.each<[string, ServiceHealth]>([
    ['closed', initialHealth],
    ['open without an end', open(null)],
    ['still cooling', open(ahead(1000))],
  ])('stays as is when %s', (_, state) => {
    expect(transitionToHalfOpen(state, NOW)).toBe(state);
  });

  it('moves to half-open once the cooldown ended', () => {
    expect(transitionToHalfOpen(open(ago(1)), NOW).circuitState).toBe('half-open');
  });
});

describe('resolveService', () => {
  it.each([
    [`${EXPORTER_API.BASE_URL}/roles`, SERVICE_NAMES.EXPORTER],
    ['https://elsewhere.test', null],
    ['', null],
  ])('resolves %j as %j', (url, expected) => {
    expect(resolveService(url)).toBe(expected);
  });
});

describe('api health slice', () => {
  const SVC = SERVICE_NAMES.AUTH;
  const reduce = (...actions: Parameters<typeof apiHealthReducer>[1][]) =>
    actions.reduce(apiHealthReducer, undefined as unknown as ReturnType<typeof apiHealthReducer>);

  it('starts a service closed and records its failures', () => {
    const state = reduce(requestStarted(SVC), requestFailed(SVC));

    expect(state.services[SVC]).toMatchObject({ circuitState: 'closed', failureCount: 1 });
  });

  it('clears failures on success and on reset', () => {
    expect(reduce(requestFailed(SVC), requestSucceeded(SVC)).services[SVC]).toEqual(initialHealth);
    expect(reduce(requestFailed(SVC), resetService(SVC)).services[SVC]).toEqual(initialHealth);
  });

  it('marks the cooldown as logged only for a known service', () => {
    expect(reduce(cooldownLogged(SVC)).services[SVC]).toBeUndefined();
    expect(reduce(requestFailed(SVC), cooldownLogged(SVC)).services[SVC].cooldownLogAt).toEqual(
      expect.any(String),
    );
  });

  it('selects a healthy default for an unknown service', () => {
    expect(selectServiceHealth({ apiHealth: { services: {} } }, SVC)).toEqual(initialHealth);
  });

  it('selects the stored health', () => {
    const apiHealth = reduce(requestFailed(SVC));

    expect(selectServiceHealth({ apiHealth }, SVC)).toBe(apiHealth.services[SVC]);
  });
});
