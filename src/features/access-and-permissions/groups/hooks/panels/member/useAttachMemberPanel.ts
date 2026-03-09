import { useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState, AppDispatch } from '../../../../../../store';
import { useGroupMutations } from '../../';
import { useUsers } from '../../../../users/hooks';
import { updateUserThunk } from '../../../../users/store';
import type { Group } from '../../../models';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

/**
 * When a group's assigned members are updated from the Groups UI, sync each affected
 * user's assignedGroupsIDs so that the Users UI (Manage Groups) shows the same state.
 */
const syncUsersGroups = async (
  dispatch: AppDispatch,
  newUserIds: string[],
  initialUserIds: string[],
  groupId: string,
  users: Array<{ id: string; assignedGroupsIDs?: string[] }> | undefined,
) => {
  const addedIds = newUserIds.filter((id) => !initialUserIds.includes(id));
  const removedIds = initialUserIds.filter((id) => !newUserIds.includes(id));

  const updates: Promise<unknown>[] = [];

  for (const userId of addedIds) {
    const user = users?.find((u) => u.id === userId);
    const nextGroupIds = [...(user?.assignedGroupsIDs || []), groupId];
    updates.push(
      dispatch(updateUserThunk({ id: userId, user: { assignedGroupsIDs: nextGroupIds } })).unwrap(),
    );
  }

  for (const userId of removedIds) {
    const user = users?.find((u) => u.id === userId);
    const nextGroupIds = (user?.assignedGroupsIDs || []).filter((id) => id !== groupId);
    updates.push(
      dispatch(updateUserThunk({ id: userId, user: { assignedGroupsIDs: nextGroupIds } })).unwrap(),
    );
  }

  await Promise.all(updates);
};

interface UseAttachMemberPanelOptions {
  open: boolean;
  group: Group | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedUsers: string[];
}

interface UseAttachMemberPanelReturn {
  currentGroup: Group | null;
  initialSelectedUsers: string[];
  hasChanges: boolean;
  allUsers: ReturnType<typeof useUsers>['users'];
  usersLoading: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useAttachMemberPanel = ({
  open,
  group,
  form,
  onClose,
  currentSelectedUsers,
}: UseAttachMemberPanelOptions): UseAttachMemberPanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const groups = useSelector((state: RootState) => state.groups.groups);
  const { users, loading: usersLoading } = useUsers();
  const { handleUpdate, submitting } = useGroupMutations();

  const currentGroup = useMemo(() => {
    if (!group) return null;
    return groups.find((g) => g.id === group.id) || group;
  }, [group, groups]);

  const initialSelectedUsers = useMemo(() => {
    return currentGroup?.assignedUsersIDs || [];
  }, [currentGroup]);

  useEffect(() => {
    if (open && currentGroup && !usersLoading && users) {
      const assignedUsers = currentGroup.assignedUsersIDs || [];
      form.setFieldsValue({ assignedUsersIDs: assignedUsers });
    }
  }, [open, currentGroup, usersLoading, users, form]);

  const hasChanges = useMemo(() => {
    const current = (currentSelectedUsers as string[]) || [];
    const initial = initialSelectedUsers || [];
    return !arraysEqual(current, initial);
  }, [currentSelectedUsers, initialSelectedUsers]);

  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      if (!currentGroup) return;
      const assignedUsersIDs = (values.assignedUsersIDs as string[]) || [];
      await handleUpdate(currentGroup.id, { assignedUsersIDs });
      await syncUsersGroups(
        dispatch,
        assignedUsersIDs,
        initialSelectedUsers,
        currentGroup.id,
        users,
      );
      form.resetFields();
      onClose();
    },
    [currentGroup, handleUpdate, dispatch, initialSelectedUsers, users, form, onClose],
  );

  return {
    currentGroup,
    initialSelectedUsers,
    hasChanges,
    allUsers: users,
    usersLoading,
    submitting,
    handleSubmit,
  };
};
