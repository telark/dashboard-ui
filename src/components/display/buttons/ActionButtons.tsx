import React from 'react';
import { Button } from 'antd';
import { SLIDE_OUT } from '../../../constants';
import { ACTION_CONFIRM_MODAL } from '../../../constants';

interface ActionButtonsProps {
  cancelText: string;
  confirmText: string;
  action: string;
  loading: boolean;
  danger: boolean;
  onCancel: (e: React.MouseEvent) => void;
  onConfirm: (e: React.MouseEvent) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  cancelText,
  confirmText,
  action,
  loading,
  danger,
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: ACTION_CONFIRM_MODAL.BUTTONS.GAP,
        marginTop: ACTION_CONFIRM_MODAL.BUTTONS.MARGIN_TOP,
        marginBottom: ACTION_CONFIRM_MODAL.BUTTONS.MARGIN_BOTTOM,
      }}
    >
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
      <Button
        type="primary"
        danger={danger}
        loading={loading}
        onClick={onConfirm}
        style={{
          borderRadius: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.BORDER_RADIUS,
          fontWeight: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.FONT_WEIGHT,
          height: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.HEIGHT,
          padding: ACTION_CONFIRM_MODAL.BUTTONS.CONFIRM.PADDING,
        }}
      >
        {confirmText || action}
      </Button>
    </div>
  );
};

export default ActionButtons;
