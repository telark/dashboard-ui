import { useCallback } from 'react';
import { getCurrentUser } from '../../../../auth/utils';
import { userLockReason } from '../../utils/user/protection';
import type { User } from '../../models';

export const useUserLockReason = (): ((target: User) => string | undefined) =>
  useCallback((target: User) => userLockReason(target, getCurrentUser()), []);
