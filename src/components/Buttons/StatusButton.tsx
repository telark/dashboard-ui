import React from 'react';
import { Button } from 'antd';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_STATES } from '../../constants';

interface StatusButtonProps {
  status: typeof BUTTON_STATES.STATUS.ACTIVE | typeof BUTTON_STATES.STATUS.INACTIVE;
  icon: React.ReactElement;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, icon }) => {
  const statusStyle =
    status === BUTTON_STATES.STATUS.ACTIVE
      ? { color: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }
      : { color: DEFAULT_COLORS.DEFAULT, borderColor: DEFAULT_COLORS.DEFAULT };

  return (
    <Button
      type={BUTTON_CONFIGS.STATUS_BUTTON.TYPE}
      style={{
        color: statusStyle.color,
        borderColor: statusStyle.borderColor,
        borderRadius: BUTTON_CONFIGS.STATUS_BUTTON.BORDER_RADIUS,
        padding: BUTTON_CONFIGS.STATUS_BUTTON.PADDING,
        fontSize: BUTTON_CONFIGS.STATUS_BUTTON.FONT_SIZE,
        height: BUTTON_CONFIGS.STATUS_BUTTON.HEIGHT,
        lineHeight: BUTTON_CONFIGS.STATUS_BUTTON.LINE_HEIGHT,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: BUTTON_CONFIGS.STATUS_BUTTON.GAP,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: BUTTON_CONFIGS.STATUS_BUTTON.ICON_FONT_SIZE }}>{icon}</span>
      <span style={{ display: 'inline-block' }}>{status}</span>
    </Button>
  );
};

export default StatusButton;
