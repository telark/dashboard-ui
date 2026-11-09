import { screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints, HTTP_HEADERS } from '../../../../constants';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import {
  clickButton,
  mockEmptyEndpoint,
  mockEndpoint,
  renderApp,
  currentLocation,
} from '../../../../test';
import { buildRegisterStart } from '../../../../test/factories/auth';
import { mockAuthConfig } from '../../../../test/helpers/authApi';
import { signIn } from '../../../../test/helpers/session';
import {
  findButtonBelowPasskeyWarning,
  installWebAuthn,
  removeWebAuthn,
  webAuthnError,
  type WebAuthnMock,
} from '../../../../test/helpers/webauthn';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { REGISTER_CONSTANTS } from '../../constants/register';
import Register from './Register';

const UI = REGISTER_CONSTANTS.UI;
const EMAIL = 'test@example.com';
const DEVICE = 'release_laptop';
const REFUSED_LINK = { message: REGISTER_CONSTANTS.ERROR_PATTERNS.ENROLL_LINK_REFUSED };
const ENROLL_FIELDS = { [UI.DEVICE_NAME_PLACEHOLDER]: DEVICE };
const ALL_FIELDS = { [UI.EMAIL_PLACEHOLDER]: EMAIL, ...ENROLL_FIELDS };
const enrollRoute = `${APP_ROUTES.REGISTER}#${REGISTER_CONSTANTS.QUERY.ENROLL}=link-token&${REGISTER_CONSTANTS.QUERY.EMAIL}=${EMAIL}`;

const mockRegister = () => ({
  start: mockEndpoint<{ email: string; enrollToken?: string }>(
    'auth',
    Endpoints.AUTH.REGISTER.START,
    buildRegisterStart(),
  ),
  created: mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.CREATE, { id: 'passkey-1' }),
});

const renderRegister = (route: string = APP_ROUTES.REGISTER) => renderApp(<Register />, { route });

// The form's required asterisk is part of each label, so the fields are found by placeholder.
const submitDevice = async (user: UserEvent, fields: Record<string, string>) => {
  for (const [placeholder, value] of Object.entries(fields)) {
    await user.type(await screen.findByPlaceholderText(placeholder), value);
  }
  await clickButton(user, UI.BUTTON_TEXT);
};

describe('register page', () => {
  let webauthn: WebAuthnMock;

  beforeEach(() => {
    webauthn = installWebAuthn();
    mockAuthConfig();
  });

  it('registers a passkey and sends the user to sign in', async () => {
    const { start, created } = mockRegister();
    const { user } = renderRegister();

    await submitDevice(user, ALL_FIELDS);

    expect(await screen.findByText(AUTH_SUCCESS_MESSAGES.REGISTER_SUCCESS)).toBeInTheDocument();
    expect(start.calls[0].body).toEqual({ email: EMAIL });
    expect(created.calls[0].headers.get(HTTP_HEADERS.CUSTOM.DEVICE_NAME)).toBe(DEVICE);
    expect(webauthn.create).toHaveBeenCalledOnce();
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
  });

  it('requires both the email and a device name', async () => {
    const { start } = mockRegister();
    const { user } = renderRegister();

    await clickButton(user, UI.BUTTON_TEXT);

    expect(await screen.findByText(AUTH_ERROR_MESSAGES.MISSING_EMAIL)).toBeInTheDocument();
    expect(screen.getByText(AUTH_ERROR_MESSAGES.MISSING_DEVICE_NAME)).toBeInTheDocument();
    expect(start.calls).toHaveLength(0);
  });

  it('shows the server refusal as a toast', async () => {
    mockEndpoint(
      'auth',
      Endpoints.AUTH.REGISTER.START,
      { message: 'user already exists' },
      { status: 409 },
    );
    const { user } = renderRegister();

    await submitDevice(user, ALL_FIELDS);

    expect(await screen.findByText('user already exists')).toBeInTheDocument();
  });

  it('replaces the form when self-registration is off and offers the way back', async () => {
    mockAuthConfig({ selfRegistrationEnabled: false });
    const { user } = renderRegister();

    expect(await screen.findByText(UI.DISABLED_TITLE)).toBeInTheDocument();
    await clickButton(user, UI.BACK_TO_LOGIN);

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
  });

  it('warns and locks the form without a secure context', async () => {
    removeWebAuthn();

    renderRegister();

    expect(await findButtonBelowPasskeyWarning(UI.BUTTON_TEXT)).toBeDisabled();
  });

  describe('with an enrollment link', () => {
    it('hides the token from the address bar and enrolls the linked account', async () => {
      const { start } = mockRegister();
      const { user } = renderRegister(enrollRoute);

      expect(await screen.findByText(UI.ENROLL_TITLE)).toBeInTheDocument();
      expect(screen.getByText(EMAIL)).toBeInTheDocument();
      await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.REGISTER));
      await submitDevice(user, ENROLL_FIELDS);

      await waitFor(() => expect(start.calls[0]?.body.enrollToken).toBe('link-token'));
      await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
      expect(sessionStorage.getItem(REGISTER_CONSTANTS.ENROLL_STORAGE_KEY)).toBeNull();
    });

    it('explains a refused link and blocks further tries', async () => {
      mockEndpoint('auth', Endpoints.AUTH.REGISTER.START, REFUSED_LINK, { status: 401 });
      const { user } = renderRegister(enrollRoute);
      await screen.findByText(UI.ENROLL_TITLE);

      await submitDevice(user, ENROLL_FIELDS);

      expect(await screen.findByText(UI.ENROLL_LINK_INVALID)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(UI.BUTTON_TEXT) })).toBeDisabled();
    });

    it('allows retrying after the browser prompt is dismissed', async () => {
      mockRegister();
      webauthn.create.mockRejectedValueOnce(
        webAuthnError(LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_ALLOWED),
      );
      const { user } = renderRegister(enrollRoute);
      await screen.findByText(UI.ENROLL_TITLE);

      await submitDevice(user, ENROLL_FIELDS);

      expect(await screen.findByText(UI.ENROLL_RETRY)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: new RegExp(UI.BUTTON_TEXT) })).toBeEnabled();
    });

    it('asks a signed-in user to sign out first', async () => {
      signIn();
      const logout = mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);
      const { user } = renderRegister(enrollRoute);

      expect(await screen.findByText(UI.ENROLL_SIGNED_IN)).toBeInTheDocument();
      await clickButton(user, UI.SIGN_OUT);

      await waitFor(() => expect(logout.calls).toHaveLength(1));
      await waitFor(() => expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull());
      await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.REGISTER));
    });

    it('sends a signed-in user back to the dashboard when asked', async () => {
      signIn();
      const { user } = renderRegister(enrollRoute);

      await clickButton(user, UI.BACK_TO_DASHBOARD);

      await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.HOME));
    });
  });
});
