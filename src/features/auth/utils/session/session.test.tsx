import { waitFor } from '@testing-library/react';
import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  ACCOUNT_SUSPENDED_EVENT,
  AUTH_REFUSAL_CODES,
  Endpoints,
  SESSION_CHECK_EVENT,
} from '../../../../constants';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import { mockEmptyEndpoint, mockEndpoint, renderAppHook } from '../../../../test';
import { buildUser } from '../../../../test/factories/users';
import { inDays, signIn } from '../../../../test/helpers/session';
import { AUTH_CONSTANTS } from '../../constants/messages';
import { useSessionExpirationCheck } from './expiration';
import { dropLegacySessionToken, getCurrentSessionName, isSignedIn } from './token';
import { getCurrentUser, removeCurrentUser, setCurrentUser } from './user';
import { validateSession } from './validation';

const mockSelf = (body: object, status = 200) =>
  mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, body as never, { status });

const mockSessionEndingIn = (days: number) =>
  mockSelf({ status: 200, data: { expiresTimestamp: inDays(days) } });

describe('stored user', () => {
  it('reads what was stored and treats its removal as signed out', () => {
    const user = buildUser();

    expect(setCurrentUser(user)).toBe(true);
    expect(getCurrentUser()).toEqual(user);
    expect(isSignedIn()).toBe(true);

    removeCurrentUser();
    expect(getCurrentUser()).toBeNull();
    expect(isSignedIn()).toBe(false);
  });

  it('reads a corrupted stored user as signed out', () => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, '{not json');

    expect(getCurrentUser()).toBeNull();
  });
});

describe('session name', () => {
  it('is null when signed out', async () => {
    await expect(getCurrentSessionName()).resolves.toBeNull();
  });

  it('comes from the exporter when signed in', async () => {
    signIn();
    mockSelf({ data: { metadata: { name: 'session-1' } } });

    await expect(getCurrentSessionName()).resolves.toBe('session-1');
  });

  it('is null when the lookup fails', async () => {
    signIn();
    mockSelf({}, 500);

    await expect(getCurrentSessionName()).resolves.toBeNull();
  });
});

describe('legacy session token', () => {
  it('revokes a pre-cookie token and drops the stored user', async () => {
    localStorage.setItem(STORAGE_KEYS.SESSION_TOKEN, 'old-token');
    signIn();
    const logout = mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);

    dropLegacySessionToken();

    expect(localStorage.getItem(STORAGE_KEYS.SESSION_TOKEN)).toBeNull();
    expect(isSignedIn()).toBe(false);
    await waitFor(() => expect(logout.calls).toHaveLength(1));
  });

  it('does nothing without a legacy token', () => {
    signIn();

    dropLegacySessionToken();

    expect(isSignedIn()).toBe(true);
  });
});

describe('session validation', () => {
  it('is invalid without a signed-in user', async () => {
    await expect(validateSession()).resolves.toEqual({
      isValid: false,
      isExpired: false,
      error: AUTH_CONSTANTS.SESSION.VALIDATION.NOT_SIGNED_IN_ERROR,
    });
  });

  it.each([
    ['in the future', 1, { isValid: true, isExpired: false }],
    ['in the past', -1, { isValid: false, isExpired: true }],
  ])('reads an expiry %s', async (_name, days, expected) => {
    signIn();
    mockSessionEndingIn(days);

    await expect(validateSession()).resolves.toMatchObject(expected);
  });

  it.each([
    ['a rejected session', 401, {}, { isExpired: true, duplicateCookie: false }],
    ['a deleted session', 404, {}, { isExpired: true }],
    [
      'a duplicate cookie',
      401,
      { code: AUTH_REFUSAL_CODES.SESSION_COOKIE_DUPLICATE },
      { isExpired: true, duplicateCookie: true },
    ],
    ['a server failure', 500, {}, { isValid: false, isExpired: false }],
  ])('reports %s', async (_name, status, body, expected) => {
    signIn();
    mockSelf(body, status);

    await expect(validateSession()).resolves.toMatchObject(expected);
  });
});

describe('session expiration check', () => {
  const renderCheck = ({ isAuthenticated = true, isAuthRoute = false } = {}) => {
    const spies = { onSessionExpired: vi.fn(), onAccountSuspended: vi.fn() };
    renderAppHook(() => useSessionExpirationCheck({ isAuthenticated, isAuthRoute, ...spies }));
    return spies;
  };

  beforeEach(() => void signIn());

  it.each([
    ['signed out', { isAuthenticated: false }],
    ['on an auth route', { isAuthRoute: true }],
  ])('stays quiet while %s', async (_name, state) => {
    const self = mockSessionEndingIn(1);
    const { onSessionExpired } = renderCheck(state);

    // A check the hook had started would reach the mock before this lookup's own request.
    await getCurrentSessionName();

    expect(self.calls).toHaveLength(1);
    expect(onSessionExpired).not.toHaveBeenCalled();
  });

  it('reports a session the server no longer honors', async () => {
    mockSelf({}, 401);

    const { onSessionExpired } = renderCheck();

    await waitFor(() => expect(onSessionExpired).toHaveBeenCalledWith(false));
  });

  it('forwards the account-suspended event from the API client', async () => {
    mockSessionEndingIn(1);
    const { onAccountSuspended } = renderCheck();

    act(() => {
      globalThis.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
    });

    await waitFor(() => expect(onAccountSuspended).toHaveBeenCalled());
  });

  it('checks again when a refused event stream asks for it', async () => {
    const self = mockSessionEndingIn(1);
    renderCheck();
    await waitFor(() => expect(self.calls).toHaveLength(1));

    act(() => {
      globalThis.dispatchEvent(new Event(SESSION_CHECK_EVENT));
    });

    await waitFor(() => expect(self.calls).toHaveLength(2));
  });
});
