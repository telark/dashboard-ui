import React from 'react';
import { Tooltip } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { DEFAULT_COLORS, TOOLBAR_CONTROL } from '../../../constants';
import { useMediaQuery } from '../../../hooks/layout';

interface FilterButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  /** Set by a parent that measures its own width; falls back to the viewport. */
  compact?: boolean;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  label = 'Filter',
  disabled = false,
  compact,
}) => {
  const isViewportCompact = useMediaQuery(TOOLBAR_CONTROL.COMPACT_QUERY);
  const isCompact = compact ?? isViewportCompact;
  const filterButtonStyle: React.CSSProperties = {
    all: 'unset',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: isCompact ? 'center' : undefined,
    gap: isCompact ? 0 : 6,
    height: TOOLBAR_CONTROL.HEIGHT,
    width: isCompact ? TOOLBAR_CONTROL.HEIGHT : undefined,
    boxSizing: 'border-box',
    padding: isCompact ? 0 : TOOLBAR_CONTROL.PADDING,
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

  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isCompact ? label : undefined}
      style={filterButtonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FilterOutlined style={{ fontSize: 14, lineHeight: 1 }} />
      {!isCompact && <span>{label}</span>}
    </button>
  );

  // Without the label the icon alone has to carry the meaning.
  return isCompact ? <Tooltip title={label}>{button}</Tooltip> : button;
};

export default FilterButton;
