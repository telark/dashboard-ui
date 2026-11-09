import type React from 'react';
import { screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Endpoints } from '../../../../../constants';
import { mockEmptyLists, mockList, renderApp } from '../../../../../test';
import {
  describeAssignmentPanel,
  renderAssignmentPanel,
} from '../../../../../test/contracts/assignmentPanel';
import { buildGroup } from '../../../../../test/factories/groups';
import { buildRole } from '../../../../../test/factories/roles';
import { buildUser } from '../../../../../test/factories/users';
import { CapitalizeFirstLetter } from '../../../../../utils/helpers/format';
import type { Group } from '../../../groups/models';
import type { Role } from '../../../roles/models';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { User } from '../../models';
import ManageUserGroupPanel from './group/ManageUserGroupPanel';
import ManageUserRolePanel from './role/ManageUserRolePanel';

const L = UC.LABELS;

const renderManagePanel = (
  holder: User,
  field: 'roleRefs' | 'groupRefs',
  freshIds: string[] | undefined,
  panel: (onClose: () => void) => React.ReactElement,
) =>
  renderAssignmentPanel(
    { get: Endpoints.USERS.GET_BY_ID(holder.id), patch: Endpoints.USERS.PATCH_BY_ID(holder.id) },
    holder,
    { field, freshIds },
    panel,
  );

describeAssignmentPanel<Role>({
  feature: 'user roles',
  build: () => buildRole({ scopesAndPermissions: [{ scope: 'groups', level: 'ReadOnly' }] }),
  itemName: (role) => CapitalizeFirstLetter(role.name),
  field: 'roleRefs',
  submit: L.PANELS.MANAGE_ROLE.SUBMIT_BUTTON,
  assignedToggle: L.PANELS.MANAGE_ROLE.SHOW_ASSIGNED_BUTTON,
  searchPlaceholder: L.PANELS.MANAGE_ROLE.SEARCH_PLACEHOLDER,
  removeLabel: 'Remove role',
  removeDialog: L.ACTIONS.DEASSIGN_ROLE_MODAL_TITLE,
  removeConfirm: L.ACTIONS.DEASSIGN_ROLE_MODAL_CONFIRM,
  savedToast: L.MESSAGES.ROLE_ASSIGNED('Sre Oncall'),
  saveFailed: L.MESSAGES.ROLE_ASSIGN_FAILED,
  removedToast: (role) => L.MESSAGES.ROLE_DEASSIGNED(role.name),
  render: ({ assigned, available, freshIds }) => {
    const holder = buildUser({ roleRefs: assigned.map((role) => role.id), fullname: 'Sre Oncall' });
    mockEmptyLists('exporter', [
      Endpoints.GROUPS.GET_ALL,
      Endpoints.CATEGORIES.GET_BY_SCOPE('roles'),
    ]);
    mockList('exporter', Endpoints.ROLES.GET_ALL, available);
    return renderManagePanel(holder, 'roleRefs', freshIds, (onClose) => (
      <ManageUserRolePanel open onClose={onClose} user={holder} />
    ));
  },
});

describeAssignmentPanel<Group>({
  feature: 'user groups',
  build: buildGroup,
  itemName: (group) => CapitalizeFirstLetter(group.name),
  field: 'groupRefs',
  submit: L.PANELS.MANAGE_GROUP.SUBMIT_BUTTON,
  assignedToggle: L.PANELS.MANAGE_GROUP.SHOW_ASSIGNED_BUTTON,
  searchPlaceholder: L.PANELS.MANAGE_GROUP.SEARCH_PLACEHOLDER,
  removeLabel: 'Remove group',
  removeDialog: L.ACTIONS.DEASSIGN_GROUP_MODAL_TITLE,
  removeConfirm: L.ACTIONS.DEASSIGN_GROUP_MODAL_CONFIRM,
  savedToast: L.MESSAGES.GROUP_ASSIGNED('Sre Oncall'),
  saveFailed: L.MESSAGES.GROUP_ASSIGN_FAILED,
  removedToast: (group) => L.MESSAGES.GROUP_DEASSIGNED(group.name),
  render: ({ assigned, available, freshIds }) => {
    const holder = buildUser({
      groupRefs: assigned.map((group) => group.id),
      fullname: 'Sre Oncall',
    });
    mockEmptyLists('exporter', [Endpoints.ROLES.GET_ALL]);
    mockList('exporter', Endpoints.GROUPS.GET_ALL, available);
    return renderManagePanel(holder, 'groupRefs', freshIds, (onClose) => (
      <ManageUserGroupPanel open onClose={onClose} user={holder} />
    ));
  },
});

it('opens no group panel without a user', () => {
  mockEmptyLists('exporter', [Endpoints.ROLES.GET_ALL, Endpoints.GROUPS.GET_ALL]);

  renderApp(<ManageUserGroupPanel open onClose={vi.fn()} user={null} />);

  expect(screen.queryByText(L.PANELS.MANAGE_GROUP.TITLE)).not.toBeInTheDocument();
});
