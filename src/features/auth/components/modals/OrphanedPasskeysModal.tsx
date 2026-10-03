import React from 'react';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { MODAL_CHROME } from '../../../../constants';
import { BaseModal } from '../../../../components/display/modal';
import { ActionButtons } from '../../../../components/display/buttons';
import logger from '../../../../logging';

interface OrphanedPasskeysModalProps {
  open: boolean;
  errorName?: string;
  onRetry: () => void;
  onLostPasskey: () => void;
  onCancel: () => void;
}

const OrphanedPasskeysModal: React.FC<OrphanedPasskeysModalProps> = ({
  open,
  errorName,
  onRetry,
  onLostPasskey,
  onCancel,
}) => {
  if (errorName) {
    logger.info('[Login] Authentication failed:', {
      errorName,
      timestamp: new Date().toISOString(),
    });
  }

  const isNotFoundError = errorName === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND;

  const modal = AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL;

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={modal.TITLE}
      description={isNotFoundError ? modal.NOT_FOUND_MESSAGE : modal.GENERAL_MESSAGE}
      footer={
        <ActionButtons
          confirmText={modal.BUTTONS.RETRY}
          onConfirm={onRetry}
          onCancel={onLostPasskey}
          cancelText={modal.BUTTONS.REMOVE}
        />
      }
    >
      <p style={MODAL_CHROME.HINT}>
        {isNotFoundError ? modal.NOT_FOUND_DESCRIPTION : modal.GENERAL_DESCRIPTION}
      </p>
    </BaseModal>
  );
};

export default OrphanedPasskeysModal;
