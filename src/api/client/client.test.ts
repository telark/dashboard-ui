import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import {
  ACCOUNT_SUSPENDED_EVENT,
  AUTH_REFUSAL_CODES,
  Endpoints,
  ERROR_CODES,
  ERROR_MESSAGES,
  EXPORTER_API,
  HEADER_VALUES,
  HTTP_HEADERS,
  HTTP_STATUS,
  REQUEST_CONFIG,
} from '../../constants';
import { mockEndpoint } from '../../test';
import { server } from '../../test/server';
import logger from '../../logging';
import { initialHealth } from '../health/circuit-breaker';
import { createErrorInterceptor } from './error-interceptor';
import { userFacingMessage } from './error-messages';
import {
  attachHealthInterceptors,
  CircuitOpenError,
  connectivityIssueFrom,
  type HealthStoreBinding,
} from './health-interceptor';
import { normalizeError } from './normalize';
import { Client, retryAfterMs } from './request';

const config = (headers: Record<string, string> = {}) =>
  ({ url: '/x', method: 'get', headers }) as unknown as InternalAxiosRequestConfig;

const httpError = (status: number, data: unknown = {}, headers: Record<string, string> = {}) =>
  new AxiosError('Request failed', undefined, config(), undefined, {
    status,
    data,
    headers,
    config: config(),
    statusText: '',
  } as AxiosResponse);

const networkError = (headers?: Record<string, string>) =>
  new AxiosError('Network Error', ERROR_CODES.NETWORK, config(headers));

const ASKS_TO_RETRY = {
  status: HTTP_STATUS.SERVICE_UNAVAILABLE,
  headers: { [HTTP_HEADERS.STANDARD.RETRY_AFTER]: '0' },
};
const ENDPOINT = Endpoints.ROLES.GET_ALL;
const url = `${EXPORTER_API.BASE_URL}/${ENDPOINT.path}`;

describe('normalizeError', () => {
  it.each<[string, AxiosError, Record<string, unknown>]>([
    ['a 404', httpError(404), { status: 404, isNotFound: true, isClient: true }],
    ['a 401', httpError(401), { isUnauthenticated: true }],
    ['a 403 with a code', httpError(403, { code: 'c' }), { isForbidden: true, code: 'c' }],
    ['a 500', httpError(500), { isServer: true, isClient: false }],
    ['a server message', httpError(422, { message: 'bad' }), { message: 'bad' }],
    ['a non-object body', httpError(500, 'oops'), { message: 'Request failed' }],
    [
      'a network failure',
      networkError(),
      { status: null, isNetwork: true, url: '/x', method: 'get' },
    ],
    [
      'a timeout',
      new AxiosError('timeout of 1ms', ERROR_CODES.TIMEOUT),
      { isTimeout: true, url: '' },
    ],
    ['no message at all', new AxiosError(''), { message: ERROR_MESSAGES.API.UNKNOWN_ERROR }],
  ])('reads %s', (_, error, expected) => {
    expect(normalizeError(error)).toMatchObject(expected);
  });
});

describe('userFacingMessage', () => {
  it.each<[string, Error, string]>([
    [
      'a circuit open',
      new CircuitOpenError('auth'),
      'Service is temporarily unavailable. Try again in a moment.',
    ],
    [
      'a timeout',
      new AxiosError('t', ERROR_CODES.TIMEOUT),
      'The server took too long to respond. Try again.',
    ],
    [
      'an aborted request',
      new AxiosError('t', 'ECONNABORTED'),
      'The server took too long to respond. Try again.',
    ],
    ['a network failure', new AxiosError('n'), 'Cannot reach the server. Check your connection.'],
    ['a 401', httpError(401), 'Your session expired. Please sign in again.'],
    ['a 403', httpError(403), "You don't have permission to do this."],
    ['a 404', httpError(404), "The item you're looking for doesn't exist."],
    ['a 408', httpError(408), 'The server took too long to respond. Try again.'],
    ['a 422 with a message', httpError(422, { message: 'Bad name' }), 'Bad name'],
    [
      'a 422 with a blank message',
      httpError(422, { message: ' ' }),
      'Some of the values you entered are not valid.',
    ],
    ['a 422 with no body', httpError(422, 'text'), 'Some of the values you entered are not valid.'],
    ['a 500', httpError(500), "Something went wrong on our side. We're looking into it."],
    ['a 418', httpError(418), 'Something went wrong. Please try again.'],
    [
      'a rebuilt network error',
      new Error('Network Error'),
      'Cannot reach the server. Check your connection.',
    ],
    [
      'a rebuilt circuit error',
      new Error('Service temporarily unavailable'),
      'Service is temporarily unavailable. Try again in a moment.',
    ],
    ['anything else', new Error('other'), 'Something went wrong. Please try again.'],
  ])('explains %s', (_, error, expected) => {
    expect(userFacingMessage(error)).toBe(expected);
  });
});

