import React from 'react';
import { Button } from 'antd';
import { DEFAULT_COLORS } from '../../constants';

interface StatusButtonProps {
  status: 'Active' | 'Inactive';
  icon: React.ReactElement;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, icon }) => {
  const statusStyle =
    status === 'Active'
      ? { color: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }
      : { color: DEFAULT_COLORS.DEFAULT, borderColor: DEFAULT_COLORS.DEFAULT };

  return (
    <Button
      type="default"
      style={{
        color: statusStyle.color,
        borderColor: statusStyle.borderColor,
        borderRadius: '18px',
        padding: '2px 8px',
        fontSize: '11px',
        height: 26,
        lineHeight: '22px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{icon}</span>
      <span style={{ display: 'inline-block' }}>{status}</span>
    </Button>
  );
};

export default StatusButton;
