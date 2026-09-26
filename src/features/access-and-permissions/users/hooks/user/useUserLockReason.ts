import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store';
import { getCurrentUser } from '../../../../auth/utils';
import { grantsAdminOnAll, isAdminUser, userLockReason } from '../../utils/user/protection';
import type { User } from '../../models';

// Reads roles and groups already loaded by the page; it fetches nothing itself.
export const useUserLockReason = (): ((target: User) => string | undefined) => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const roles = useSelector((state: RootState) => state.roles.roles);

  return useMemo(() => {
    const viewer = getCurrentUser();
    const adminRoleIds = new Set(roles.filter(grantsAdminOnAll).map((role) => role.id));
    return (target: User) =>
      userLockReason(target, viewer, isAdminUser(target, groups, adminRoleIds));
  }, [groups, roles]);
};
