import { screen, waitFor, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../../constants';
import {
  clickButton,
  describeListPage,
  fillFields,
  findDialog,
  mockEmptyEndpoint,
  mockEndpoint,
  mockNetworkError,
  renderApp,
  searchList,
  mockServerError,
} from '../../../../test';
import { buildPasskey, buildRegisterStart } from '../../../../test/factories/auth';
import { clickInDialog } from '../../../../test/helpers/dialogs';
import { findPanel, waitForPanelClose } from '../../../../test/helpers/panel';
import { signIn } from '../../../../test/helpers/session';
import {
  findButtonBelowPasskeyWarning,
  installWebAuthn,
  removeWebAuthn,
} from '../../../../test/helpers/webauthn';
import { PASSKEYS_CONSTANTS as PPC } from '../../constants/passkeys';
import type { Passkey } from '../../models';
import MainPage from './MainPage';

const { LABELS, FORM, ENROLL } = PPC;

const mockPasskeys = (passkeys: Passkey[]) =>
  mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.GET_ALL, passkeys as never);

const setUp = async (passkeys: Passkey[] = [buildPasskey()]) => {
  mockPasskeys(passkeys);
  const view = renderApp(<MainPage />);
  await screen.findByText(passkeys[0].deviceName);
  return { ...view, passkey: passkeys[0] };
};

const fillNewPasskey = async (user: UserEvent, deviceName: string) => {
  await clickButton(user, LABELS.CREATE_BUTTON);
  await findPanel();
  await fillFields(user, { [FORM.DEVICE_NAME_LABEL]: deviceName });
};

describeListPage<Passkey>({
  feature: 'passkeys',
  page: <MainPage />,
  build: buildPasskey,
  label: (passkey) => passkey.deviceName,
  mockList: (passkeys) => void mockPasskeys(passkeys),
  failList: () => mockNetworkError('auth', Endpoints.AUTH.PASSKEYS.GET_ALL),
  emptyTitle: LABELS.EMPTY.TITLE,
});

