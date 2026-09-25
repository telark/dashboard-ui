import React from 'react';
import { Modal } from 'antd';
import { ACTION_CONFIRM_MODAL } from '../../../../constants';
import { useActionConfirmHandlers } from '../../../../hooks/layout/useActionConfirmHandlers';
import { useOpenedOnce } from '../../../../hooks/layout/useOpenedOnce';
import { ActionCloseIcon } from '../../icons';
import { ActionTitle, ActionMessage } from '../../text';
import ActionButtons from '../../buttons/ActionButtons';

export interface ActionConfirmModalProps {
  open: boolean;
  onClose: (e?: React.MouseEvent | React.KeyboardEvent) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  action: string;
  resourceName: string;
  resourceType?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  danger?: boolean;
  customMessage?: React.ReactNode;
  /** Shifts the modal's centering leftward by this many px (useful when a side panel is open) */
  offsetRight?: number;
  /** Override the portal container; defaults to false (inline). Pass () => document.body for viewport centering. */
  getContainer?: false | (() => HTMLElement);
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
  confirmDisabled = false,
  danger = true,
  customMessage,
  offsetRight,
  getContainer = false,
}) => {
  const { handleModalCancel, handleCloseIconClick, handleCancelClick, handleConfirmClick } =
    useActionConfirmHandlers({ onClose, onConfirm });
  const opened = useOpenedOnce(open);

  if (!opened) return null;
  return (
    <Modal
      open={open}
      onCancel={handleModalCancel}
      title={null}
      width={ACTION_CONFIRM_MODAL.MODAL.WIDTH}
      zIndex={ACTION_CONFIRM_MODAL.MODAL.Z_INDEX}
      footer={null}
      mask={{ closable: true }}
      getContainer={getContainer}
      closeIcon={<ActionCloseIcon onClick={handleCloseIconClick} />}
      className={ACTION_CONFIRM_MODAL.MODAL.CLASS_NAME}
      styles={{
        container: {
          borderRadius: ACTION_CONFIRM_MODAL.MODAL.BORDER_RADIUS,
          overflow: 'hidden',
          position: 'relative',
        },
        body: {
          padding: ACTION_CONFIRM_MODAL.CONTENT.PADDING,
        },
        wrapper: offsetRight ? { paddingRight: offsetRight } : undefined,
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
        <ActionTitle title={title} />
        <ActionMessage
          action={action}
          resourceName={resourceName}
          resourceType={resourceType}
          customMessage={customMessage}
        />
        <ActionButtons
          cancelText={cancelText}
          confirmText={confirmText || ''}
          action={action}
          loading={loading}
          confirmDisabled={confirmDisabled}
          danger={danger}
          onCancel={handleCancelClick}
          onConfirm={handleConfirmClick}
        />
      </div>
    </Modal>
  );
};

export default ActionConfirmModal;
