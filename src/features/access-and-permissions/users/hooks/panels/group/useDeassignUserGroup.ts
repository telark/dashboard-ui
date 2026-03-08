import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { FormInstance } from 'antd';
import { updateGroupThunk } from '../../../../groups/store';
import type { AppDispatch } from '../../../../../../store';
import { useDeassignUserField } from '../shared/useDeassignUserField';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User } from '../../../models';
import type { Group } from '../../../../groups/models';

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

/** Sync group's assignedUsersIDs when user is removed from group (so Groups UI stays correct). */
const syncGroupRemoveUser = async (
  dispatch: AppDispatch,
  group: Group,
  userId: string,
) => {
  const nextMemberIds = (group.assignedUsersIDs || []).filter((id) => id !== userId);
  await dispatch(
    updateGroupThunk({ id: group.id, group: { assignedUsersIDs: nextMemberIds } }),
  ).unwrap();
};

export const useDeassignUserGroup = ({
  user,
  form,
  onSuccess,
}: UseDeassignUserGroupOptions): UseDeassignUserGroupReturn => {
  const dispatch: AppDispatch = useDispatch();

  const onAfterDeassign = useCallback(
    async (
      item: { id: string; name: string; assignedUsersIDs?: string[] },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature required by useDeassignUserField
      _updatedGroupIds: string[],
    ) => {
      if (!user) return;
      await syncGroupRemoveUser(dispatch, item as Group, user.id);
    },
    [dispatch, user],
  );

  const { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm } =
    useDeassignUserField<Group>({
      user,
      form,
      fieldName: 'assignedGroupsIDs',
      successMessage: UC.LABELS.MESSAGES.GROUP_DEASSIGNED,
      failMessage: UC.LABELS.MESSAGES.GROUP_DEASSIGN_FAILED,
      onSuccess,
      onAfterDeassign,
    });

  return {
    deassignModalOpen: modalOpen,
    deassigningGroup: deassigningItem,
    isDeassigning,
    openDeassignModal: openModal,
    closeDeassignModal: closeModal,
    handleConfirmDeassign: handleConfirm,
  };
};
