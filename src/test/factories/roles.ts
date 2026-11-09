import type { Role } from '../../features/access-and-permissions/roles/models';
import { createFactory } from '../factory';

export const buildRole = createFactory<Role>((sequence) => ({
  id: `role-${sequence}`,
  name: `release_reviewer_${sequence}`,
  description: 'Reviews releases',
  version: '1',
  type: 'custom',
  priority: sequence,
  categoryRef: '',
  scopesAndPermissions: [{ scope: 'applications', level: 'ReadOnly' }],
  status: 'Active',
  creationDate: '2026-01-15T10:00:00Z',
}));
