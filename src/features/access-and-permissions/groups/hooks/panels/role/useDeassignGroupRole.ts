import { useCallback } from 'react';
import { message } from 'antd';
import type { FormInstance } from 'antd';
import { useDeassignModal } from '../../../../shared';
import { useGroupMutations } from '../../data/useGroupMutations';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import store from '../../../../../../store';
import { fetchMyPermissionsThunk } from '../../../../../auth/store/thunks/fetchThunks';
import type { Group } from '../../../models';
import type { Role } from '../../../../roles/models';

interface UseDeassignGroupRoleOptions {
  group: Group | null;
  form: FormInstance;
  onSuccess?: (updatedRoleIds: string[]) => void;
}

interface UseDeassignGroupRoleReturn {
  deassignModalOpen: boolean;
  deassigningRole: Role | null;
  isDeassigning: boolean;
  openDeassignModal: (role: Role) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignGroupRole = ({
  group,
  form,
  onSuccess,
}: UseDeassignGroupRoleOptions): UseDeassignGroupRoleReturn => {
  const { handleUpdate } = useGroupMutations();

  const performDeassign = useCallback(
    async (role: Role) => {
      if (!group) throw new Error('No group selected');
      const current = (form.getFieldValue('assignedRolesIDs') as string[]) ?? [];
      const updated = current.filter((id) => id !== role.id);
      await handleUpdate(group.id, { assignedRolesIDs: updated });
      store.dispatch(fetchMyPermissionsThunk());
      form.setFieldsValue({ assignedRolesIDs: updated });
      message.success(GC.LABELS.MESSAGES.ROLE_DEASSIGNED(role.name));
    },
    [group, form, handleUpdate],
  );

  const handleDeassignSuccess = useCallback(() => {
    const updatedIds = (form.getFieldValue('assignedRolesIDs') as string[]) ?? [];
    onSuccess?.(updatedIds);
  }, [form, onSuccess]);

  const {
    modalOpen: deassignModalOpen,
    deassigningItem: deassigningRole,
    isDeassigning,
    openModal: openDeassignModal,
    closeModal: closeDeassignModal,
    handleConfirm: handleConfirmDeassign,
  } = useDeassignModal<Role>({
    onConfirm: performDeassign,
    onSuccess: handleDeassignSuccess,
  });

  return {
    deassignModalOpen,
    deassigningRole,
    isDeassigning,
    openDeassignModal,
    closeDeassignModal,
    handleConfirmDeassign,
  };
};
