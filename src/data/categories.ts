import type { Category } from '../interfaces/categories';

export const STATIC_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'General',
    description: 'Common roles for everyday access.',
    usedBy: ['Viewer', 'Contributor'],
    type: 'default',
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Administration',
    description: 'Administrative and high-privilege roles.',
    usedBy: ['Admin', 'Platform Admin'],
    type: 'system',
    createdAt: '2024-06-03T08:30:00Z',
  },
  {
    id: 'cat-3',
    name: 'Operations',
    description: 'Operational roles to manage workloads.',
    usedBy: ['Ops Engineer'],
    type: 'custom',
    createdAt: '2024-08-19T14:15:00Z',
  },
];
