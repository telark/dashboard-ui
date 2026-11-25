import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROLES_CONSTANTS as RC } from '../../../../features/access-and-permissions/roles/constants';
import { findRow } from '../../../../test/contracts/accessPage';
import { buildRole } from '../../../../test/factories/roles';
import { renderRoles } from '../../../../test/helpers/accessPages';

describe('slide-out panel frame', () => {
  it('opens as a modal dialog named by its title', async () => {
    const { user } = renderRoles([buildRole({ name: 'release_team' })]);
    await user.click(await findRow('release_team'));

    expect(
      await screen.findByRole('dialog', { name: RC.LABELS.PANELS.VIEW.TITLE }),
    ).toHaveAttribute('aria-modal', 'true');
  });
});
