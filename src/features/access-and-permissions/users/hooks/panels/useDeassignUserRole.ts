import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { useDeassignModal } from '../../../shared';
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

  const performDeassign = useCallback(
    async (role: Role) => {
      if (!user) throw new Error('No user selected');
      const currentRoles = (form.getFieldValue('assignedRolesIDs') as string[]) ?? [];
      const updatedRoles = currentRoles.filter((id) => id !== role.id);
      try {
        await dispatch(
          updateUserThunk({ id: user.id, user: { assignedRolesIDs: updatedRoles } }),
        ).unwrap();
        form.setFieldsValue({ assignedRolesIDs: updatedRoles });
        message.success(UC.LABELS.MESSAGES.ROLE_DEASSIGNED(role.name));
      } catch {
        message.error(UC.LABELS.MESSAGES.ROLE_DEASSIGN_FAILED);
        throw new Error(UC.LABELS.MESSAGES.ROLE_DEASSIGN_FAILED);
      }
    },
    [user, form, dispatch],
  );

  const handleDeassignSuccess = useCallback(() => {
    const updatedRoles = (form.getFieldValue('assignedRolesIDs') as string[]) ?? [];
    onSuccess?.(updatedRoles);
  }, [form, onSuccess]);

  const { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm } =
    useDeassignModal<Role>({ onConfirm: performDeassign, onSuccess: handleDeassignSuccess });

  return {
    deassignModalOpen: modalOpen,
    deassigningRole: deassigningItem,
    isDeassigning,
    openDeassignModal: openModal,
    closeDeassignModal: closeModal,
    handleConfirmDeassign: handleConfirm,
  };
};
