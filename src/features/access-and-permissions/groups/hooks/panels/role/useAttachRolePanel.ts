import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState } from '../../../../../../store';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import { useGroupMutations } from '../../';
import { useRoles } from '../../../../roles/hooks';
import type { Group } from '../../../models';
import { fetchFreshGroupIds } from '../../../utils';
import { applySelectionChange } from '../../../../shared';

const arraysEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
};

interface UseAttachRolePanelOptions {
  open: boolean;
  group: Group | null;
  form: FormInstance;
  onClose: () => void;
  currentSelectedRoles: string[];
}

interface UseAttachRolePanelReturn {
  currentGroup: Group | null;
  initialSelectedRoles: string[];
  hasChanges: boolean;
  filteredRoles: ReturnType<typeof useRoles>['roles'];
  allRoles: ReturnType<typeof useRoles>['roles'];
  rolesLoading: boolean;
  submitting: boolean;
  handleSubmit: (values: Record<string, unknown>) => Promise<void>;
}

export const useAttachRolePanel = ({
  open,
  group,
  form,
  onClose,
  currentSelectedRoles,
}: UseAttachRolePanelOptions): UseAttachRolePanelReturn => {
  const groups = useSelector((state: RootState) => state.groups.groups);
  const { roles, loading: rolesLoading } = useRoles();
  const { handleUpdate, submitting } = useGroupMutations();

  const currentGroup = useMemo(() => {
    if (!group) return null;
    return groups.find((g) => g.id === group.id) || group;
  }, [group, groups]);

  const initialSelectedRoles = useMemo(() => {
    return currentGroup?.roleRefs || [];
  }, [currentGroup]);

  const filteredRoles = useMemo(() => {
    return roles || [];
  }, [roles]);

  useEffect(() => {
    if (open && currentGroup && !rolesLoading && roles) {
      const assignedRoles = currentGroup.roleRefs || [];
      form.setFieldsValue({ roleRefs: assignedRoles });
    }
  }, [open, currentGroup, rolesLoading, roles, form]);

  const hasChanges = useMemo(() => {
    const current = (currentSelectedRoles as string[]) || [];
    const initial = initialSelectedRoles || [];
    return !arraysEqual(current, initial);
  }, [currentSelectedRoles, initialSelectedRoles]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!currentGroup) return;
    const selected = (values.roleRefs as string[]) || [];
    await handleUpdate(currentGroup.id, async () => ({
      roleRefs: applySelectionChange(
        await fetchFreshGroupIds(currentGroup.id, 'roleRefs'),
        initialSelectedRoles,
        selected,
      ),
    }));
    store.dispatch(fetchMyPermissionsThunk());
    form.resetFields();
    onClose();
  };

  return {
    currentGroup,
    initialSelectedRoles,
    hasChanges,
    filteredRoles,
    allRoles: roles,
    rolesLoading,
    submitting,
    handleSubmit,
  };
};
