import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { GROUPS_CONSTANTS as GC } from '../../constants';

interface GroupDeleteModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => Promise<void>;
  groupName: string;
  loading: boolean;
}

const GroupDeleteModal: React.FC<GroupDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  groupName,
  loading,
}) => {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={GC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={groupName}
        resourceType="group"
        confirmText={GC.LABELS.ACTIONS.DELETE_MODAL_OK}
        loading={loading}
      />
    </div>
  );
};

export default GroupDeleteModal;
