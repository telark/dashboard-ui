import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES, Endpoints } from '../../../../constants';
import { STORAGE_KEYS } from '../../../../constants/store/store';
import {
  clickButton,
  mockEmptyEndpoint,
  mockEndpoint,
  renderApp,
  currentLocation,
  findDialog,
  mockServerError,
} from '../../../../test';
import { buildUser } from '../../../../test/factories/users';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { inDays, signIn } from '../../../../test/helpers/session';
import type { SessionDetails } from '../../../auth/models/session';
import { AUTH_SUCCESS_MESSAGES } from '../../../auth/constants';
import { SECURITY_SECTION_CONSTANTS, SecuritySectionContent } from '.';

const { LABELS } = SECURITY_SECTION_CONSTANTS;
const user = buildUser();

const buildSession = (name: string, overrides: Partial<SessionDetails> = {}): SessionDetails => ({
  createdTimestamp: inDays(-1),
  expiresTimestamp: inDays(1),
  userId: user.id,
  metadata: { name },
  deviceMetadata: { browser: 'Chrome 130', device: 'MacIntel', os: 'macOS', userAgent: 'agent' },
  ...overrides,
});

const mockSessions = (
  sessions: SessionDetails[],
  current: SessionDetails | undefined = sessions[0],
) => ({
  list: mockEndpoint('exporter', Endpoints.SESSIONS.GET_ALL_BY_USER(user.id), {
    data: { items: sessions as never },
  }),
  self: mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, { data: current as never }),
});

const renderSecurity = () => renderApp(<SecuritySectionContent />);

const confirmRevoke = (actions: UserEvent) =>
  clickInDialog(actions, LABELS.REVOKE_CONFIRM_MODAL.OK);

const openRevokeOf = async (actions: UserEvent, index = 0) => {
  const revokes = await screen.findAllByRole('button', { name: LABELS.SESSIONS_REVOKE });
  await actions.click(revokes[index]);
};

const expectDialogSays = async (message: string) => {
  expect(within(await findDialog()).getByText(message)).toBeInTheDocument();
};

describe('active sessions', () => {
  beforeEach(() => void signIn(user));

  it('lists the sessions with this device first', async () => {
    const unnamedDevice = { deviceMetadata: undefined };
    const current = buildSession('session-current', unnamedDevice);
    mockSessions([buildSession('session-other', unnamedDevice), current], current);

    renderSecurity();

    const labels = await screen.findAllByText(
      new RegExp(`^(${LABELS.SESSIONS_THIS_DEVICE}|${LABELS.SESSIONS_OTHER_SESSION})$`),
    );
    expect(labels.map((label) => label.textContent)).toEqual([
      LABELS.SESSIONS_THIS_DEVICE,
      LABELS.SESSIONS_OTHER_SESSION,
    ]);
  });

  it('marks an expired session', async () => {
    mockSessions([buildSession('old', { expiresTimestamp: inDays(-1) })]);

    renderSecurity();

    expect(await screen.findByText(LABELS.SESSIONS_EXPIRED)).toBeInTheDocument();
  });

  it('falls back to this device when the list cannot be read', async () => {
    mockServerError('exporter', Endpoints.SESSIONS.GET_ALL_BY_USER(user.id));
    mockEndpoint('exporter', Endpoints.SESSIONS.GET_SELF, { data: buildSession('only') as never });

    renderSecurity();

    expect(await screen.findByText('Chrome')).toBeInTheDocument();
  });

  it('reports sessions it could not load', async () => {
    mockServerError('exporter', Endpoints.SESSIONS.GET_ALL_BY_USER(user.id));
    mockServerError('exporter', Endpoints.SESSIONS.GET_SELF);

    renderSecurity();

    expect(await screen.findByText(LABELS.SESSIONS_ERROR)).toBeInTheDocument();
  });

  it('says when no session is listed', async () => {
    mockSessions([], undefined);

    renderSecurity();

    expect(await screen.findByText(LABELS.ACTIVE_SESSIONS_EMPTY)).toBeInTheDocument();
  });

  it('revokes another session after confirming', async () => {
    const [current, other] = [buildSession('current'), buildSession('other')];
    const { list } = mockSessions([current, other], current);
    const remove = mockEmptyEndpoint('exporter', Endpoints.SESSIONS.DELETE_BY_NAME('other'));
    const { user: actions } = renderSecurity();

    await openRevokeOf(actions, 1);
    await expectDialogSays(LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_OTHER);
    await confirmRevoke(actions);

    expect(await screen.findByText(LABELS.SESSIONS_REVOKE_SUCCESS)).toBeInTheDocument();
    expect(remove.calls).toHaveLength(1);
    expect(list.calls.length).toBeGreaterThan(1);
  });

  it('reports a revocation the server refused', async () => {
    const [current, other] = [buildSession('current'), buildSession('other')];
    mockSessions([current, other], current);
    mockServerError('exporter', Endpoints.SESSIONS.DELETE_BY_NAME('other'));
    const { user: actions } = renderSecurity();

    await openRevokeOf(actions, 1);
    await confirmRevoke(actions);

    expect(await screen.findByText(LABELS.SESSIONS_REVOKE_ERROR)).toBeInTheDocument();
  });

  it('signs out when this device revokes its own session', async () => {
    const current = buildSession('current');
    mockSessions([current], current);
    const logout = mockEmptyEndpoint('auth', Endpoints.AUTH.LOGOUT);
    const { user: actions } = renderSecurity();

    await openRevokeOf(actions);
    await expectDialogSays(LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_CURRENT);
    await confirmRevoke(actions);

    expect(await screen.findByText(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS)).toBeInTheDocument();
    expect(logout.calls).toHaveLength(1);
    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
    expect(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)).toBeNull();
  });

  it('warns that the current session is unknown when its lookup fails', async () => {
    mockSessions([buildSession('some-session')], undefined);
    mockServerError('exporter', Endpoints.SESSIONS.GET_SELF);
    const { user: actions } = renderSecurity();

    await openRevokeOf(actions);

    await expectDialogSays(LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_UNKNOWN);
    await clickButton(actions, LABELS.REVOKE_CONFIRM_MODAL.CANCEL);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});
