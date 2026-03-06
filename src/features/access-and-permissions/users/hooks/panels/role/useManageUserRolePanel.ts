import type { FormInstance } from 'antd';
import { useRoles } from '../../../../roles/hooks';
import type { User } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { useAssignmentPanelBase } from '../shared/useAssignmentPanelBase';

interface UseManageUserRolePanelOptions {
  open: boolean;
  user: User | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedRoles: string[];
}

interface UseManageUserRolePanelReturn {
  initialSelectedRoles: string[];
  hasChanges: boolean;
  filteredRoles: ReturnType<typeof useRoles>['roles'];
  allRoles: ReturnType<typeof useRoles>['roles'];
  rolesLoading: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useManageUserRolePanel = ({
  open,
  user,
  form,
  onClose,
  currentSelectedRoles,
}: UseManageUserRolePanelOptions): UseManageUserRolePanelReturn => {
  const { roles, loading: rolesLoading } = useRoles();

  const { initialSelectedIds, hasChanges, submitting, handleSubmit } = useAssignmentPanelBase({
    open,
    user,
    form,
    onClose,
    fieldName: 'assignedRolesIDs',
    currentSelected: currentSelectedRoles,
    dataReady: !rolesLoading && !!roles,
    successMessage: UC.LABELS.MESSAGES.ROLE_ASSIGNED,
    failMessage: UC.LABELS.MESSAGES.ROLE_ASSIGN_FAILED,
  });

  return {
    initialSelectedRoles: initialSelectedIds,
    hasChanges,
    filteredRoles: roles,
    allRoles: roles,
    rolesLoading,
    submitting,
    handleSubmit,
  };
};
