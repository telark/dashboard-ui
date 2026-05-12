import React from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
import { USERS_CONSTANTS as UC } from '../../constants';

interface UserDeleteModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => Promise<void>;
  userName: string;
  loading: boolean;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  userName,
  loading,
}) => {
  return (
    <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <ActionConfirmModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        title={UC.LABELS.ACTIONS.DELETE_MODAL_TITLE}
        action="delete"
        resourceName={userName}
        resourceType="user"
        confirmText={UC.LABELS.ACTIONS.DELETE_MODAL_OK}
        cancelText={UC.LABELS.MODAL.CANCEL}
        loading={loading}
        danger={true}
      />
    </div>
  );
};

export default UserDeleteModal;
