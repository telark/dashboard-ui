import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { FormInstance } from 'antd';
import { RootState } from '../../../../../store';
import { useGroupMutations } from '../';
import { useRoles } from '../../../roles/hooks';
import { useRoleTypeFilter } from './useRoleTypeFilter';
import type { Group } from '../../models';

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
  rolesLoading: boolean;
  submitting: boolean;
  selectedRoleType: string;
  setSelectedRoleType: (type: string) => void;
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
  const { selectedRoleType, setSelectedRoleType } = useRoleTypeFilter({ open });

  const currentGroup = useMemo(() => {
    if (!group) return null;
    return groups.find((g) => g.id === group.id) || group;
  }, [group, groups]);

  const initialSelectedRoles = useMemo(() => {
    return currentGroup?.assignedRolesIDs || [];
  }, [currentGroup]);

  const filteredRoles = useMemo(() => {
    if (!roles) return [];
    if (selectedRoleType === 'all') return roles;
    return roles.filter((role) => role.type === selectedRoleType);
  }, [roles, selectedRoleType]);

  useEffect(() => {
    if (open && currentGroup && !rolesLoading && roles) {
      const assignedRoles = currentGroup.assignedRolesIDs || [];
      form.setFieldsValue({ assignedRolesIDs: assignedRoles });
    }
  }, [open, currentGroup, rolesLoading, roles, form]);

  const hasChanges = useMemo(() => {
    const current = (currentSelectedRoles as string[]) || [];
    const initial = initialSelectedRoles || [];
    return !arraysEqual(current, initial);
  }, [currentSelectedRoles, initialSelectedRoles]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!currentGroup) return;
    const assignedRolesIDs = (values.assignedRolesIDs as string[]) || [];
    await handleUpdate(currentGroup.id, { assignedRolesIDs });
    form.resetFields();
    onClose();
  };

  return {
    currentGroup,
    initialSelectedRoles,
    hasChanges,
    filteredRoles,
    rolesLoading,
    submitting,
    selectedRoleType,
    setSelectedRoleType,
    handleSubmit,
  };
};