describe('connectivityIssueFrom', () => {
  it.each<[string | null, string | undefined]>([
    [null, undefined],
    ['Failed to fetch users', undefined],
    ['Failed to fetch', 'network'],
    ['Cannot reach the server', 'network'],
    ['exporter is temporarily unavailable', 'service'],
  ])('reads %j as %j', (message, kind) => {
    expect(connectivityIssueFrom(message)?.kind).toBe(kind);
  });
});

describe('error interceptor', () => {
  const [onSuccess, onError] = createErrorInterceptor({ silent404: true });
  const [, loud] = createErrorInterceptor();
  const silent404 = { [HTTP_HEADERS.CUSTOM.SILENT_404]: HEADER_VALUES.SILENT_404 };

  it('passes a success through', () => {
    const response = { data: 1 } as AxiosResponse;

    expect(onSuccess(response)).toBe(response);
  });

  it('attaches the normalized error before rejecting', async () => {
    const error = httpError(500);

    await expect(onError(error)).rejects.toBe(error);
    expect(error).toHaveProperty('normalized.isServer', true);
  });

  it('answers a marked 404 with no data', async () => {
    const error = httpError(404);
    error.config = config(silent404);

    await expect(onError(error)).resolves.toMatchObject({ status: 404, data: null });
  });

  it.each([
    ['a client without silent 404', loud, silent404],
    ['an unmarked request', createErrorInterceptor({ silent404: true })[1], {}],
  ])('rejects a 404 from %s', async (_, handler, headers) => {
    const error = httpError(404);
    error.config = config(headers);

    await expect(handler(error)).rejects.toBe(error);
  });

  it.each<[string, () => AxiosError, 'warn' | 'error', string | null]>([
    ['a forbidden', () => httpError(403), 'warn', ERROR_MESSAGES.API.FORBIDDEN_WARNING],
    ['a not found', () => httpError(404), 'warn', ERROR_MESSAGES.API.NOT_FOUND_WARNING],
    ['a network failure', () => networkError(), 'error', ERROR_MESSAGES.API.NETWORK_ERROR],
    [
      'a timeout',
      () => new AxiosError('timeout', ERROR_CODES.TIMEOUT, config()),
      'error',
      ERROR_MESSAGES.API.TIMEOUT_ERROR,
    ],
    ['a server failure', () => httpError(500), 'error', ERROR_MESSAGES.API.GENERIC_ERROR],
  ])('logs %s', async (_, build, level, message) => {
    const spy = vi.spyOn(logger, level);
    const error = build();

    await expect(loud(error)).rejects.toBe(error);

    expect(spy).toHaveBeenCalledWith(message, expect.anything());
  });

  it.each<[string, () => AxiosError]>([
    [
      'a silent network failure',
      () => networkError({ [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK }),
    ],
    ['an expired session', () => httpError(HTTP_STATUS.UNAUTHORIZED)],
    ['a gone session', () => httpError(HTTP_STATUS.GONE)],
  ])('stays quiet about %s', async (_, build) => {
    const warn = vi.spyOn(logger, 'warn');
    const logged = vi.spyOn(logger, 'error');
    const error = build();

    await expect(loud(error)).rejects.toBe(error);

    expect(warn).not.toHaveBeenCalled();
    expect(logged).not.toHaveBeenCalled();
  });

  it('announces a suspended account', async () => {
    const heard = vi.fn();
    globalThis.addEventListener(ACCOUNT_SUSPENDED_EVENT, heard, { once: true });

    const error = httpError(403, { code: AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED });

    await expect(loud(error)).rejects.toBe(error);

    expect(heard).toHaveBeenCalledTimes(1);
  });
});

describe('health interceptors', () => {
  const SVC = 'exporter';
  const openCircuit = {
    ...initialHealth,
    circuitState: 'open' as const,
    openUntil: '2999-01-01T00:00:00Z',
  };

  const setup = (state = initialHealth) => {
    const dispatch = vi.fn<HealthStoreBinding['dispatch']>();
    const instance = axios.create();
    attachHealthInterceptors(instance, SVC, { getServiceHealth: () => state, dispatch });
    return { dispatch, instance, types: () => dispatch.mock.calls.map(([action]) => action.type) };
  };

  it('records a started and a succeeded request', async () => {
    mockEndpoint('exporter', ENDPOINT, {});
    const { instance, types } = setup();

    await instance.get(url);

    expect(types()).toEqual(['apiHealth/requestStarted', 'apiHealth/requestSucceeded']);
  });

  it.each([
    [500, true],
    [408, true],
    [404, false],
  ])('after a %i, counts a failure: %j', async (status, counted) => {
    mockEndpoint('exporter', ENDPOINT, {}, { status });
    const { instance, types } = setup();

    await expect(instance.get(url)).rejects.toMatchObject({ response: { status } });

    expect(types().includes('apiHealth/requestFailed')).toBe(counted);
  });

  it('does not count a 503 that asks to retry', async () => {
    mockEndpoint('exporter', ENDPOINT, {}, ASKS_TO_RETRY);
    const { instance, types } = setup();

    await expect(instance.get(url)).rejects.toMatchObject({
      response: { status: ASKS_TO_RETRY.status },
    });

    expect(types()).not.toContain('apiHealth/requestFailed');
  });

  it('refuses while open and logs the cooldown once', async () => {
    const warn = vi.spyOn(logger, 'warn');
    const { instance, types } = setup(openCircuit);

    await expect(instance.get(url)).rejects.toBeInstanceOf(CircuitOpenError);
    expect(types()).toEqual(['apiHealth/cooldownLogged']);
    expect(warn).toHaveBeenCalledOnce();
  });

  it('stays quiet once the cooldown is logged', async () => {
    const { instance, types } = setup({
      ...openCircuit,
      cooldownLogAt: '2026-01-01T00:00:00Z',
    });

    await expect(instance.get(url)).rejects.toBeInstanceOf(CircuitOpenError);
    expect(types()).toEqual([]);
  });
});

describe('Client and retryAfterMs', () => {
  const instance = axios.create();
  const retryOnce = () =>
    server.use(http.get(url, () => HttpResponse.json({}, ASKS_TO_RETRY), { once: true }));
  const retryAfter = (value: string) =>
    httpError(503, {}, { [HTTP_HEADERS.STANDARD.RETRY_AFTER]: value });

  it.each<[string, unknown, number | undefined]>([
    ['anything but an axios error', new Error('x'), undefined],
    ['another status', httpError(500), undefined],
    ['a 503 without the header', httpError(503), undefined],
    ['a bad header', retryAfter('soon'), undefined],
    ['a negative header', retryAfter('-1'), undefined],
    ['a short wait', retryAfter('2'), 2000],
    ['a capped wait', retryAfter('9999999'), REQUEST_CONFIG.RETRY_AFTER_CAP_MS],
  ])('reads %s', (_, error, expected) => {
    expect(retryAfterMs(error)).toBe(expected);
  });

  it('returns the response body', async () => {
    mockEndpoint('exporter', ENDPOINT, { value: 1 });

    await expect(Client(instance, url)).resolves.toEqual({ value: 1 });
  });

  it('tries an idempotent GET once more after a 503 that asks to retry', async () => {
    const mock = mockEndpoint('exporter', ENDPOINT, { value: 2 });
    retryOnce();

    await expect(Client(instance, url, { method: 'GET' })).resolves.toEqual({ value: 2 });
    expect(mock.calls).toHaveLength(1);
  });

  it('does not retry a write', async () => {
    const mock = mockEndpoint(
      'exporter',
      { path: ENDPOINT.path, method: 'POST' },
      {},
      ASKS_TO_RETRY,
    );

    await expect(Client(instance, url, { method: 'POST' })).rejects.toMatchObject({
      response: { status: ASKS_TO_RETRY.status },
    });
    expect(mock.calls).toHaveLength(1);
  });
});
