import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../constants';

export interface ActionListItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const ActionListItem: React.FC<ActionListItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        border: 'none',
        background: 'transparent',
        padding: '12px 8px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: active ? 'rgba(32,201,151,0.12)' : 'rgba(32,201,151,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: DEFAULT_COLORS.SUCCESS,
          fontSize: 18,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, textAlign: 'left', color: active ? '#0B1F33' : '#5B6B7C', fontWeight: 700 }}>
        {label}
      </div>
      <RightOutlined style={{ color: '#9AA8B2', fontSize: 12 }} />
    </button>
  );
};

export default ActionListItem;


