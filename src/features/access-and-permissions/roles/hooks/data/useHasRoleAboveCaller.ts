import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../../store';
import { useCanGrantScopes } from '../../../../auth/hooks';

// Reads roles already loaded by the page; it fetches nothing itself.
export const useHasRoleAboveCaller = (): ((roleRefs?: string[]) => boolean) => {
  const roles = useSelector((state: RootState) => state.roles.roles);
  const canGrant = useCanGrantScopes();
  return useCallback(
    (roleRefs = []) =>
      roles.some(
        (role) => roleRefs.includes(role.id) && !canGrant(role.scopesAndPermissions || []),
      ),
    [roles, canGrant],
  );
};
