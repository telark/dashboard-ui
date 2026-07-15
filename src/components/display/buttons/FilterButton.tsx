import React from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, TOOLBAR_CONTROL } from '../../../constants';

interface FilterButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  label = 'Filter',
  disabled = false,
}) => {
  const filterButtonStyle: React.CSSProperties = {
    all: 'unset',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: TOOLBAR_CONTROL.HEIGHT,
    boxSizing: 'border-box',
    padding: TOOLBAR_CONTROL.PADDING,
    lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    backgroundColor: 'transparent',
    color: disabled ? '#d1d5db' : DEFAULT_COLORS.TEXT_MUTED,
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.SURFACE_WHITE;
    e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = DEFAULT_COLORS.TEXT_MUTED;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={filterButtonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FilterOutlined style={{ fontSize: 14, lineHeight: 1 }} />
      <span>{label}</span>
    </button>
  );
};

export default FilterButton;
