import type { Role } from '../interfaces/roles';

export type StaticRole = Role;

export const STATIC_ROLES: Role[] = [
  {
    id: 'r-plat-admin',
    name: 'Platform Admin',
    scopes: {
      groupers: ['View', 'Edit', 'Delete'],
      workloads: ['View', 'Edit', 'Delete'],
      bridges: ['View', 'Edit', 'Delete'],
      users: ['View', 'Edit', 'Delete'],
      roles: ['View', 'Edit', 'Delete'],
      settings: ['View', 'Edit', 'Delete'],
    },
    status: 'Active',
    createdAt: '2025-10-01T09:00:00.000Z',
    type: 'built-in',
  },
  {
    id: 'r-ops-maintainer',
    name: 'Ops Maintainer',
    scopes: {
      groupers: ['View', 'Edit'],
      workloads: ['View', 'Edit', 'Delete'],
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
