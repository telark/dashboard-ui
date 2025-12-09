import React from 'react';
import { Modal, Button } from 'antd';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { SLIDE_OUT } from '../../../constants';

export interface ActionConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  action: string;
  resourceName: string;
  resourceType?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}

const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  action,
  resourceName,
  resourceType,
  confirmText,
  cancelText = 'Cancel',
  loading = false,
  danger = true,
  icon,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  const message = resourceType
    ? `Are you sure you want to ${action} ${resourceType} `
    : `Are you sure you want to ${action} `;

  const defaultIcon = <DeleteOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />;
  const actionIcon = icon || defaultIcon;

  return (
    <>
      <style>
        {`
          .action-confirm-modal .ant-modal-close {
            top: 8px !important;
            right: 8px !important;
            width: 20px !important;
            height: 20px !important;
            line-height: 20px !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .action-confirm-modal .ant-modal-close-x {
            width: 20px !important;
            height: 20px !important;
            line-height: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #ffffff !important;
          }
          .action-confirm-modal .ant-modal-close-x svg {
            color: #ffffff !important;
            fill: #ffffff !important;
          }
          .action-confirm-modal .ant-modal-close-x svg path {
            fill: #ffffff !important;
            stroke: #ffffff !important;
          }
          .action-confirm-modal .ant-modal-close:hover {
            background: transparent !important;
          }
          .action-confirm-modal .ant-modal-close:focus {
            background: transparent !important;
            outline: none !important;
          }
          .action-confirm-modal .ant-modal-close:active {
            background: transparent !important;
          }
          .action-confirm-modal .ant-modal-close-x:hover {
            background: transparent !important;
          }
          .action-confirm-modal .ant-modal-close-x:focus {
            background: transparent !important;
            outline: none !important;
          }
          .action-confirm-modal .ant-modal-close-x:active {
            background: transparent !important;
          }
        `}
      </style>
      <Modal
        open={open}
        onCancel={onClose}
        title={null}
        width={360}
        footer={null}
        maskClosable={false}
        closeIcon={
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#777',
              color: '#ffffff',
            }}
          >
            <CloseOutlined style={{ fontSize: 10, color: '#ffffff' }} />
          </span>
        }
        className="action-confirm-modal"
        styles={{
          content: {
            borderRadius: 12,
            overflow: 'hidden',
            position: 'relative',
          },
          body: {
            padding: '16px 20px 8px',
          },
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 50,
              height: 50,
              minWidth: 50,
              minHeight: 50,
              maxWidth: 50,
              maxHeight: 50,
              borderRadius: 10,
              background: '#fff1f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
            }}
          >
            {actionIcon}
          </div>

          {/* Title */}
          <h3
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: '#0B1F33',
              textAlign: 'center',
            }}
          >
            {title}
          </h3>

          {/* Message */}
          <div
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: '#64748b',
              textAlign: 'center',
              marginTop: -7,
            }}
          >
            {message}
            <span
              style={{
                fontWeight: 700,
                color: '#0B1F33',
              }}
            >
              {resourceName}
            </span>
            ?
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              marginTop: 10,
              marginBottom: -12,
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              disabled={loading}
              style={SLIDE_OUT.CANCEL_BUTTON}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_HOVER_BACKGROUND;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_BACKGROUND;
              }}
            >
              {cancelText}
            </button>
            <Button
              type="primary"
              danger={danger}
              loading={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleConfirm();
              }}
              style={{
                borderRadius: 6,
                fontWeight: 500,
                height: 36,
                padding: '0 16px',
              }}
            >
              {confirmText || action}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ActionConfirmModal;
