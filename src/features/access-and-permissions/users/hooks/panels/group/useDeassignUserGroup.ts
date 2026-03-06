import type { FormInstance } from 'antd';
import { useDeassignUserField } from '../shared/useDeassignUserField';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User } from '../../../models';
import type { Group } from '../../../../groups/models';

interface UseDeassignUserGroupOptions {
  user: User | null;
  form: FormInstance;
  onSuccess?: (updatedGroups: string[]) => void;
}

interface UseDeassignUserGroupReturn {
  deassignModalOpen: boolean;
  deassigningGroup: Group | null;
  isDeassigning: boolean;
  openDeassignModal: (group: Group) => void;
  closeDeassignModal: () => void;
  handleConfirmDeassign: () => Promise<void>;
}

export const useDeassignUserGroup = ({
  user,
  form,
  onSuccess,
}: UseDeassignUserGroupOptions): UseDeassignUserGroupReturn => {
  const { modalOpen, deassigningItem, isDeassigning, openModal, closeModal, handleConfirm } =
    useDeassignUserField<Group>({
      user,
      form,
      fieldName: 'assignedGroupsIDs',
      successMessage: UC.LABELS.MESSAGES.GROUP_DEASSIGNED,
      failMessage: UC.LABELS.MESSAGES.GROUP_DEASSIGN_FAILED,
      onSuccess,
    });

  return {
    deassignModalOpen: modalOpen,
    deassigningGroup: deassigningItem,
    isDeassigning,
    openDeassignModal: openModal,
    closeDeassignModal: closeModal,
    handleConfirmDeassign: handleConfirm,
  };
};
