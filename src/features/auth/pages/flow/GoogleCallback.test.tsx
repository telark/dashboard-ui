import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../../constants';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import { mockEmptyEndpoint, mockEndpoint, renderApp, currentLocation } from '../../../../test';
import { buildUser } from '../../../../test/factories/users';
import { mockMyPermissions } from '../../../../test/helpers/authApi';
import { signIn } from '../../../../test/helpers/session';
import { LOGIN_CONSTANTS } from '../../constants/login';
import GoogleCallback from './GoogleCallback';

const { OIDC } = LOGIN_CONSTANTS;
const STATE = 'matching-state';
const FRAGMENT = `#${OIDC.FRAGMENT_ID_TOKEN}=id-token&${OIDC.FRAGMENT_STATE}=${STATE}`;

const renderCallback = (hash: string, storedState: string | null = STATE) => {
  window.location.hash = hash;
  if (storedState) sessionStorage.setItem(OIDC.STATE_STORAGE_KEY, storedState);
  return renderApp(<GoogleCallback />);
};

describe('Google sign-in callback', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('completes the sign-in, stores the user and enters the app', async () => {
    const user = buildUser();
    const callback = mockEndpoint<{ idToken: string }>(
      'auth',
      Endpoints.AUTH.OIDC.GOOGLE.CALLBACK,
      { data: { email: user.email, user: user as never } },
    );
    const permissions = mockMyPermissions();

    renderCallback(FRAGMENT);

    expect(await screen.findByText(OIDC.CALLBACK_SUCCESS)).toBeInTheDocument();
    expect(callback.calls[0].body.idToken).toBe('id-token');
    expect(permissions.calls).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toContain(user.id);
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
  });

  it.each([
    ['no token', `#${OIDC.FRAGMENT_STATE}=${STATE}`, STATE],
    ['no remembered state', FRAGMENT, null],
    ['a state that does not match', FRAGMENT, 'another-state'],
  ])('rejects a callback with %s', async (_name, hash, storedState) => {
    renderCallback(hash, storedState);

    expect(await screen.findByText(OIDC.CALLBACK_ERROR)).toBeInTheDocument();
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
  });

  it('never swaps an existing session for one delivered by a link', async () => {
    signIn();

    renderCallback(FRAGMENT);

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
  });

  it('ends the half-open session when the answer carries no user', async () => {
    mockEndpoint('auth', Endpoints.AUTH.OIDC.GOOGLE.CALLBACK, {
      data: { email: 'test@example.com' },
    });
    const logout = mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);

    renderCallback(FRAGMENT);

    expect(await screen.findByText(OIDC.CALLBACK_ERROR)).toBeInTheDocument();
    await waitFor(() => expect(logout.calls).toHaveLength(1));
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
  });
});
