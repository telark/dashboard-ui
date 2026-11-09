import type React from 'react';
import { screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Endpoints } from '../../../../constants';
import { mockEmptyLists, permissionsSeed, mockList, renderApp } from '../../../../test';
import {
  describeAssignmentPanel,
  renderAssignmentPanel,
} from '../../../../test/contracts/assignmentPanel';
import { buildGroup } from '../../../../test/factories/groups';
import { buildRole } from '../../../../test/factories/roles';
import { buildUser } from '../../../../test/factories/users';
import { CapitalizeFirstLetter } from '../../../../utils/helpers/format';
import type { Role } from '../../roles/models';
import type { User } from '../../users/models';
import { GROUPS_CONSTANTS as GC } from '../constants';
import type { Group } from '../models';
import AttachMemberPanel from './member/AttachMemberPanel';
import AttachRolePanel from './role/AttachRolePanel';

const L = GC.LABELS;

const renderAttachPanel = (
  group: Group,
  field: 'roleRefs' | 'userRefs',
  freshIds: string[] | undefined,
  panel: (onClose: () => void) => React.ReactElement,
) =>
  renderAssignmentPanel(
    { get: Endpoints.GROUPS.GET_BY_ID(group.id), patch: Endpoints.GROUPS.PATCH_BY_ID(group.id) },
    group,
    { field, freshIds },
    panel,
    { ...permissionsSeed(), groups: { groups: [group], loaded: true } },
  );

describeAssignmentPanel<Role>({
  feature: 'group roles',
  build: () => buildRole({ scopesAndPermissions: [{ scope: 'groups', level: 'ReadOnly' }] }),
  itemName: (role) => CapitalizeFirstLetter(role.name),
  field: 'roleRefs',
  submit: L.PANELS.ATTACH_ROLES.SUBMIT_BUTTON,
  assignedToggle: L.PANELS.ATTACH_ROLES.SHOW_ASSIGNED_BUTTON,
  searchPlaceholder: 'Search roles by name or description...',
  removeLabel: 'Remove role',
  removeDialog: L.ACTIONS.DEASSIGN_ROLE_MODAL_TITLE,
  removeConfirm: L.ACTIONS.DEASSIGN_ROLE_MODAL_CONFIRM,
  saveFailed: L.MESSAGES.UPDATE_FAILED,
  removedToast: (role) => L.MESSAGES.ROLE_DEASSIGNED(role.name),
  render: ({ assigned, available, freshIds }) => {
    const group = buildGroup({ roleRefs: assigned.map((role) => role.id) });
    mockEmptyLists('exporter', [Endpoints.CATEGORIES.GET_BY_SCOPE('roles')]);
    mockList('exporter', Endpoints.ROLES.GET_ALL, available);
    return renderAttachPanel(group, 'roleRefs', freshIds, (onClose) => (
      <AttachRolePanel open onClose={onClose} group={group} />
    ));
  },
});

describeAssignmentPanel<User>({
  feature: 'group members',
  build: buildUser,
  itemName: (user) => user.username,
  field: 'userRefs',
  submit: L.PANELS.ASSIGN_MEMBERS.SUBMIT_BUTTON,
  assignedToggle: L.PANELS.ASSIGN_MEMBERS.SHOW_ASSIGNED_BUTTON,
  searchPlaceholder: L.PANELS.ASSIGN_MEMBERS.SEARCH_PLACEHOLDER,
  removeLabel: 'Remove member',
  removeDialog: L.ACTIONS.DEASSIGN_MEMBER_MODAL_TITLE,
  removeConfirm: L.ACTIONS.DEASSIGN_MEMBER_MODAL_CONFIRM,
  saveFailed: L.MESSAGES.UPDATE_FAILED,
  removedToast: (user) => L.MESSAGES.MEMBER_DEASSIGNED(user.username),
  render: ({ assigned, available, freshIds }) => {
    const group = buildGroup({ userRefs: assigned.map((user) => user.id) });
    mockEmptyLists('exporter', [Endpoints.ROLES.GET_ALL]);
    mockList('exporter', Endpoints.USERS.GET_ALL, available);
    return renderAttachPanel(group, 'userRefs', freshIds, (onClose) => (
      <AttachMemberPanel open onClose={onClose} group={group} />
    ));
  },
});

it('opens no member panel without a group', () => {
  mockEmptyLists('exporter', [Endpoints.ROLES.GET_ALL, Endpoints.USERS.GET_ALL]);

  renderApp(<AttachMemberPanel open onClose={vi.fn()} group={null} />);

  expect(screen.queryByText(L.PANELS.ASSIGN_MEMBERS.TITLE)).not.toBeInTheDocument();
});
