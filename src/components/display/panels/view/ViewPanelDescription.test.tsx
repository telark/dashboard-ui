import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { VIEW } from '../../../../constants';
import { findRow } from '../../../../test/contracts/accessPage';
import { buildGroup } from '../../../../test/factories/groups';
import { buildRole } from '../../../../test/factories/roles';
import { renderGroups, renderRoles } from '../../../../test/helpers/accessPages';
import { findPanel } from '../../../../test/helpers/panel';

const LONG = `${'Keeps the release windows. '.repeat(4)}Ends here.`;

describe.each([
  ['group', () => renderGroups([buildGroup({ name: 'release_team', description: LONG })])],
  ['role', () => renderRoles([buildRole({ name: 'release_team', description: LONG })])],
])('the %s view panel description', (_, render) => {
  it('shows the first characters, then all of them on Show more', async () => {
    const { user } = render();
    await user.click(await findRow('release_team'));
    const panel = within(await findPanel());

    expect(panel.queryByText(/Ends here\./)).not.toBeInTheDocument();
    await user.click(panel.getByRole('button', { name: VIEW.SHOW_MORE }));

    expect(panel.getByText(/Ends here\./)).toBeInTheDocument();
    expect(panel.getByRole('button', { name: VIEW.SHOW_LESS })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
