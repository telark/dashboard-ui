import React from 'react';
import { Button } from 'antd';
import { BUTTON_TEXTS, MODAL_CHROME, SLIDE_OUT } from '../../../constants';

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
    <div style={MODAL_CHROME.ACTIONS.ROW}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          style={SLIDE_OUT.CANCEL_BUTTON}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_HOVER_BACKGROUND;
              e.currentTarget.style.color = SLIDE_OUT.CANCEL_BUTTON_HOVER_COLOR;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_BACKGROUND;
            e.currentTarget.style.color = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_COLOR;
          }}
        >
          {cancelText}
        </button>
      )}
      <Button
        type="primary"
        danger={danger}
        loading={loading}
        disabled={confirmDisabled}
        onClick={onConfirm}
        style={MODAL_CHROME.ACTIONS.PRIMARY}
      >
        {confirmText}
      </Button>
    </div>
  );
};

export default ActionButtons;
