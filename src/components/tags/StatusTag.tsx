import React from 'react';
import { Button } from 'antd';
import { BUTTON_CONFIGS } from '../../constants';

interface StatusTagProps {
  label: string;
  icon: React.ReactElement;
  color: string;
  borderColor?: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ 
  label, 
  icon, 
  color, 
  borderColor 
}) => {
  return (
    <Button
      type="default"
      style={{
        color: color,
        borderColor: borderColor || color,
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
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: BUTTON_CONFIGS.STATUS_BUTTON.ICON_FONT_SIZE,
        }}
      >
        {icon}
      </span>
      <span style={{ display: 'inline-block' }}>{label}</span>
    </Button>
  );
};

export default StatusTag;
