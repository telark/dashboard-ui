import React, { memo } from 'react';
import { Modal } from 'antd';
import { SECURITY_SECTION_CONSTANTS } from '../constants';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

export interface RevokeSessionModalProps {
  open: boolean;
  message: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  confirming: boolean;
}

const RevokeSessionModal: React.FC<RevokeSessionModalProps> = memo(
  ({ open, message, onConfirm, onCancel, confirming }) => (
    <Modal
      open={open}
      title={LABELS.REVOKE_CONFIRM_MODAL.TITLE}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={LABELS.REVOKE_CONFIRM_MODAL.OK}
      cancelText={LABELS.REVOKE_CONFIRM_MODAL.CANCEL}
      okButtonProps={{ loading: confirming, danger: true }}
      centered
      destroyOnHidden
    >
      <p>{message}</p>
    </Modal>
  ),
);

RevokeSessionModal.displayName = 'RevokeSessionModal';

export default RevokeSessionModal;
