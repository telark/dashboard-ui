import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { FormInstance } from 'antd';
import { useFetchGroups } from '../../../../groups/hooks';
import { fetchAllGroupsSilentThunk } from '../../../../groups/store';
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

export const useManageUserGroupPanel = ({
  open,
  user,
  form,
  onClose,
  currentSelectedGroups,
}: UseManageUserGroupPanelOptions): UseManageUserGroupPanelReturn => {
  const dispatch: AppDispatch = useDispatch();
  const { groups, loading: groupsLoading } = useFetchGroups();

  // The backend mirrors membership onto each group; reload them so member counts follow.
  const reloadGroups = useCallback(() => {
    dispatch(fetchAllGroupsSilentThunk());
  }, [dispatch]);

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
    onSuccess: reloadGroups,
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
