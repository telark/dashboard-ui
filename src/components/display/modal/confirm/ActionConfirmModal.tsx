import React from 'react';
import { Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ACTION_CONFIRM_MODAL } from '../../../../constants';
import { useActionConfirmHandlers } from '../../../../hooks/layout/useActionConfirmHandlers';
import { ActionIcon, ActionCloseIcon } from '../../icons';
import { ActionTitle, ActionMessage } from '../../text';
import ActionButtons from '../../buttons/ActionButtons';

export interface ActionConfirmModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent) => void;
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
  const {
    handleModalCancel,
    handleCloseIconClick,
    handleCancelClick,
    handleConfirmClick,
  } = useActionConfirmHandlers({ onClose, onConfirm });

  const defaultIcon = (
    <DeleteOutlined
      style={{
        fontSize: ACTION_CONFIRM_MODAL.DEFAULT_ICON.FONT_SIZE,
        color: ACTION_CONFIRM_MODAL.DEFAULT_ICON.COLOR,
      }}
    />
  );
  const actionIcon = icon || defaultIcon;

  return (
    <Modal
        open={open}
        onCancel={handleModalCancel}
        title={null}
        width={ACTION_CONFIRM_MODAL.MODAL.WIDTH}
        footer={null}
        maskClosable={true}
        getContainer={false}
        closeIcon={<ActionCloseIcon onClick={handleCloseIconClick} />}
        className={ACTION_CONFIRM_MODAL.MODAL.CLASS_NAME}
        styles={{
          content: {
            borderRadius: ACTION_CONFIRM_MODAL.MODAL.BORDER_RADIUS,
            overflow: 'hidden',
            position: 'relative',
          },
          body: {
            padding: ACTION_CONFIRM_MODAL.CONTENT.PADDING,
          },
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: ACTION_CONFIRM_MODAL.CONTENT.GAP,
          }}
        >
          <ActionIcon icon={actionIcon} />
          <ActionTitle title={title} />
          <ActionMessage action={action} resourceName={resourceName} resourceType={resourceType} />
          <ActionButtons
            cancelText={cancelText}
            confirmText={confirmText || ''}
            action={action}
            loading={loading}
            danger={danger}
            onCancel={handleCancelClick}
            onConfirm={handleConfirmClick}
          />
        </div>
      </Modal>
  );
};

export default ActionConfirmModal;
