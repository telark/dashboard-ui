import React from 'react';
import { Tooltip } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import {
  DEFAULT_COLORS,
  DISABLED_OPACITY,
  TOOLBAR_CONTROL,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  MOTION,
  RADIUS,
  SPACING,
} from '../../../constants';
import { useMediaQuery } from '../../../hooks/layout';

interface SearchButtonProps {
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
  active?: boolean;
  /** Set by a parent that measures its own width; falls back to the viewport. */
  compact?: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  label = 'Search',
  disabled = false,
  active = false,
  compact,
}) => {
  const isViewportCompact = useMediaQuery(TOOLBAR_CONTROL.COMPACT_QUERY);
  const isCompact = compact ?? isViewportCompact;
  const Icon = active ? CloseOutlined : SearchOutlined;
  const baseStyle: React.CSSProperties = {
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
    backgroundColor: active ? DEFAULT_COLORS.SURFACE_WHITE : 'transparent',
    color: disabled
      ? DEFAULT_COLORS.TEXT_DISABLED
      : active
        ? DEFAULT_COLORS.TEXT_ON_SURFACE
        : DEFAULT_COLORS.TEXT_MUTED,
    transition: `all ${MOTION.BASE_MS}ms`,
    opacity: disabled ? DISABLED_OPACITY : 1,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = DEFAULT_COLORS.SURFACE_WHITE;
    e.currentTarget.style.color = DEFAULT_COLORS.TEXT_ON_SURFACE;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.currentTarget.style.backgroundColor = active ? DEFAULT_COLORS.SURFACE_WHITE : 'transparent';
    e.currentTarget.style.color = active
      ? DEFAULT_COLORS.TEXT_ON_SURFACE
      : DEFAULT_COLORS.TEXT_MUTED;
  };

  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isCompact ? label : undefined}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Icon style={{ fontSize: FONT_SIZE.BASE, lineHeight: LINE_HEIGHT.NONE }} />
      {!isCompact && <span>{label}</span>}
    </button>
  );

  // Without the label the icon alone has to carry the meaning.
  return isCompact ? <Tooltip title={label}>{button}</Tooltip> : button;
};

export default SearchButton;
