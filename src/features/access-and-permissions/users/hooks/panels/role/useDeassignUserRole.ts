import type { FormInstance } from 'antd';
import { useDeassignUserField } from '../shared/useDeassignUserField';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User } from '../../../models';
import type { Role } from '../../../../roles/models';

interface UseDeassignUserRoleOptions {
  user: User | null;
  form: FormInstance;
  onSuccess?: (updatedRoles: string[]) => void;
}

interface UseDeassignUserRoleReturn {
  deassignModalOpen: boolean;
  deassigningRole: Role | null;
  isDeassigning: boolean;
  openDeassignModal: (role: Role) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignUserRole = ({
  user,
  form,
  onSuccess,
}: UseDeassignUserRoleOptions): UseDeassignUserRoleReturn => {
  const { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm } =
    useDeassignUserField<Role>({
      user,
      form,
      fieldName: 'assignedRolesIDs',
      successMessage: UC.LABELS.MESSAGES.ROLE_DEASSIGNED,
      failMessage: UC.LABELS.MESSAGES.ROLE_DEASSIGN_FAILED,
      onSuccess,
    });

  return {
    deassignModalOpen: modalOpen,
    deassigningRole: deassigningItem,
    isDeassigning,
    openDeassignModal: openModal,
    closeDeassignModal: closeModal,
    handleConfirmDeassign: handleConfirm,
  };
};
