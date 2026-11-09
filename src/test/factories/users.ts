import type { User } from '../../features/access-and-permissions/users/models';
import { createFactory } from '../factory';

export const buildUser = createFactory<User>((sequence) => ({
  id: `user-${sequence}`,
  username: `sre_oncall_${sequence}`,
  fullname: `Sre Oncall ${sequence}`,
  email: 'test@example.com',
  roleRefs: [],
  groupRefs: [],
  creationDate: '2026-01-15T10:00:00Z',
  status: { phase: 'active' },
}));
