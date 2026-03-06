import React from 'react';
import { DEFAULT_COLORS } from '../../../constants';

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const ACTIVE_COLOR = DEFAULT_COLORS.SUCCESS;

const ToggleButton: React.FC<ToggleButtonProps> = ({
  active,
  onClick,
  label,
  icon,
  disabled = false,
}) => {
  const baseStyle: React.CSSProperties = {
    all: 'unset',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "'Roboto Condensed', sans-serif",
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
    backgroundColor: active ? `${ACTIVE_COLOR}18` : 'transparent',
    color: active ? ACTIVE_COLOR : '#64748b',
    border: active ? `1px solid ${ACTIVE_COLOR}40` : '1px solid transparent',
    boxSizing: 'border-box',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || active) return;
    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
    e.currentTarget.style.color = ACTIVE_COLOR;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || active) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#64748b';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ToggleButton;
