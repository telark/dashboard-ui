import { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUserThunk } from '../../../store';
import type { AppDispatch } from '../../../../../../store';
import { useRoles } from '../../../../roles/hooks';
import type { User } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

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
  const dispatch: AppDispatch = useDispatch();
  const { roles, loading: rolesLoading } = useRoles();
  const [submitting, setSubmitting] = useState(false);

  const initialSelectedRoles = useMemo(() => user?.assignedRolesIDs ?? [], [user]);

  useEffect(() => {
    if (open && user && !rolesLoading && roles) {
      form.setFieldsValue({ assignedRolesIDs: user.assignedRolesIDs ?? [] });
    }
  }, [open, user, rolesLoading, roles, form]);

  const hasChanges = useMemo(
    () => !arraysEqual(currentSelectedRoles, initialSelectedRoles),
    [currentSelectedRoles, initialSelectedRoles],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    setSubmitting(true);
    try {
      await dispatch(
        updateUserThunk({
          id: user.id,
          user: { assignedRolesIDs: (values.assignedRolesIDs as string[]) ?? [] },
        }),
      ).unwrap();
      message.success(UC.LABELS.MESSAGES.ROLE_ASSIGNED(user.fullname || user.username));
      form.resetFields();
      onClose();
    } catch {
      message.error(UC.LABELS.MESSAGES.ROLE_ASSIGN_FAILED);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    initialSelectedRoles,
    hasChanges,
    filteredRoles: roles,
    allRoles: roles,
    rolesLoading,
    submitting,
    handleSubmit,
  };
};
