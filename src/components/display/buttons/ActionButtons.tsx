import React from 'react';
import { Button } from 'antd';
import { BUTTON_TEXTS, PANEL_FOOTER } from '../../../constants';

interface ActionButtonsProps {
  confirmText: string;
  onConfirm: (e: React.MouseEvent) => void;
  /** Without it the confirm button is the only action. */
  onCancel?: (e: React.MouseEvent) => void;
  cancelText?: string;
  loading?: boolean;
  confirmDisabled?: boolean;
  danger?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  confirmText,
  onConfirm,
  onCancel,
  cancelText = BUTTON_TEXTS.CANCEL,
  loading = false,
  confirmDisabled = false,
  danger = false,
}) => {
  return (
    <div style={PANEL_FOOTER.ACTIONS}>
      {onCancel && (
        <Button
          type="text"
          className={PANEL_FOOTER.CANCEL_CLASS}
          onClick={onCancel}
          disabled={loading}
        >
          {cancelText}
        </Button>
      )}
      <Button
        type="primary"
        danger={danger}
        loading={loading}
        // A running action keeps its solid look with the spinner; antd ignores clicks while loading.
        disabled={confirmDisabled && !loading}
        onClick={onConfirm}
      >
        {confirmText}
      </Button>
    </div>
  );
};

export default ActionButtons;
