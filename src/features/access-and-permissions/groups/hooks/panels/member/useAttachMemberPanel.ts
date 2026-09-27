import { useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState, AppDispatch } from '../../../../../../store';
import { useGroupMutations } from '../../';
import { useUsers } from '../../../../users/hooks';
import { fetchAllUsersSilentThunk } from '../../../../users/store';
import { applySelectionChange } from '../../../../shared';
import { fetchFreshGroupIds } from '../../../utils';
import type { Group } from '../../../models';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
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
    return currentGroup?.userRefs || [];
  }, [currentGroup]);

  useEffect(() => {
    if (open && currentGroup && !usersLoading && users) {
      const assignedUsers = currentGroup.userRefs || [];
      form.setFieldsValue({ userRefs: assignedUsers });
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
      const selected = (values.userRefs as string[]) || [];
      await handleUpdate(currentGroup.id, async () => ({
        userRefs: applySelectionChange(
          await fetchFreshGroupIds(currentGroup.id, 'userRefs'),
          initialSelectedUsers,
          selected,
        ),
      }));
      // The backend mirrors membership onto each user; reload them so the Members page follows.
      dispatch(fetchAllUsersSilentThunk());
      form.resetFields();
      onClose();
    },
    [currentGroup, handleUpdate, dispatch, initialSelectedUsers, form, onClose],
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
