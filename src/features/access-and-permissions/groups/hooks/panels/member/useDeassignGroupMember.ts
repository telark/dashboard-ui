import { useCallback } from 'react';
import { App as AntdApp } from 'antd';
import type { FormInstance } from 'antd';
import { useDispatch } from 'react-redux';
import { useDeassignModal } from '../../../../shared';
import { updateGroupThunk } from '../../../store';
import { updateUserThunk } from '../../../../users/store';
import type { AppDispatch } from '../../../../../../store';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
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

/**
 * When a member is removed from the group in the Groups UI, sync that user's
 * assignedGroupsIDs so the Users UI (Manage Groups) stays correct.
 */
const syncUserRemoveGroup = async (
  dispatch: AppDispatch,
  userId: string,
  groupId: string,
  assignedGroupsIDs: string[],
) => {
  const nextGroupIds = assignedGroupsIDs.filter((id) => id !== groupId);
  await dispatch(
    updateUserThunk({ id: userId, user: { assignedGroupsIDs: nextGroupIds } }),
  ).unwrap();
};

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
      const updated = current.filter((id) => id !== user.id);
      try {
        await dispatch(
          updateGroupThunk({ id: group.id, group: { assignedUsersIDs: updated } }),
        ).unwrap();
        form.setFieldsValue({ assignedUsersIDs: updated });
        await syncUserRemoveGroup(dispatch, user.id, group.id, user.assignedGroupsIDs ?? []);
        message.success(GC.LABELS.MESSAGES.MEMBER_DEASSIGNED(user.username));
      } catch {
        message.error(GC.LABELS.MESSAGES.MEMBER_DEASSIGN_FAILED);
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
