import React from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS } from '../../../constants';

interface SearchButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  active?: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  label = 'Search',
  disabled = false,
  active = false,
}) => {
  const Icon = active ? CloseOutlined : SearchOutlined;
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
    border: 'none',
    backgroundColor: active ? '#e6f7ff' : 'transparent',
    color: disabled ? '#d1d5db' : active ? DEFAULT_COLORS.SUCCESS : '#64748b',
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
    e.currentTarget.style.backgroundColor = active ? '#e6f7ff' : 'transparent';
    e.currentTarget.style.color = active ? DEFAULT_COLORS.SUCCESS : '#64748b';
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
      <Icon style={{ fontSize: 14, lineHeight: 1 }} />
      <span>{label}</span>
    </button>
  );
};

export default SearchButton;
