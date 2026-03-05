import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUser } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { useRoles } from '../../../roles/hooks';
import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

interface UseManageUserRolePanelOptions {
  open: boolean;
  user: User | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedRole: string;
}

interface UseManageUserRolePanelReturn {
  initialSelectedRole: string;
  hasChanges: boolean;
  roles: ReturnType<typeof useRoles>['roles'];
  rolesLoading: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useManageUserRolePanel = ({
  open,
  user,
  form,
  onClose,
  currentSelectedRole,
}: UseManageUserRolePanelOptions): UseManageUserRolePanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { roles, loading: rolesLoading } = useRoles();

  const initialSelectedRole = useMemo(() => user?.roleID ?? '', [user]);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({ roleID: user.roleID });
    }
  }, [open, user, form]);

  const hasChanges = useMemo(
    () => currentSelectedRole !== initialSelectedRole,
    [currentSelectedRole, initialSelectedRole],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    try {
      const updatedUser: User = {
        ...user,
        roleID: (values.roleID as string) || user.roleID,
      };
      dispatch(updateUser(updatedUser));
      message.success(UC.LABELS.MESSAGES.ROLE_ASSIGNED(user.fullname || user.username));
      form.resetFields();
      onClose();
    } catch {
      message.error(UC.LABELS.MESSAGES.ROLE_ASSIGN_FAILED);
    }
  };

  return {
    initialSelectedRole,
    hasChanges,
    roles,
    rolesLoading,
    submitting: false,
    handleSubmit,
  };
};
