import type { Group } from '../../features/access-and-permissions/groups/models';
import { createFactory } from '../factory';

export const buildGroup = createFactory<Group>((sequence) => ({
  id: `group-${sequence}`,
  name: `platform_team_${sequence}`,
  description: 'Runs the platform',
  userRefs: [],
  roleRefs: [],
  categoryRef: '',
  creationDate: '2026-01-15T10:00:00Z',
}));
