import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUser } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { useFetchGroups } from '../../../groups/hooks';
import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, idx) => val === sortedB[idx]);
};

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

export const useManageUserGroupPanel = ({
  open,
  user,
  form,
  onClose,
  currentSelectedGroups,
}: UseManageUserGroupPanelOptions): UseManageUserGroupPanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading: groupsLoading } = useFetchGroups();

  const initialSelectedGroups = useMemo(() => user?.assignedGroupsIDs ?? [], [user]);

  useEffect(() => {
    if (open && user && !groupsLoading && groups) {
      form.setFieldsValue({ assignedGroupsIDs: user.assignedGroupsIDs ?? [] });
    }
  }, [open, user, groupsLoading, groups, form]);

  const hasChanges = useMemo(
    () => !arraysEqual(currentSelectedGroups, initialSelectedGroups),
    [currentSelectedGroups, initialSelectedGroups],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    try {
      const updatedUser: User = {
        ...user,
        assignedGroupsIDs: (values.assignedGroupsIDs as string[]) ?? [],
      };
      dispatch(updateUser(updatedUser));
      message.success(UC.LABELS.MESSAGES.GROUP_ASSIGNED(user.fullname || user.username));
      form.resetFields();
      onClose();
    } catch {
      message.error(UC.LABELS.MESSAGES.GROUP_ASSIGN_FAILED);
    }
  };

  return {
    initialSelectedGroups,
    hasChanges,
    groups,
    groupsLoading,
    submitting: false,
    handleSubmit,
  };
};