describe('passkeys page', () => {
  beforeEach(() => {
    installWebAuthn();
    signIn();
  });

  it('searches passkeys by name', async () => {
    const [kept, dropped] = [
      buildPasskey({ deviceName: 'alpha' }),
      buildPasskey({ deviceName: 'beta' }),
    ];
    const { user } = await setUp([kept, dropped]);

    await searchList(user, PPC.TOOLBAR.SEARCH_PLACEHOLDER, 'alp');

    await waitFor(() => expect(screen.queryByText(dropped.deviceName)).not.toBeInTheDocument());
    expect(screen.getByText(kept.deviceName)).toBeInTheDocument();
  });

  it('says so when a search matches nothing', async () => {
    const { user } = await setUp();

    await searchList(user, PPC.TOOLBAR.SEARCH_PLACEHOLDER, 'zzz');

    expect(await screen.findByText('No passkeys match your search.')).toBeInTheDocument();
  });

  it('registers a new passkey through the panel and shows it on the list', async () => {
    const { user } = await setUp();
    mockEndpoint('auth', Endpoints.AUTH.REGISTER.START, buildRegisterStart());
    const created = mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.CREATE, {
      ...buildPasskey({ deviceName: 'new_device' }),
    });

    await fillNewPasskey(user, 'new_device');
    await clickButton(user, FORM.BUTTON_TEXT);

    expect(await screen.findByText(LABELS.MESSAGES.CREATED('new_device'))).toBeInTheDocument();
    expect(created.calls).toHaveLength(1);
    await waitForPanelClose();
  });

  it('refuses a duplicate device name', async () => {
    const { user, passkey } = await setUp();

    await fillNewPasskey(user, passkey.deviceName);

    expect(await screen.findByText(FORM.DEVICE_NAME_DUPLICATE)).toBeInTheDocument();
  });

  it('reports a passkey the server refused to save', async () => {
    const { user } = await setUp();
    mockEndpoint('auth', Endpoints.AUTH.REGISTER.START, buildRegisterStart());
    mockEndpoint(
      'auth',
      Endpoints.AUTH.PASSKEYS.CREATE,
      { message: 'quota exceeded' },
      { status: 422 },
    );

    await fillNewPasskey(user, 'other_device');
    await clickButton(user, FORM.BUTTON_TEXT);

    expect(await screen.findByText('quota exceeded')).toBeInTheDocument();
  });

  it('renames a passkey', async () => {
    const { user, passkey } = await setUp();
    const update = mockEndpoint<{ deviceName: string }>(
      'auth',
      Endpoints.AUTH.PASSKEYS.UPDATE(passkey.credentialId),
      { ...passkey, deviceName: 'renamed' },
    );

    await clickButton(user, /edit/i);
    await findPanel();
    await fillFields(user, { [FORM.DEVICE_NAME_LABEL]: 'renamed' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    expect(await screen.findByText(LABELS.MESSAGES.UPDATED('renamed'))).toBeInTheDocument();
    expect(update.calls[0].body).toEqual({ deviceName: 'renamed' });
  });

  it('asks before deleting, and deletes on confirmation', async () => {
    const first = buildPasskey({ creationTimestamp: '2026-01-10T10:00:00Z' });
    const second = buildPasskey({ creationTimestamp: '2026-01-11T10:00:00Z' });
    const { user } = await setUp([first, second]);
    const remove = mockEmptyEndpoint('auth', Endpoints.AUTH.PASSKEYS.DELETE(second.credentialId));

    const [firstDelete] = screen.getAllByRole('button', { name: /delete/i });
    await user.click(firstDelete);
    await clickInDialog(user, LABELS.DELETE_MODAL_OK);

    expect(await screen.findByText(LABELS.MESSAGES.DELETED(second.deviceName))).toBeInTheDocument();
    expect(remove.calls[0].body).toEqual({ forceLastDelete: false });
  });

  it('warns before deleting the last passkey and forces it through', async () => {
    const { user, passkey } = await setUp();
    const remove = mockEmptyEndpoint('auth', Endpoints.AUTH.PASSKEYS.DELETE(passkey.credentialId));

    await clickButton(user, /delete/i);
    const dialog = within(await findDialog());
    expect(dialog.getByText(LABELS.FORCE_DELETE_MODAL_TITLE)).toBeInTheDocument();
    await clickInDialog(user, LABELS.FORCE_DELETE_MODAL_OK);

    await waitFor(() => expect(remove.calls[0]?.body).toEqual({ forceLastDelete: true }));
  });

  it('reports a delete the server refused', async () => {
    const { user, passkey } = await setUp();
    mockEndpoint(
      'auth',
      Endpoints.AUTH.PASSKEYS.DELETE(passkey.credentialId),
      { message: 'kept by policy' },
      { status: 409 },
    );

    await clickButton(user, /delete/i);
    await clickInDialog(user, LABELS.FORCE_DELETE_MODAL_OK);

    expect(await screen.findByText('kept by policy')).toBeInTheDocument();
  });

  it('copies an enrollment link for another device', async () => {
    const { user } = await setUp();
    mockEndpoint('auth', Endpoints.AUTH.PASSKEYS.ENROLL_LINK, { token: 'tok', expiresAt: '' });

    await clickButton(user, new RegExp(ENROLL.BUTTON));
    await clickInDialog(user, ENROLL.COPY);

    expect(await screen.findByText(ENROLL.COPIED)).toBeInTheDocument();
    await expect(navigator.clipboard.readText()).resolves.toContain('enroll=tok');
  });

  it('reports an enrollment link it could not create', async () => {
    const { user } = await setUp();
    mockServerError('auth', Endpoints.AUTH.PASSKEYS.ENROLL_LINK);

    await clickButton(user, new RegExp(ENROLL.BUTTON));

    expect(await screen.findByText(ENROLL.CREATE_FAILED)).toBeInTheDocument();
  });

  it('warns and disables registration without a secure context', async () => {
    removeWebAuthn();

    await setUp();

    expect(await findButtonBelowPasskeyWarning(LABELS.CREATE_BUTTON)).toBeDisabled();
  });
});
