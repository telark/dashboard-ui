import { describe, expect, it, vi } from 'vitest';
import { AUTH_REFUSAL_CODES, ERROR_MESSAGES } from '../../../../constants';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { resetStore } from '../../../../test';
import {
  getLoginRefusalMessage,
  getUserFriendlyErrorMessage,
  handleAuthError,
  serverMessage,
} from './errors';

const { MESSAGES } = LOGIN_CONSTANTS;

const normalized = (meta: object, message = 'Request failed') =>
  Object.assign(new Error(message), { normalized: { message, status: 0, ...meta } });

describe('login refusal', () => {
  it.each([
    [{ isForbidden: true, code: AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED }, MESSAGES.ACCOUNT_SUSPENDED],
    [
      { isForbidden: true, code: AUTH_REFUSAL_CODES.BOOTSTRAP_PASSKEY_ONLY },
      MESSAGES.BOOTSTRAP_PASSKEY_ONLY,
    ],
    [
      { status: 409, message: 'email already signs in another way' },
      MESSAGES.EMAIL_SIGNS_IN_ANOTHER_WAY,
    ],
    [{ status: 409, message: 'more than one user holds this email' }, MESSAGES.EMAIL_AMBIGUOUS],
    [{ status: 409, message: 'unrelated conflict' }, null],
    [{ status: 500 }, null],
  ])('reads %j as a refusal', (meta, expected) => {
    expect(getLoginRefusalMessage(normalized(meta, 'axios text'))).toBe(expected);
  });
});

describe('friendly error messages', () => {
  it.each([
    [
      'a plain 404 shape',
      { status: 404, message: 'not found' },
      MESSAGES.USER_NOT_FOUND_NO_SELF_REGISTRATION,
    ],
    ['a no-passkeys message', new Error('no passkey found'), MESSAGES.NO_PASSKEYS],
    ['a network failure', { isNetwork: true, message: 'x' }, MESSAGES.NETWORK_ERROR],
    ['a timeout', { isTimeout: true, message: 'x' }, MESSAGES.TIMEOUT_ERROR],
    ['a server failure', { isServer: true, message: 'x' }, MESSAGES.SERVER_ERROR],
    ['a client error with text', { isClient: true, message: 'bad input' }, 'bad input'],
    [
      'a client error without text',
      { isClient: true, message: ERROR_MESSAGES.API.UNKNOWN_ERROR },
      MESSAGES.CLIENT_ERROR,
    ],
    ['an empty failure', {}, AUTH_ERROR_MESSAGES.AUTHENTICATION_FAILED],
    ['a plain error', new Error('browser said no'), 'browser said no'],
  ])('explains %s', (_name, error, expected) => {
    resetStore();

    expect(getUserFriendlyErrorMessage(error)).toBe(expected);
  });

  it('keeps only a message the server wrote', () => {
    expect(serverMessage(normalized({}, 'Request failed'))).toBeUndefined();
    const fromServer = Object.assign(new Error('Request failed'), {
      normalized: { message: 'quota exceeded' },
    });
    expect(serverMessage(fromServer)).toBe('quota exceeded');
  });
});

describe('auth error toasts', () => {
  const messageApi = () => ({ open: vi.fn() }) as never as Parameters<typeof handleAuthError>[1];

  it('is informational for an account without passkeys', () => {
    const api = messageApi();

    handleAuthError(new Error('no passkeys found'), api);

    expect(api.open).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', content: MESSAGES.NO_PASSKEYS }),
    );
  });

  it('is an error toast for an unknown account and any other failure', () => {
    resetStore();
    const api = messageApi();

    handleAuthError({ status: 404, message: 'x' }, api);
    handleAuthError(new Error('boom'), api);

    expect(api.open).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'error',
        content: MESSAGES.USER_NOT_FOUND_NO_SELF_REGISTRATION,
      }),
    );
    expect(api.open).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', content: 'boom' }),
    );
  });
});
