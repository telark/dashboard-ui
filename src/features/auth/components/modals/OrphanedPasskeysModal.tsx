import React from 'react';
import { Modal, Button, Space } from 'antd';
import { AiOutlineClose } from 'react-icons/ai';
import { LOGIN_CONSTANTS } from '../../constants/login';
import { AUTH_ERROR_MESSAGES } from '../../constants';
import { DEFAULT_COLORS } from '../../../../constants';
import logger from '../../../../logging';

interface OrphanedPasskeysModalProps {
  open: boolean;
  errorName?: string;
  onRetry: () => void;
  onRemove: () => void;
  onCancel: () => void;
  isRemoving?: boolean;
}

const OrphanedPasskeysModal: React.FC<OrphanedPasskeysModalProps> = ({
  open,
  errorName,
  onRetry,
  onRemove,
  onCancel,
  isRemoving = false,
}) => {
  if (errorName) {
    logger.info('[Login] Authentication failed:', {
      errorName,
      timestamp: new Date().toISOString(),
    });
  }

  const isNotFoundError = errorName === LOGIN_CONSTANTS.WEBAUTHN.ERROR_NAMES.NOT_FOUND;

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      centered
      closable
      width={400}
      destroyOnHidden
      styles={{
        body: { padding: '24px', minHeight: 'auto' },
        container: { borderRadius: 16, overflow: 'hidden' },
      }}
      closeIcon={
        <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0 20px' }}>
          <AiOutlineClose size={18} color={DEFAULT_COLORS.TEXT_ON_SURFACE} />
        </span>
      }
    >
      <div style={{ padding: 0 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          {AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.TITLE}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          {isNotFoundError
            ? AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.NOT_FOUND_MESSAGE
            : AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.GENERAL_MESSAGE}
        </p>
        <p
          style={{
            fontSize: 12,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED,
            marginBottom: 20,
            lineHeight: 1.4,
          }}
        >
          {isNotFoundError
            ? AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.NOT_FOUND_DESCRIPTION
            : AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.GENERAL_DESCRIPTION}
        </p>

        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Button
            type="primary"
            block
            onClick={onRetry}
            disabled={isRemoving}
            style={{
              backgroundColor: DEFAULT_COLORS.SUCCESS,
              borderColor: DEFAULT_COLORS.SUCCESS,
            }}
          >
            {AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.BUTTONS.RETRY}
          </Button>
          <Button
            type="default"
            danger
            block
            onClick={onRemove}
            loading={isRemoving}
            disabled={isRemoving}
          >
            {isRemoving
              ? AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.BUTTONS.REMOVING
              : AUTH_ERROR_MESSAGES.ORPHANED_PASSKEYS_MODAL.BUTTONS.REMOVE}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default OrphanedPasskeysModal;
