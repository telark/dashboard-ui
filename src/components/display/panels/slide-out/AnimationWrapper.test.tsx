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

  it('is an open native dialog that undoes the browser dialog box', async () => {
    const { user } = renderRoles([buildRole({ name: 'release_team' })]);
    await user.click(await findRow('release_team'));

    const frame = await screen.findByRole('dialog', { name: RC.LABELS.PANELS.VIEW.TITLE });

    expect(frame.tagName).toBe('DIALOG');
    expect(frame).toHaveAttribute('open');
    const { left, height, margin, padding, borderTopStyle, borderLeftStyle, color } = frame.style;
    expect({ left, height, margin, padding, borderTopStyle, borderLeftStyle, color }).toEqual({
      left: 'auto',
      height: 'auto',
      margin: '0px',
      padding: '0px',
      borderTopStyle: 'none',
      borderLeftStyle: 'none',
      color: 'inherit',
    });
  });
});
