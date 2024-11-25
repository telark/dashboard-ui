import React from 'react';
import { Button } from 'antd';
import { DEFAULT_COLORS } from "../../config";

interface StatusButtonProps {
  status: 'Active' | 'Inactive';
  icon: JSX.Element;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, icon }) => {
  const statusStyle = status === 'Active'
    ? { color: DEFAULT_COLORS.SUCCESS, borderColor: DEFAULT_COLORS.SUCCESS }
    : { color: DEFAULT_COLORS.DEFAULT, borderColor: DEFAULT_COLORS.DEFAULT };

  return (
    <Button
      type="default"
      style={{
        color: statusStyle.color,
        borderColor: statusStyle.borderColor,
        borderRadius: '25px',
        padding: '0 12px',
        fontSize: '12px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {React.cloneElement(icon, { style: { marginRight: '4px' } })} {status}
    </Button>
  );
};

export default StatusButton;
