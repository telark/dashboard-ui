import { expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { describeClients } from '../../../../test';
import { describeVoidClients } from '../../../../test/contracts/voidClients';
import { describeSilentClients } from '../../../../test/helpers/silentClients';
import {
  createUser,
  createUserEnrollLink,
  deleteUser,
  fetchUserById,
  fetchUsers,
  revokeUserEnrollLink,
  updateUser,
} from '.';
import { fetchUsernames } from './fetch';
import { USER_ERROR_MESSAGES } from '../constants';

const USER_ID = 'user-1';
const CREATE_INPUT = { username: 'sre_oncall', fullname: 'Sre Oncall', email: 'test@example.com' };

describeClients('users', [
  {
    name: 'fetchUsers',
    service: 'exporter',
    endpoint: Endpoints.USERS.GET_ALL,
    call: () => fetchUsers(),
    response: { data: { items: [] } },
  },
  {
    name: 'fetchUserById',
    service: 'exporter',
    endpoint: Endpoints.USERS.GET_BY_ID(USER_ID),
    call: () => fetchUserById(USER_ID),
    response: { data: { id: USER_ID } },
  },
  {
    name: 'fetchUsernames',
    service: 'exporter',
    endpoint: Endpoints.USERS.GET_NAMES(['u-1']),
    call: () => fetchUsernames(['u-1']),
    response: { data: { 'u-1': 'sre_oncall' } },
  },
  {
    name: 'createUser',
    service: 'exporter',
    endpoint: Endpoints.USERS.CREATE,
    call: () => createUser(CREATE_INPUT),
    response: { data: { id: USER_ID } },
    body: { ...CREATE_INPUT, roleRefs: [], groupRefs: [] },
  },
  {
    name: 'updateUser',
    service: 'exporter',
    endpoint: Endpoints.USERS.PATCH_BY_ID(USER_ID),
    call: () =>
      updateUser(USER_ID, {
        username: 'renamed',
        fullname: 'Renamed',
        email: 'test@example.com',
        avatar: { style: 'bottts', seed: 's' },
        settings: { theme: 'dark' },
        roleRefs: ['r'],
        groupRefs: 'nope' as unknown as string[],
        status: { phase: 'active' },
      }),
    response: { data: { id: USER_ID } },
    body: {
      username: 'renamed',
      fullname: 'Renamed',
      email: 'test@example.com',
      avatar: { style: 'bottts', seed: 's' },
      settings: { theme: 'dark' },
      roleRefs: ['r'],
      groupRefs: [],
      status: { phase: 'active' },
    },
  },
  {
    name: 'deleteUser',
    service: 'auth',
    endpoint: Endpoints.USERS.CLEANUP(USER_ID),
    call: () => deleteUser(USER_ID),
  },
  {
    name: 'createUserEnrollLink',
    service: 'auth',
    endpoint: Endpoints.USERS.CREATE_ENROLL_LINK(USER_ID),
    call: () => createUserEnrollLink(USER_ID),
    response: { token: 't', expiresAt: '2026-01-01' },
  },
]);

describeSilentClients('users', [
  { name: 'fetchUsers', endpoint: Endpoints.USERS.GET_ALL, call: () => fetchUsers(true) },
  {
    name: 'fetchUserById',
    endpoint: Endpoints.USERS.GET_BY_ID(USER_ID),
    call: () => fetchUserById(USER_ID, true),
  },
]);

describeVoidClients('users', [
  {
    name: 'revokeUserEnrollLink',
    service: 'auth',
    endpoint: Endpoints.USERS.REVOKE_ENROLL_LINK(USER_ID),
    call: () => revokeUserEnrollLink(USER_ID),
  },
]);

it('refuses to delete a user without an id', async () => {
  await expect(deleteUser('')).rejects.toThrow(USER_ERROR_MESSAGES.CLIENT.DELETE_USER_MISSING_ID);
});
