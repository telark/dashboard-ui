import { describe, expect, it, vi } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../../constants';
import {
  mockEndpoint,
  permissionsSeed,
  resetStore,
  store,
  mockServerError,
} from '../../../../test';
import { signIn } from '../../../../test/helpers/session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { getCurrentUser } from '../session/user';
import { handleUserLogout } from './logout';

const signedIn = () => {
  resetStore(permissionsSeed());
  signIn();
  return { navigate: vi.fn(), message: { success: vi.fn(), error: vi.fn() } };
};

describe('handleUserLogout', () => {
  it('keeps the session when auth refuses the logout', async () => {
    mockServerError('auth', Endpoints.AUTH.LOGOUT);
    const { navigate, message } = signedIn();

    await expect(handleUserLogout(navigate, message)).resolves.toBe(false);

    expect(message.error).toHaveBeenCalledWith(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
    expect(getCurrentUser()).not.toBeNull();
    expect(store.getState().permissions.ready).toBe(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('clears the session and goes to login once auth confirms', async () => {
    mockEndpoint('auth', Endpoints.AUTH.LOGOUT, {});
    const { navigate, message } = signedIn();

    await expect(handleUserLogout(navigate, message)).resolves.toBe(true);

    expect(message.success).toHaveBeenCalledWith(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    expect(getCurrentUser()).toBeNull();
    expect(store.getState().permissions.ready).toBe(false);
    expect(navigate).toHaveBeenCalledWith(APP_ROUTES.LOGIN);
  });
});
