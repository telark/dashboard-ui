import { within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { currentLocation } from '../../../../test';
import { findRow } from '../../../../test/contracts/accessPage';
import { buildGroup } from '../../../../test/factories/groups';
import { buildRole } from '../../../../test/factories/roles';
import { pickMenuItem } from '../../../../test/helpers/accessForms';
import { renderGroups, renderRoles } from '../../../../test/helpers/accessPages';
import { findPanel } from '../../../../test/helpers/panel';
import { GROUPS_CONSTANTS as GC } from '../../groups/constants';
import { ROLES_CONSTANTS as RC } from '../../roles/constants';
import { CATEGORIES_CONSTANTS as CC } from '../constants';
import { categoriesPageRoute } from '../utils';

const MANAGE = CC.LABELS.TOOLBAR.MANAGE_CATEGORIES;

const PAGES = [
  {
    page: 'Groups',
    scope: CC.SCOPES.GROUPS,
    more: GC.LABELS.TOOLBAR.MORE,
    render: () => renderGroups([buildGroup({ name: 'listed_item' })]),
  },
  {
    page: 'Roles',
    scope: CC.SCOPES.ROLES,
    more: RC.LABELS.TOOLBAR.MORE,
    render: () => renderRoles([buildRole({ name: 'listed_item' })]),
  },
];

describe.each(PAGES)('$page toolbar categories', ({ scope, more, render }) => {
  it('opens its type on the categories page', async () => {
    const { user } = render();
    await findRow(/listed_item/);

    await pickMenuItem(user, more, MANAGE.VIEW_CATEGORIES);

    expect(currentLocation()).toBe(categoriesPageRoute(scope));
  });

  it('still creates a category in place', async () => {
    const { user } = render();
    await findRow(/listed_item/);

    await pickMenuItem(user, more, MANAGE.ADD_CATEGORY);

    expect(
      await within(await findPanel()).findByLabelText(CC.LABELS.PANELS.ADD_CATEGORY.NAME_LABEL),
    ).toHaveValue('');
  });
});
