import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AUTH_REFUSAL_CODES, Endpoints } from '../../../../../constants';
import { mockEndpoint, mockNetworkError } from '../../../../../test';
import { confirmDialog } from '../../../../../test/contracts/accessPage';
import { buildUser } from '../../../../../test/factories/users';
import { pickMenuItem } from '../../../../../test/helpers/accessForms';
import { renderUserRow } from '../../../../../test/helpers/accessPages';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { User } from '../../models';

const E = UC.LABELS.ENROLL_LINK;

describe('enrollment links', () => {
  const openMenu = async (target: User) => {
    const view = await renderUserRow(target);
    await pickMenuItem(view.user, E.MENU, E.CREATE);
    return view;
  };

  const invitedUser = () =>
    buildUser({
      status: { phase: 'active', invite: { issuedAt: '2026-01-01', expiresAt: '2026-02-01' } },
    });

  const revokeLink = async (target: User) => {
    const { user } = await renderUserRow(target);
    await pickMenuItem(user, E.MENU, E.REVOKE);
    await confirmDialog(user, E.REVOKE, E.REVOKE_CONFIRM);
  };

  it('creates a link and shows it once', async () => {
    const target = buildUser();
    mockEndpoint('auth', Endpoints.USERS.CREATE_ENROLL_LINK(target.id), {
      token: 'token-1',
      expiresAt: '2026-06-01T00:00:00Z',
    });
    await openMenu(target);

    expect(await screen.findByText(E.MODAL_TITLE)).toBeInTheDocument();
    expect(await screen.findByText(/token-1/)).toBeInTheDocument();
  });

  it.each([
    [404, undefined, E.REFUSED.NOT_FOUND],
    [409, undefined, E.REFUSED.SUSPENDED],
    [410, undefined, E.REFUSED.DELETING],
    [403, AUTH_REFUSAL_CODES.ENROLL_LINK_RECOVERY, E.REFUSED.RECOVERY],
    [403, 'other', 'Refused by a level cap'],
  ])('explains a %i refusal (%s)', async (status, code, message) => {
    const target = buildUser();
    mockEndpoint(
      'auth',
      Endpoints.USERS.CREATE_ENROLL_LINK(target.id),
      { message: 'Refused by a level cap', code },
      { status },
    );

    await openMenu(target);

    expect(await screen.findByText(message)).toBeInTheDocument();
  });

  it('falls back on a failure with no explanation', async () => {
    const target = buildUser();
    mockNetworkError('auth', Endpoints.USERS.CREATE_ENROLL_LINK(target.id));

    await openMenu(target);

    expect(await screen.findByText(E.CREATE_FAILED)).toBeInTheDocument();
  });

  it('revokes a pending link after the confirmation', async () => {
    const target = invitedUser();
    const revoked = mockEndpoint('auth', Endpoints.USERS.REVOKE_ENROLL_LINK(target.id), {});

    await revokeLink(target);

    expect(await screen.findByText(E.REVOKED)).toBeInTheDocument();
    expect(revoked.calls).toHaveLength(1);
  });

  it('reports a failed revoke', async () => {
    const target = invitedUser();
    mockNetworkError('auth', Endpoints.USERS.REVOKE_ENROLL_LINK(target.id));

    await revokeLink(target);

    expect(await screen.findByText(E.REVOKE_FAILED)).toBeInTheDocument();
  });
});
