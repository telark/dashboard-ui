import React from 'react';
import { Tooltip } from 'antd';
import {
  BUTTON_CONFIGS,
  CONTROL_FONT_SIZE,
  CONTROL_RADIUS,
  DEFAULT_COLORS,
  TOOLBAR_CONTROL,
} from '../../../constants';

// Same size as the label, so both share one baseline.
const COUNT_STYLE: React.CSSProperties = { opacity: 0.7, fontVariantNumeric: 'tabular-nums' };

// For light surfaces (panels). Selected in the panel tabs' ink (their underline and count badge),
// so a panel keeps one accent.
const PALETTE = {
  activeBg: DEFAULT_COLORS.TEXT_ON_SURFACE,
  activeColor: DEFAULT_COLORS.SURFACE_WHITE,
  activeBorder: DEFAULT_COLORS.TEXT_ON_SURFACE,
  inactiveColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  hoverAccent: DEFAULT_COLORS.TEXT_ON_SURFACE,
  hoverBg: DEFAULT_COLORS.SURFACE_HOVER,
};

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  /** Shown after the label, as on a tab. */
  count?: number;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  active,
  onClick,
  label,
  icon,
  tooltip,
  count,
}) => {
  const baseStyle: React.CSSProperties = {
    all: 'unset',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    height: TOOLBAR_CONTROL.HEIGHT,
    padding: TOOLBAR_CONTROL.PADDING,
    lineHeight: TOOLBAR_CONTROL.LINE_HEIGHT,
    borderRadius: CONTROL_RADIUS,
    fontSize: CONTROL_FONT_SIZE,
    fontWeight: active ? BUTTON_CONFIGS.PRIMARY_BUTTON.FONT_WEIGHT : 500,
    transition: 'all 0.2s',
    backgroundColor: active ? PALETTE.activeBg : 'transparent',
    color: active ? PALETTE.activeColor : PALETTE.inactiveColor,
    border: active ? `1px solid ${PALETTE.activeBorder}` : '1px solid transparent',
    boxSizing: 'border-box',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (active) return;
    e.currentTarget.style.backgroundColor = PALETTE.hoverBg;
    e.currentTarget.style.color = PALETTE.hoverAccent;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (active) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = PALETTE.inactiveColor;
  };

  return (
    <Tooltip title={tooltip} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        style={baseStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {icon && <span style={{ fontSize: 14, lineHeight: 1 }}>{icon}</span>}
        <span>{label}</span>
        {count !== undefined && <span style={COUNT_STYLE}>{count}</span>}
      </button>
    </Tooltip>
  );
};

export default ToggleButton;
