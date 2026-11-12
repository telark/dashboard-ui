import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { describeClients } from '../../../../test';
import { buildRole } from '../../../../test/factories/roles';
import { describeSilentClients } from '../../../../test/helpers/silentClients';
import { createRole, deleteRole, fetchRoleById, fetchRoles, updateRole } from '.';
import { ROLES_ERROR_MESSAGES } from '../constants';
import type { RoleFormData } from '../models';

const ROLE_ID = 'role-1';
const role = buildRole();
const roleData: RoleFormData = {
  name: role.name,
  description: role.description,
  type: role.type,
  categoryRef: role.categoryRef,
  scopesAndPermissions: role.scopesAndPermissions,
  status: role.status,
};

describeClients('roles', [
  {
    name: 'fetchRoles',
    service: 'exporter',
    endpoint: Endpoints.ROLES.GET_ALL,
    call: () => fetchRoles(),
    response: { data: { items: [] } },
  },
  {
    name: 'fetchRoleById',
    service: 'exporter',
    endpoint: Endpoints.ROLES.GET_BY_ID(ROLE_ID),
    call: () => fetchRoleById(ROLE_ID),
    response: { data: { id: ROLE_ID } },
  },
  {
    name: 'createRole',
    service: 'exporter',
    endpoint: Endpoints.ROLES.CREATE,
    call: () => createRole(roleData),
    response: { data: { id: ROLE_ID } },
    body: roleData,
  },
  {
    name: 'updateRole',
    service: 'exporter',
    endpoint: Endpoints.ROLES.PATCH_BY_ID(ROLE_ID),
    call: () =>
      updateRole(ROLE_ID, { name: 'renamed', status: 'Active', protection: { lockName: true } }),
    response: { data: { id: ROLE_ID } },
    body: { name: 'renamed', status: 'Active', protection: { lockName: true } },
  },
  {
    name: 'deleteRole',
    service: 'auth',
    endpoint: Endpoints.ROLES.CLEANUP(ROLE_ID),
    call: () => deleteRole(ROLE_ID),
  },
]);

describeSilentClients('roles', [
  { name: 'fetchRoles', endpoint: Endpoints.ROLES.GET_ALL, call: () => fetchRoles(true) },
  {
    name: 'fetchRoleById',
    endpoint: Endpoints.ROLES.GET_BY_ID(ROLE_ID),
    call: () => fetchRoleById(ROLE_ID, true),
  },
]);

describe('roles client extras', () => {
  it('refuses to delete without an id', async () => {
    await expect(deleteRole('')).rejects.toThrow(
      ROLES_ERROR_MESSAGES.CLIENT.DELETE_ROLE_MISSING_ID,
    );
  });
});
