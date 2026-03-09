import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { FormInstance } from 'antd';
import { useFetchGroups } from '../../../../groups/hooks';
import { updateGroupThunk } from '../../../../groups/store';
import type { AppDispatch } from '../../../../../../store';
import type { User } from '../../../models';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { useAssignmentPanelBase } from '../shared/useAssignmentPanelBase';

interface UseManageUserGroupPanelOptions {
  open: boolean;
  user: User | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedGroups: string[];
}

interface UseManageUserGroupPanelReturn {
  initialSelectedGroups: string[];
  hasChanges: boolean;
  groups: ReturnType<typeof useFetchGroups>['groups'];
  groupsLoading: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

/**
 * When a user's assigned groups are updated from the Users UI, we sync each affected
 * group's assignedUsersIDs so that the Groups UI (Manage Members) shows the same state.
 * The backend may not update group.assignedUsersIDs when PATCHing user.assignedGroupsIDs.
 */
const syncGroupsMembers = async (
  dispatch: AppDispatch,
  newGroupIds: string[],
  initialGroupIds: string[],
  userId: string,
  groups: Array<{ id: string; assignedUsersIDs?: string[] }> | undefined,
) => {
  const addedIds = newGroupIds.filter((id) => !initialGroupIds.includes(id));
  const removedIds = initialGroupIds.filter((id) => !newGroupIds.includes(id));

  const updates: Promise<unknown>[] = [];

  for (const groupId of addedIds) {
    const group = groups?.find((g) => g.id === groupId);
    const nextMemberIds = [...(group?.assignedUsersIDs || []), userId];
    updates.push(
      dispatch(
        updateGroupThunk({ id: groupId, group: { assignedUsersIDs: nextMemberIds } }),
      ).unwrap(),
    );
  }

  for (const groupId of removedIds) {
    const group = groups?.find((g) => g.id === groupId);
    const nextMemberIds = (group?.assignedUsersIDs || []).filter((id) => id !== userId);
    updates.push(
      dispatch(
        updateGroupThunk({ id: groupId, group: { assignedUsersIDs: nextMemberIds } }),
      ).unwrap(),
    );
  }

  await Promise.all(updates);
};

export const useManageUserGroupPanel = ({
  open,
  user,
  form,
  onClose,
  currentSelectedGroups,
}: UseManageUserGroupPanelOptions): UseManageUserGroupPanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading: groupsLoading } = useFetchGroups();

  const handleSyncGroups = useCallback(
    async (newGroupIds: string[]) => {
      if (!user) return;
      const initialIds = user.assignedGroupsIDs ?? [];
      await syncGroupsMembers(dispatch, newGroupIds, initialIds, user.id, groups);
    },
    [dispatch, user, groups],
  );

  const { initialSelectedIds, hasChanges, submitting, handleSubmit } = useAssignmentPanelBase({
    open,
    user,
    form,
    onClose,
    fieldName: 'assignedGroupsIDs',
    currentSelected: currentSelectedGroups,
    dataReady: !groupsLoading && !!groups,
    successMessage: UC.LABELS.MESSAGES.GROUP_ASSIGNED,
    failMessage: UC.LABELS.MESSAGES.GROUP_ASSIGN_FAILED,
    onSuccess: handleSyncGroups,
  });

  return {
    initialSelectedGroups: initialSelectedIds,
    hasChanges,
    groups,
    groupsLoading,
    submitting,
    handleSubmit,
  };
};
