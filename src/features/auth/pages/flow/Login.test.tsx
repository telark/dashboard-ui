import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES, AUTH_REFUSAL_CODES, Endpoints } from '../../../../constants';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import {
  clickButton,
  mockEndpoint,
  mockNetworkError,
  permissionsSeed,
  renderApp,
  type StoreSeed,
  currentLocation,
} from '../../../../test';
import { buildLoginStart } from '../../../../test/factories/auth';
import { buildUser } from '../../../../test/factories/users';
import { mockAuthConfig, mockMyPermissions } from '../../../../test/helpers/authApi';
import {
  findButtonBelowPasskeyWarning,
  installWebAuthn,
  removeWebAuthn,
  webAuthnError,
  type WebAuthnMock,
} from '../../../../test/helpers/webauthn';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import GoogleCallback from './GoogleCallback';
import Login from './Login';

const UI = LOGIN_CONSTANTS.UI;
const EMAIL = 'test@example.com';

const mockLoginEndpoints = () => {
  const user = buildUser();
  return {
    user,
    start: mockEndpoint<{ email: string }>('auth', Endpoints.AUTH.LOGIN.START, buildLoginStart()),
    finish: mockEndpoint<{ id: string }>('auth', Endpoints.AUTH.LOGIN.FINISH, {
      user: user as never,
    }),
    permissions: mockMyPermissions(user.id),
  };
};

const renderLogin = (seed: StoreSeed = {}) =>
  renderApp(<Login />, { route: APP_ROUTES.LOGIN, seed: { ...permissionsSeed(), ...seed } });

const submitEmail = async (user: UserEvent, email: string = EMAIL) => {
  await clickButton(user, UI.BUTTON_TEXT);
  await user.type(await screen.findByPlaceholderText(UI.EMAIL_PLACEHOLDER), email);
  await clickButton(user, UI.BUTTON_SUBMIT);
};

const status = (code: number, body: object = {}) => ({ code, body });
const SUSPENDED = status(403, { code: AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED, message: 'refused' });

