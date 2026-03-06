import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { useDeassignModal } from '../../../shared';
import { updateUserThunk } from '../../store';
import { USERS_CONSTANTS as UC } from '../../constants';
import type { AppDispatch } from '../../../../../store';
import type { User } from '../../models';
import type { Group } from '../../../groups/models';

interface UseDeassignUserGroupOptions {
  user: User | null;
  form: FormInstance;
  onSuccess?: (updatedGroups: string[]) => void;
}

interface UseDeassignUserGroupReturn {
  deassignModalOpen: boolean;
  deassigningGroup: Group | null;
  isDeassigning: boolean;
  openDeassignModal: (group: Group) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignUserGroup = ({
  user,
  form,
  onSuccess,
}: UseDeassignUserGroupOptions): UseDeassignUserGroupReturn => {
  const dispatch: AppDispatch = useDispatch();

  const performDeassign = useCallback(
    async (group: Group) => {
      if (!user) throw new Error('No user selected');
      const currentGroups = (form.getFieldValue('assignedGroupsIDs') as string[]) ?? [];
      const updatedGroups = currentGroups.filter((id) => id !== group.id);
      try {
        await dispatch(
          updateUserThunk({ id: user.id, user: { assignedGroupsIDs: updatedGroups } }),
        ).unwrap();
        form.setFieldsValue({ assignedGroupsIDs: updatedGroups });
        message.success(UC.LABELS.MESSAGES.GROUP_DEASSIGNED(group.name));
      } catch {
        message.error(UC.LABELS.MESSAGES.GROUP_DEASSIGN_FAILED);
        throw new Error(UC.LABELS.MESSAGES.GROUP_DEASSIGN_FAILED);
      }
    },
    [user, form, dispatch],
  );

  const handleDeassignSuccess = useCallback(() => {
    const updatedGroups = (form.getFieldValue('assignedGroupsIDs') as string[]) ?? [];
    onSuccess?.(updatedGroups);
  }, [form, onSuccess]);

  const { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm } =
    useDeassignModal<Group>({ onConfirm: performDeassign, onSuccess: handleDeassignSuccess });

  return {
    deassignModalOpen: modalOpen,
    deassigningGroup: deassigningItem,
    isDeassigning,
    openDeassignModal: openModal,
    closeDeassignModal: closeModal,
    handleConfirmDeassign: handleConfirm,
  };
};
