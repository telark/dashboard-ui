import React, { memo } from 'react';
import { ActionConfirmModal } from '../../../../../components/display/modal';
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
    <ActionConfirmModal
      open={open}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={LABELS.REVOKE_CONFIRM_MODAL.TITLE}
      action={LABELS.REVOKE_CONFIRM_MODAL.OK}
      resourceName=""
      customMessage={message}
      confirmText={LABELS.REVOKE_CONFIRM_MODAL.OK}
      cancelText={LABELS.REVOKE_CONFIRM_MODAL.CANCEL}
      loading={confirming}
      getContainer={() => document.body}
    />
  ),
);

RevokeSessionModal.displayName = 'RevokeSessionModal';

export default RevokeSessionModal;
