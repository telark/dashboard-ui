import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, afterEach } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../constants';
import {
  clickButton,
  currentLocation,
  mockEndpoint,
  renderApp,
  mockServerError,
} from '../../../test';
import { installWebAuthn, removeWebAuthn, type WebAuthnMock } from '../../../test/helpers/webauthn';
import { AUTH_ERROR_MESSAGES } from '../../auth/constants';
import { BOOTSTRAP_CONSTANTS as C, BOOTSTRAP_TEXTS as T } from '../constants/bootstrap';
import type { BootstrapAction } from '../models/bootstrap';
import BreakGlass from './BreakGlass';

const REQUEST = 'req-1';
const route = (kind?: string) =>
  `${APP_ROUTES.BREAK_GLASS}#${C.FRAGMENT_REQUEST}=${REQUEST}${kind ? `&${C.FRAGMENT_KIND}=${kind}` : ''}`;

const mockCeremony = (action: BootstrapAction) => {
  mockEndpoint('auth', Endpoints.BOOTSTRAP.ASSERT_START(REQUEST), {
    options: { publicKey: { challenge: 'Y2hhbGxlbmdl', allowCredentials: [] } },
  });
  return mockEndpoint('auth', Endpoints.BOOTSTRAP.ASSERT_FINISH(REQUEST), {
    request: { id: REQUEST, state: action === 'approve' ? 'approved' : 'canceled' },
    eligible: true,
    enrolled: true,
  });
};

describe('break-glass page', () => {
  let webauthn: WebAuthnMock;
  afterEach(() => removeWebAuthn());

  const setup = (at = route()) => {
    webauthn = installWebAuthn();
    return renderApp(<BreakGlass />, { route: at });
  };

  it('explains how to open the page without a request', () => {
    setup(APP_ROUTES.BREAK_GLASS);

    expect(screen.getByText(T.PAGE_NO_REQUEST)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: T.APPROVE })).not.toBeInTheDocument();
  });

  it('drops the link from the address bar and keeps the request', async () => {
    setup();

    expect(await screen.findByText(T.PAGE_SUBTITLE)).toBeInTheDocument();
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.BREAK_GLASS));
    expect(screen.getByRole('button', { name: T.APPROVE })).toBeInTheDocument();
  });

  it.each<[BootstrapAction, string, string]>([
    ['approve', T.APPROVE, T.PAGE_APPROVED],
    ['deny', T.DENY, T.PAGE_DENIED],
  ])('records a %s with a fresh passkey', async (action, button, outcome) => {
    const finished = mockCeremony(action);
    const { user } = setup();

    await clickButton(user, button);

    expect(await screen.findByText(outcome)).toBeInTheDocument();
    expect(webauthn.get).toHaveBeenCalledOnce();
    expect(finished.calls[0].body).toMatchObject({ action });
  });

  it('only allows a recovery to be denied', async () => {
    setup(route(C.KIND_RECOVER));

    expect(await screen.findByText(T.PAGE_WARNING_RECOVER)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: T.APPROVE })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('button', { name: T.DENY })).toHaveAttribute('aria-disabled', 'false');
  });

  it('shows why the buttons are off without passkey support', async () => {
    removeWebAuthn();
    renderApp(<BreakGlass />, { route: route() });

    expect(
      await screen.findByText(AUTH_ERROR_MESSAGES.PASSKEYS_INSECURE_CONTEXT.TITLE),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: T.DENY })).toHaveAttribute('aria-disabled', 'true');
  });

  it('gives way to the reason when the request is closed', async () => {
    mockEndpoint(
      'auth',
      Endpoints.BOOTSTRAP.ASSERT_START(REQUEST),
      { message: 'already decided' },
      { status: 409 },
    );
    const { user } = setup();

    await clickButton(user, T.DENY);

    expect(await screen.findByText('Already decided')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: T.DENY })).not.toBeInTheDocument();
  });

  it('reports any other failure and keeps the buttons', async () => {
    mockServerError('auth', Endpoints.BOOTSTRAP.ASSERT_START(REQUEST), { message: 'nope' });
    const { user } = setup();

    await clickButton(user, T.APPROVE);

    expect(await screen.findByText('nope')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: T.APPROVE })).toBeEnabled();
  });
});
