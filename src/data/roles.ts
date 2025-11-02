import type { Role } from '../interfaces/roles';

export type StaticRole = Role;

export const STATIC_ROLES: Role[] = [
  {
    id: 'r-plat-admin',
    name: 'Platform Admin',
    group: 'engineering',
    scopes: {
      groupers: ['View', 'Edit', 'Manage'],
      workloads: ['View', 'Edit', 'Manage'],
      bridges: ['View', 'Edit', 'Manage'],
      users: ['View', 'Edit', 'Manage'],
      roles: ['View', 'Edit', 'Manage'],
      settings: ['View', 'Edit', 'Manage'],
    },
    status: 'Active',
    createdAt: '2025-10-01T09:00:00.000Z',
    type: 'built-in',
  },
  {
    id: 'r-ops-maintainer',
    name: 'Ops Maintainer',
    group: 'operations',
    scopes: {
      groupers: ['View', 'Edit'],
      workloads: ['View', 'Edit', 'Manage'],
      bridges: ['View', 'Edit'],
      users: ['View'],
      roles: ['View'],
      settings: ['View'],
    },
    status: 'Active',
    createdAt: '2025-10-02T11:30:00.000Z',
    type: 'built-in',
  },
  {
    id: 'r-qa-viewer',
    name: 'QA Viewer',
    group: 'qa',
    scopes: {
      groupers: ['View'],
      workloads: ['View'],
      bridges: ['View'],
      users: ['View'],
      roles: ['View'],
      settings: ['View'],
    },
    status: 'Inactive',
    createdAt: '2025-10-03T14:15:00.000Z',
    type: 'custom',
  },
];


