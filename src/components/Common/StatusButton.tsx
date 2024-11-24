import React from 'react';
import { Button } from 'antd';

interface StatusButtonProps {
  status: 'Active' | 'Inactive';
  icon: JSX.Element;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, icon }) => {
  const statusStyle = status === 'Active'
    ? { color: '#20C997', borderColor: '#20C997' }
    : { color: '#999', borderColor: '#999' };

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
