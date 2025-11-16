import React from 'react';
import { Modal, Button, Space } from 'antd';
import { LOGIN_CONSTANTS } from '../../constants/pages/login';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import logger from '../../logging';

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
  // Log error for analytics
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
      width={480}
      destroyOnHidden
    >
      <div style={{ padding: '8px 0' }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
          Authentication Failed
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
          {isNotFoundError
            ? 'No passkeys were found in your browser. This may happen if you cleared your browser data or switched devices.'
            : 'Unable to authenticate with your passkey. This may happen if you cancelled the authentication or if your passkey is no longer available.'}
        </p>
        <p style={{ fontSize: 13, color: '#999', marginBottom: 24, lineHeight: 1.5 }}>
          {isNotFoundError
            ? 'If you no longer have access to your passkeys, you can remove the orphaned passkeys from your account and register a new one.'
            : 'You can try again, or if you no longer have access to your passkeys, you can remove them from your account.'}
        </p>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
            block
            onClick={onRetry}
            disabled={isRemoving}
            style={{ height: 40 }}
          >
            Try Again
          </Button>
          <Button
            type="default"
            danger
            block
            onClick={onRemove}
            loading={isRemoving}
            disabled={isRemoving}
            style={{ height: 40 }}
          >
            {isRemoving ? 'Removing...' : "I don't have my passkey (Remove orphaned passkeys)"}
          </Button>
          <Button block onClick={onCancel} disabled={isRemoving} style={{ height: 40 }}>
            Cancel
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default OrphanedPasskeysModal;

