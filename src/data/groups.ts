import type { Group } from '../interfaces/groups';

export const STATIC_GROUPS: Group[] = [
  {
    id: 'grp-1',
    name: 'Development Team',
    description: 'Group for development team members working on core features',
    category: 'Engineering',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'grp-2',
    name: 'Operations Team',
    description: 'Group for operations team managing infrastructure and deployments',
    category: 'Operations',
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'grp-3',
    name: 'QA Team',
    description: 'Quality assurance team responsible for testing and validation',
    category: 'Quality Assurance',
    createdAt: '2024-03-10T14:15:00Z',
  },
  {
    id: 'grp-4',
    name: 'Security Team',
    description: 'Security team handling access control and compliance',
    category: 'Security',
    createdAt: '2024-04-05T11:20:00Z',
  },
];
