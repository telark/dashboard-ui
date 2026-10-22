import React from 'react';
import { Tooltip } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import {
  BUTTON_COLORS,
  DEFAULT_COLORS,
  TOOLBAR_CONTROL,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../constants';
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
    gap: isCompact ? SPACING.NONE : SPACING.S6,
    height: TOOLBAR_CONTROL.HEIGHT,
    width: isCompact ? TOOLBAR_CONTROL.HEIGHT : undefined,
    boxSizing: 'border-box',
    padding: isCompact ? SPACING.NONE : TOOLBAR_CONTROL.PADDING,
    lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
    borderRadius: RADIUS.SM,
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.MEDIUM,
    border: 'none',
    backgroundColor: 'transparent',
    color: disabled ? BUTTON_COLORS.TOOLBAR_DISABLED_TEXT : BUTTON_COLORS.MUTED_TEXT,
    transition: `all ${MOTION.BASE_MS}ms`,
    opacity: disabled ? 0.6 : 1,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = BUTTON_COLORS.TOOLBAR_HOVER_BG;
    e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = BUTTON_COLORS.MUTED_TEXT;
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
      <FilterOutlined style={{ fontSize: FONT_SIZE.BASE, lineHeight: LINE_HEIGHT.NONE }} />
      {!isCompact && <span>{label}</span>}
    </button>
  );

  // Without the label the icon alone has to carry the meaning.
  return isCompact ? <Tooltip title={label}>{button}</Tooltip> : button;
};

export default FilterButton;
