import { act, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { USERS_CONSTANTS as UC } from '../../../features/access-and-permissions/users/constants';
import { findRow } from '../../../test/contracts/accessPage';
import { buildUser } from '../../../test/factories/users';
import { renderUsers } from '../../../test/helpers/accessPages';

describe('sortable column header', () => {
  it('sorts from the keyboard and keeps focus', async () => {
    const [first, second] = [buildUser({ username: 'b_user' }), buildUser({ username: 'a_user' })];
    const { user } = renderUsers([first, second]);
    await findRow(first.username);

    act(() =>
      within(screen.getAllByRole('row')[0])
        .getByRole('button', { name: UC.LABELS.COLUMNS.USERNAME })
        .focus(),
    );
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getAllByRole('row')[1]).toHaveTextContent('a_user'));

    // The header keeps focus, so a second press reverses the order.
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.getAllByRole('row')[1]).toHaveTextContent('b_user'));
  });
});
