import { useSelector } from 'react-redux';
import { useIsAdminOnAll } from '../../../../auth/hooks';
import { selectPermissionsState } from '../../../../auth/store/selectors/permissionsSelectors';
import { ROLES_CONSTANTS as RC } from '../../constants';
import type { Role } from '../../models';

// Mirrors the exporter: only a custom role's creator or an Admin on ALL may change its protection.
export const useCanChangeRoleProtection = (role: Role | null): boolean => {
  const { userID } = useSelector(selectPermissionsState);
  const isAdminOnAll = useIsAdminOnAll();
  return role?.type === RC.TYPE.CUSTOM && (isAdminOnAll || role.createdBy === userID);
};
