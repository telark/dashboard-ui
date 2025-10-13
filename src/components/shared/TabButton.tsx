import React, { useState } from 'react';
import { DEFAULT_COLORS } from '../../constants';

export interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const background = active ? '#fff' : hovered ? 'rgba(32,201,151,0.08)' : 'transparent';
  const color = active ? '#0B1F33' : hovered ? DEFAULT_COLORS.SUCCESS : '#6b7280';

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        padding: '10px 18px',
        borderRadius: 22,
        background,
        color,
        fontWeight: active ? 700 : 600,
        boxShadow: active ? '0 6px 18px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
};

export default TabButton;
