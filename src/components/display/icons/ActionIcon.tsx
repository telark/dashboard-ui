import React from 'react';
import { ACTION_CONFIRM_MODAL } from '../../../constants';

interface ActionIconProps {
  icon: React.ReactNode;
}

const ActionIcon: React.FC<ActionIconProps> = ({ icon }) => {
  return (
    <div
      style={{
        width: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        height: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        minWidth: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        minHeight: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        maxWidth: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        maxHeight: ACTION_CONFIRM_MODAL.ICON_CONTAINER.SIZE,
        borderRadius: ACTION_CONFIRM_MODAL.ICON_CONTAINER.BORDER_RADIUS,
        background: ACTION_CONFIRM_MODAL.ICON_CONTAINER.BACKGROUND,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      {icon}
    </div>
  );
};

export default ActionIcon;
