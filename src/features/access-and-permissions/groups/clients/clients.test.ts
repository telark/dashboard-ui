import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { describeClients } from '../../../../test';
import { buildGroup } from '../../../../test/factories/groups';
import { describeSilentClients } from '../../../../test/helpers/silentClients';
import { createGroup, deleteGroup, fetchGroupById, fetchGroups, updateGroup } from '.';
import { GROUPS_ERROR_MESSAGES } from '../constants';

const GROUP_ID = 'group-1';
const GROUP_INPUT = {
  name: 'platform_team',
  description: 'Runs it',
  categoryRef: 'c',
  userRefs: [],
};
const details = buildGroup({ id: GROUP_ID });

describeClients('groups', [
  {
    name: 'fetchGroups',
    service: 'exporter',
    endpoint: Endpoints.GROUPS.GET_ALL,
    call: () => fetchGroups(),
    response: { data: { items: [] } },
  },
  {
    name: 'fetchGroupById',
    service: 'exporter',
    endpoint: Endpoints.GROUPS.GET_BY_ID(GROUP_ID),
    call: () => fetchGroupById(GROUP_ID),
    response: { data: details },
  },
  {
    name: 'createGroup',
    service: 'exporter',
    endpoint: Endpoints.GROUPS.CREATE,
    call: () => createGroup(GROUP_INPUT),
    response: { data: details },
    body: GROUP_INPUT,
  },
  {
    name: 'createGroup with no members',
    service: 'exporter',
    endpoint: Endpoints.GROUPS.CREATE,
    call: () => createGroup({ ...GROUP_INPUT, userRefs: undefined as unknown as string[] }),
    response: { data: details },
    body: GROUP_INPUT,
  },
  {
    name: 'updateGroup',
    service: 'exporter',
    endpoint: Endpoints.GROUPS.PATCH_BY_ID(GROUP_ID),
    call: () =>
      updateGroup(GROUP_ID, {
        name: 'renamed',
        description: 'd',
        categoryRef: 'c',
        userRefs: 'nope' as unknown as string[],
        roleRefs: ['r'],
      }),
    response: { data: details },
    body: { name: 'renamed', description: 'd', categoryRef: 'c', userRefs: [], roleRefs: ['r'] },
  },
  {
    name: 'deleteGroup',
    service: 'auth',
    endpoint: Endpoints.GROUPS.CLEANUP(GROUP_ID),
    call: () => deleteGroup(GROUP_ID),
  },
]);

describeSilentClients('groups', [
  { name: 'fetchGroups', endpoint: Endpoints.GROUPS.GET_ALL, call: () => fetchGroups(true) },
  {
    name: 'fetchGroupById',
    endpoint: Endpoints.GROUPS.GET_BY_ID(GROUP_ID),
    call: () => fetchGroupById(GROUP_ID, true),
  },
]);

describe('groups client extras', () => {
  it('refuses to delete without an id', async () => {
    await expect(deleteGroup('')).rejects.toThrow(
      GROUPS_ERROR_MESSAGES.CLIENT.DELETE_GROUP_MISSING_ID,
    );
  });
});
