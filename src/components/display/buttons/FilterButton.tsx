import React from 'react';
import { FilterOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';

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
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    border: 'none',
    backgroundColor: 'transparent',
    color: disabled ? '#d1d5db' : '#64748b',
    fontFamily: "'Roboto Condensed', sans-serif",
    transition: 'all 0.2s',
    opacity: disabled ? 0.6 : 1,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.HOVER_BG;
    e.currentTarget.style.color = DEFAULT_COLORS.SUCCESS;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#64748b';
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
