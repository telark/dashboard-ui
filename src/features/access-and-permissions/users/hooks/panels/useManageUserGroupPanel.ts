import { useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { updateUser } from '../../store';
import type { AppDispatch } from '../../../../../store';
import { useFetchGroups } from '../../../groups/hooks';
import type { User } from '../../models';
import { USERS_CONSTANTS as UC } from '../../constants';

interface UseManageUserGroupPanelOptions {
  open: boolean;
  user: User | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedGroup: string;
}

interface UseManageUserGroupPanelReturn {
  initialSelectedGroup: string;
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
  currentSelectedGroup,
}: UseManageUserGroupPanelOptions): UseManageUserGroupPanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading: groupsLoading } = useFetchGroups();

  const initialSelectedGroup = useMemo(() => user?.groupID ?? '', [user]);

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({ groupID: user.groupID });
    }
  }, [open, user, form]);

  const hasChanges = useMemo(
    () => currentSelectedGroup !== initialSelectedGroup,
    [currentSelectedGroup, initialSelectedGroup],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!user) return;
    try {
      const updatedUser: User = {
        ...user,
        groupID: (values.groupID as string) || user.groupID,
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
    initialSelectedGroup,
    hasChanges,
    groups,
    groupsLoading,
    submitting: false,
    handleSubmit,
  };
};
