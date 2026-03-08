import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ACTION_CONFIRM_MODAL } from '../../../constants';

interface ActionCloseIconProps {
  onClick: (e: React.MouseEvent) => void;
}

const ActionCloseIcon: React.FC<ActionCloseIconProps> = ({ onClick }) => {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: ACTION_CONFIRM_MODAL.CLOSE_ICON.SIZE,
        height: ACTION_CONFIRM_MODAL.CLOSE_ICON.SIZE,
        borderRadius: ACTION_CONFIRM_MODAL.CLOSE_ICON.BORDER_RADIUS,
        background: ACTION_CONFIRM_MODAL.CLOSE_ICON.BACKGROUND,
        color: ACTION_CONFIRM_MODAL.CLOSE_ICON.COLOR,
      }}
    >
      <CloseOutlined
        style={{
          fontSize: ACTION_CONFIRM_MODAL.CLOSE_ICON.ICON_SIZE,
          color: ACTION_CONFIRM_MODAL.CLOSE_ICON.COLOR,
        }}
      />
    </span>
  );
};

export default ActionCloseIcon;