describe('login page', () => {
  let webauthn: WebAuthnMock;

  beforeEach(() => {
    webauthn = installWebAuthn();
    mockAuthConfig();
  });

  it('signs in with a passkey and enters the app', async () => {
    const { start, finish, permissions, user: signedIn } = mockLoginEndpoints();
    const { user } = renderLogin();

    await submitEmail(user);

    expect(await screen.findByText(AUTH_SUCCESS_MESSAGES.LOGIN_SUCCESS)).toBeInTheDocument();
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
    expect(start.calls[0].body).toEqual({ email: EMAIL });
    expect(finish.calls[0].body.id).toBe('credential-id');
    expect(permissions.calls).toHaveLength(1);
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toContain(signedIn.id);
  });

  it('asks for an email before contacting the server', async () => {
    const { start } = mockLoginEndpoints();
    const { user } = renderLogin();
    await clickButton(user, UI.BUTTON_TEXT);

    await clickButton(user, UI.BUTTON_SUBMIT);

    expect(await screen.findByText(AUTH_ERROR_MESSAGES.MISSING_EMAIL)).toBeInTheDocument();
    expect(start.calls).toHaveLength(0);
  });

  it.each([
    ['an unknown account', status(404), LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND],
    [
      'an account without passkeys',
      status(400, { message: 'no passkeys found' }),
      LOGIN_CONSTANTS.MESSAGES.NO_PASSKEYS,
    ],
    ['a suspended account', SUSPENDED, LOGIN_CONSTANTS.MESSAGES.ACCOUNT_SUSPENDED],
    ['a server failure', status(500), LOGIN_CONSTANTS.MESSAGES.SERVER_ERROR],
  ])('explains %s in the card', async (_name, { code, body }, text) => {
    mockEndpoint('auth', Endpoints.AUTH.LOGIN.START, body as never, { status: code });
    const { user } = renderLogin();

    await submitEmail(user);

    expect(await screen.findByText(text)).toBeInTheDocument();
  });

  it('points to an administrator when self-registration is off', async () => {
    mockAuthConfig({ selfRegistrationEnabled: false });
    mockEndpoint('auth', Endpoints.AUTH.LOGIN.START, {}, { status: 404 });
    const { user } = renderLogin();
    await screen.findByText(UI.NO_SELF_REGISTRATION_FOOTER_TEXT);

    await submitEmail(user);

    expect(
      await screen.findByText(LOGIN_CONSTANTS.MESSAGES.USER_NOT_FOUND_NO_SELF_REGISTRATION),
    ).toBeInTheDocument();
  });

  it('offers registration when self-registration is on', async () => {
    const { user } = renderLogin();

    await user.click(await screen.findByText(UI.FOOTER_LINK));

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.REGISTER));
  });

  it('reports a network failure', async () => {
    mockNetworkError('auth', Endpoints.AUTH.LOGIN.START);
    const { user } = renderLogin();

    await submitEmail(user);

    expect(await screen.findByText(LOGIN_CONSTANTS.MESSAGES.NETWORK_ERROR)).toBeInTheDocument();
  });

  describe('when the browser cannot use the passkey', () => {
    const failPrompt = async (name: string) => {
      const { finish } = mockLoginEndpoints();
      webauthn.get.mockRejectedValueOnce(webAuthnError(name));
      const { user } = renderLogin();
      await submitEmail(user);
      return { user, finish };
    };
    const {
      TITLE: MODAL_TITLE,
      BUTTONS,
      NOT_FOUND_MESSAGE,
      GENERAL_MESSAGE,
    } = AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL;

    it.each([
      [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND, NOT_FOUND_MESSAGE],
      [LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED, GENERAL_MESSAGE],
    ])('offers to try again after %s', async (errorName, text) => {
      await failPrompt(errorName);

      expect(await screen.findByText(MODAL_TITLE)).toBeInTheDocument();
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it('retries the ceremony and signs in', async () => {
      const { user, finish } = await failPrompt(LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED);
      await screen.findByText(MODAL_TITLE);

      await clickButton(user, BUTTONS.RETRY);

      await waitFor(() => expect(finish.calls).toHaveLength(1));
      await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
    });

    it('tells a lost passkey to ask an administrator', async () => {
      const { user } = await failPrompt(LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND);
      await screen.findByText(MODAL_TITLE);

      await clickButton(user, BUTTONS.REMOVE);

      expect(await screen.findByText(LOGIN_CONSTANTS.MESSAGES.LOST_PASSKEY)).toBeInTheDocument();
    });

    it('shows other WebAuthn failures inline', async () => {
      await failPrompt(LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.INVALID_STATE);

      expect(
        await screen.findByText(LOGIN_CONSTANTS.WEBAUTHN.MESSAGES.OPERATION_NOT_ALLOWED),
      ).toBeInTheDocument();
    });
  });

  it('warns when passkeys are unavailable and keeps the passkey path closed', async () => {
    removeWebAuthn();

    renderLogin();

    expect(await findButtonBelowPasskeyWarning(UI.BUTTON_TEXT)).toBeDisabled();
  });

  it('redirects to Google once the provider is configured', async () => {
    mockAuthConfig({ oidcEnabled: true, googleClientID: 'client-id' });
    const nonce = mockEndpoint('auth', Endpoints.AUTH.OIDC.GOOGLE.NONCE, {
      data: { nonce: 'n-1' },
    });
    const { user } = renderLogin();

    await clickButton(user, new RegExp(UI.GOOGLE_BUTTON_TEXT));

    await waitFor(() => expect(nonce.calls).toHaveLength(1));
    expect(sessionStorage.getItem(LOGIN_CONSTANTS.OIDC.STATE_STORAGE_KEY)).toMatch(
      /^[0-9a-f]{64}$/,
    );
  });

  it('surfaces a refused Google sign-in returned by the callback', async () => {
    window.location.hash = '#id_token=token&state=matching';
    sessionStorage.setItem(LOGIN_CONSTANTS.OIDC.STATE_STORAGE_KEY, 'matching');
    mockEndpoint(
      'auth',
      Endpoints.AUTH.OIDC.GOOGLE.CALLBACK,
      { code: AUTH_REFUSAL_CODES.ACCOUNT_SUSPENDED },
      { status: 403 },
    );

    renderApp(
      <Routes>
        <Route path="/callback" element={<GoogleCallback />} />
        <Route path={APP_ROUTES.LOGIN} element={<Login />} />
      </Routes>,
      { route: '/callback' },
    );

    expect(await screen.findByText(LOGIN_CONSTANTS.MESSAGES.ACCOUNT_SUSPENDED)).toBeInTheDocument();
  });
});
