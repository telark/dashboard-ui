import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUserThunk } from '../../store';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { AppDispatch } from '../../../../../store';
import type { User } from '../../models';
import type { Role } from '../../../roles/models';

interface UseDeassignUserRoleOptions {
  user: User | null;
  form: FormInstance;
  onSuccess?: (updatedRoles: string[]) => void;
}

interface UseDeassignUserRoleReturn {
  deassignModalOpen: boolean;
  deassigningRole: Role | null;
  isDeassigning: boolean;
  openDeassignModal: (role: Role) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignUserRole = ({
  user,
  form,
  onSuccess,
}: UseDeassignUserRoleOptions): UseDeassignUserRoleReturn => {
  const dispatch: AppDispatch = useDispatch();
  const [deassignModalOpen, setDeassignModalOpen] = useState(false);
  const [deassigningRole, setDeassigningRole] = useState<Role | null>(null);
  const [isDeassigning, setIsDeassigning] = useState(false);

  const openDeassignModal = useCallback((role: Role) => {
    setDeassigningRole(role);
    setDeassignModalOpen(true);
  }, []);

  const closeDeassignModal = useCallback(() => {
    setDeassignModalOpen(false);
    setDeassigningRole(null);
  }, []);

  const handleConfirmDeassign = useCallback(async () => {
    if (!user || !deassigningRole) return;

    const currentRoles = (form.getFieldValue('assignedRolesIDs') as string[]) ?? [];
    const updatedRoles = currentRoles.filter((id) => id !== deassigningRole.id);

    setIsDeassigning(true);
    try {
      await dispatch(
        updateUserThunk({ id: user.id, user: { assignedRolesIDs: updatedRoles } }),
      ).unwrap();

      form.setFieldsValue({ assignedRolesIDs: updatedRoles });
      onSuccess?.(updatedRoles);
      message.success(UC.LABELS.MESSAGES.ROLE_DEASSIGNED(deassigningRole.name));
      setDeassignModalOpen(false);
      setDeassigningRole(null);
    } catch {
      message.error(UC.LABELS.MESSAGES.ROLE_DEASSIGN_FAILED);
    } finally {
      setIsDeassigning(false);
    }
  }, [user, deassigningRole, form, dispatch, onSuccess]);

  return {
    deassignModalOpen,
    deassigningRole,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  };
};
