import { screen, within } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { BUTTON_TEXTS, Endpoints } from '../../../../constants';
import {
  clickButton,
  fillFields,
  mockEmptyLists,
  mockEndpoint,
  renderApp,
  findDialog,
  mockServerError,
} from '../../../../test';
import { findPanel, waitForPanelClose } from '../../../../test/helpers/panel';
import { signIn } from '../../../../test/helpers/session';
import { USERS_CONSTANTS } from '../../../access-and-permissions/users/constants';
import type { User } from '../../../access-and-permissions/users/models';
import { PROFILE_SECTION_CONSTANTS, ProfileSectionContent } from '.';

const { LABELS } = PROFILE_SECTION_CONSTANTS;
const PANEL = LABELS.EDIT_PROFILE_PANEL;

const arrange = (overrides: Partial<User> = {}) => {
  const account = signIn({ fullname: 'Release Lead', username: 'release_lead', ...overrides });
  mockEndpoint('exporter', Endpoints.USERS.GET_BY_ID(account.id), { data: account as never });
  mockEmptyLists('exporter', [Endpoints.USERS.GET_ALL]);
  return { account, ...renderApp(<ProfileSectionContent />) };
};

const openEdit = async (user: UserEvent) => {
  await screen.findByText(LABELS.PROFILE_DETAILS_CARD_TITLE);
  await clickButton(user, LABELS.EDIT);
  return findPanel();
};

describe('profile settings', () => {
  it('shows the account details from the server', async () => {
    const { account } = arrange({
      status: { phase: 'active', lastLoginAt: '2026-01-15T10:00:00Z' } as never,
    });

    expect(await screen.findByText(account.username)).toBeInTheDocument();
    expect(screen.getByText(account.email)).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('sends only the fields that changed', async () => {
    const { account, user } = arrange();
    const save = mockEndpoint<Partial<User>>('exporter', Endpoints.USERS.PATCH_BY_ID(account.id), {
      data: { ...account, fullname: 'Release Manager' } as never,
    });

    await openEdit(user);
    expect(await screen.findByLabelText(PANEL.FULLNAME_LABEL)).toHaveValue(account.fullname);
    await fillFields(user, { [PANEL.FULLNAME_LABEL]: 'Release Manager' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    expect(await screen.findByText(PANEL.SUCCESS)).toBeInTheDocument();
    expect(save.calls[0].body).toEqual({ fullname: 'Release Manager' });
    await waitForPanelClose();
  });

  it('keeps Save off until a field changes', async () => {
    const { user } = arrange();

    await openEdit(user);

    await screen.findByLabelText(PANEL.FULLNAME_LABEL);
    expect(
      screen.getByRole('button', { name: new RegExp(BUTTON_TEXTS.SAVE_CHANGES) }),
    ).toBeDisabled();
  });

  it.each([
    [
      'an email that is taken',
      409,
      'user with this email already exists',
      USERS_CONSTANTS.LABELS.VALIDATION.EMAIL_TAKEN,
    ],
    ['the reserved bootstrap email', 403, 'email is reserved', PANEL.EMAIL_RESERVED],
  ])(
    'puts %s on the email field and keeps the panel open',
    async (_name, status, serverMessage, fieldMessage) => {
      const { account, user } = arrange();
      mockEndpoint(
        'exporter',
        Endpoints.USERS.PATCH_BY_ID(account.id),
        { message: serverMessage },
        { status },
      );

      await openEdit(user);
      await fillFields(user, { [PANEL.EMAIL_LABEL]: 'other@example.com' });
      await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

      expect(await screen.findByText(fieldMessage)).toBeInTheDocument();
      expect(screen.getByLabelText(PANEL.EMAIL_LABEL)).toBeInTheDocument();
    },
  );

  it('reports any other save failure', async () => {
    const { account, user } = arrange();
    mockServerError('exporter', Endpoints.USERS.PATCH_BY_ID(account.id));

    await openEdit(user);
    await fillFields(user, { [PANEL.FULLNAME_LABEL]: 'Release Manager' });
    await clickButton(user, BUTTON_TEXTS.SAVE_CHANGES);

    expect(await screen.findByText(PANEL.ERROR)).toBeInTheDocument();
  });

  it('locks the email of the bootstrap administrator', async () => {
    const { user } = arrange({ bootstrap: true });

    await openEdit(user);

    expect(await screen.findByLabelText(PANEL.EMAIL_LABEL)).toBeDisabled();
  });

  describe('profile photo', () => {
    const pickAvatar = async (user: UserEvent) => {
      await screen.findByText(LABELS.PROFILE_PHOTO_CARD_TITLE);
      await clickButton(user, 'Change profile photo');
      const dialog = within(await findDialog());
      const [firstLorelei] = await dialog.findAllByRole('button', {
        name: 'Select lorelei avatar style',
      });
      await user.click(firstLorelei);
      await user.click(dialog.getByRole('button', { name: 'Update' }));
    };

    it('saves the chosen avatar', async () => {
      const { account, user } = arrange();
      const save = mockEndpoint<Partial<User>>(
        'exporter',
        Endpoints.USERS.PATCH_BY_ID(account.id),
        {
          data: account as never,
        },
      );

      await pickAvatar(user);

      expect(await screen.findByText(LABELS.AVATAR_UPDATE_SUCCESS)).toBeInTheDocument();
      expect(save.calls[0].body).toEqual({ avatar: expect.objectContaining({ style: 'lorelei' }) });
    });

    it('reports an avatar it could not save', async () => {
      const { account, user } = arrange();
      mockServerError('exporter', Endpoints.USERS.PATCH_BY_ID(account.id));

      await pickAvatar(user);

      expect(await screen.findByText(LABELS.AVATAR_UPDATE_ERROR)).toBeInTheDocument();
    });
  });
});
