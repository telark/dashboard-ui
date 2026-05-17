import { cfg } from './config.js';

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)/g, '');

export const fixtures = {
  user: () => ({
    username: `k6-user-${cfg.runId}`,
    fullname: `K6 Test User ${cfg.runId}`,
    email: `k6-user-${cfg.runId}@example.com`,
    assignedRolesIDs: [],
    assignedGroupsIDs: [],
    avatar: '',
  }),
  group: () => ({
    name: `k6-group-${cfg.runId}`,
    description: 'created by k6 suite',
    assignedUsersIDs: [],
  }),
  role: () => ({
    name: `k6-role-${cfg.runId}`,
    description: 'created by k6 suite',
    type: 'custom',
    scopesAndPermissions: [],
    assignedTo: [],
  }),
  category: () => ({
    name: `k6-cat-${cfg.runId}`,
    description: 'created by k6 suite',
    scope: 'apps',
  }),
  planName: () => `k6-plan-${cfg.runId}`,
  slug,
};
