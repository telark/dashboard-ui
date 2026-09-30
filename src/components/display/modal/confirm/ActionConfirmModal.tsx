import React from 'react';
import { MODAL_CHROME } from '../../../../constants';
import { useActionConfirmHandlers } from '../../../../hooks/layout/useActionConfirmHandlers';
import { ActionMessage } from '../../text';
import ActionButtons from '../../buttons/ActionButtons';
import BaseModal from '../base/BaseModal';

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
  /** A consequence shown under the question, e.g. who loses access. */
  note?: string;
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
  cancelText,
  loading = false,
  confirmDisabled = false,
  danger = true,
  customMessage,
  note,
  offsetRight,
  getContainer = false,
}) => {
  const { handleModalCancel, handleCancelClick, handleConfirmClick } = useActionConfirmHandlers({
    onClose,
    onConfirm,
  });

  return (
    <BaseModal
      open={open}
      onCancel={handleModalCancel}
      title={title}
      description={
        <ActionMessage
          action={action}
          resourceName={resourceName}
          resourceType={resourceType}
          customMessage={customMessage}
        />
      }
      getContainer={getContainer}
      offsetRight={offsetRight}
      footer={
        <ActionButtons
          confirmText={confirmText || action}
          onConfirm={handleConfirmClick}
          onCancel={handleCancelClick}
          cancelText={cancelText}
          loading={loading}
          confirmDisabled={confirmDisabled}
          danger={danger}
        />
      }
    >
      {note && <div style={MODAL_CHROME.NOTE}>{note}</div>}
    </BaseModal>
  );
};

export default ActionConfirmModal;
