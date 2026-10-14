import React from 'react';
import { Tooltip } from 'antd';
import {
  BUTTON_CONFIGS,
  CONTROL_FONT_SIZE,
  CONTROL_RADIUS,
  DEFAULT_COLORS,
  TOOLBAR_CONTROL,
  getPillSurface,
} from '../../../constants';

type ToggleButtonVariant = 'success' | 'danger';

const DANGER_TEXT = getPillSurface(DEFAULT_COLORS.DANGER).background;
// Same size as the label, so both share one baseline.
const COUNT_STYLE: React.CSSProperties = { opacity: 0.7, fontVariantNumeric: 'tabular-nums' };

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
  /** Shown after the label, as on a tab. */
  count?: number;
  /** `success` matches manage-role toggles. Both variants are for light surfaces (panels). */
  variant?: ToggleButtonVariant;
}

function paletteForVariant(variant: ToggleButtonVariant) {
  if (variant === 'danger') {
    return {
      activeBg: `${DEFAULT_COLORS.DANGER}18`,
      activeColor: DANGER_TEXT,
      activeBorder: `${DEFAULT_COLORS.DANGER}40`,
      inactiveColor: DANGER_TEXT,
      hoverAccent: DANGER_TEXT,
      hoverBg: DEFAULT_COLORS.SURFACE_HOVER,
    };
  }
  // Selected in the panel tabs' ink (their underline and count badge), so a panel keeps one accent.
  return {
    activeBg: DEFAULT_COLORS.TEXT_ON_SURFACE,
    activeColor: DEFAULT_COLORS.SURFACE_WHITE,
    activeBorder: DEFAULT_COLORS.TEXT_ON_SURFACE,
    inactiveColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    hoverAccent: DEFAULT_COLORS.TEXT_ON_SURFACE,
    hoverBg: DEFAULT_COLORS.SURFACE_HOVER,
  };
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  active,
  onClick,
  label,
  icon,
  disabled = false,
  tooltip,
  count,
  variant = 'success',
}) => {
  const p = paletteForVariant(variant);
  const baseStyle: React.CSSProperties = {
    all: 'unset',
    cursor: disabled ? 'not-allowed' : 'pointer',
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
    opacity: disabled ? 0.6 : 1,
    backgroundColor: active ? p.activeBg : 'transparent',
    color: active ? p.activeColor : p.inactiveColor,
    border: active ? `1px solid ${p.activeBorder}` : '1px solid transparent',
    boxSizing: 'border-box',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || active) return;
    e.currentTarget.style.backgroundColor = p.hoverBg;
    e.currentTarget.style.color = p.hoverAccent;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || active) return;
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = p.inactiveColor;
  };

  return (
    <Tooltip title={tooltip} placement="bottom">
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
        {count !== undefined && <span style={COUNT_STYLE}>{count}</span>}
      </button>
    </Tooltip>
  );
};

export default ToggleButton;
