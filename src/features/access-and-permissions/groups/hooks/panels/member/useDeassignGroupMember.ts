import { useCallback } from 'react';
import { App as AntdApp } from 'antd';
import type { FormInstance } from 'antd';
import { useDispatch } from 'react-redux';
import { useDeassignModal } from '../../../../shared';
import { updateGroupThunk } from '../../../store';
import { fetchAllUsersSilentThunk } from '../../../../users/store';
import type { AppDispatch } from '../../../../../../store';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import { fetchFreshGroupIds } from '../../../utils';
import { applySelectionChange } from '../../../../shared';
import { rejectionMessage } from '../../../../../../utils/helpers/format';
import type { Group } from '../../../models';
import type { User } from '../../../../users/models';

interface UseDeassignGroupMemberOptions {
  group: Group | null;
  form: FormInstance;
  onSuccess?: (updatedUserIds: string[]) => void;
}

interface UseDeassignGroupMemberReturn {
  deassignModalOpen: boolean;
  deassigningUser: User | null;
  isDeassigning: boolean;
  openDeassignModal: (user: User) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignGroupMember = ({
  group,
  form,
  onSuccess,
}: UseDeassignGroupMemberOptions): UseDeassignGroupMemberReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { message } = AntdApp.useApp();

  const performDeassign = useCallback(
    async (user: User) => {
      if (!group) throw new Error('No group selected');
      const current = (form.getFieldValue('assignedUsersIDs') as string[]) ?? [];
      try {
        const freshIds = await fetchFreshGroupIds(group.id, 'assignedUsersIDs');
        await dispatch(
          updateGroupThunk({
            id: group.id,
            group: { assignedUsersIDs: applySelectionChange(freshIds, [user.id], []) },
          }),
        ).unwrap();
        form.setFieldsValue({ assignedUsersIDs: current.filter((id) => id !== user.id) });
        dispatch(fetchAllUsersSilentThunk());
        message.success(GC.LABELS.MESSAGES.MEMBER_DEASSIGNED(user.username));
      } catch (rejection) {
        message.error(rejectionMessage(rejection, GC.LABELS.MESSAGES.MEMBER_DEASSIGN_FAILED));
        throw new Error(GC.LABELS.MESSAGES.MEMBER_DEASSIGN_FAILED);
      }
    },
    [group, form, dispatch, message],
  );

  const handleDeassignSuccess = useCallback(
    // The removed user is not needed: the form already holds the resulting id list.
    () => {
      const updatedIds = (form.getFieldValue('assignedUsersIDs') as string[]) ?? [];
      onSuccess?.(updatedIds);
    },
    [form, onSuccess],
  );

  const {
    modalOpen: deassignModalOpen,
    deassigningItem: deassigningUser,
    isDeassigning,
    openModal: openDeassignModal,
    closeModal: closeDeassignModal,
    handleConfirm: handleConfirmDeassign,
  } = useDeassignModal<User>({
    onConfirm: performDeassign,
    onSuccess: handleDeassignSuccess,
  });

  return {
    deassignModalOpen,
    deassigningUser,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  };
};
