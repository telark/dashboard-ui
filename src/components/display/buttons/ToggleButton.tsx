import React from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS, getPillSurface } from '../../../constants';

type ToggleButtonVariant = 'success' | 'danger';

const DANGER_TEXT = getPillSurface(DEFAULT_COLORS.DANGER).background;

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: string;
  /** `success` matches manage-role toggles; `danger` is light-surface only. */
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
  return {
    activeBg: `${DEFAULT_COLORS.SUCCESS}18`,
    activeColor: DEFAULT_COLORS.SUCCESS,
    activeBorder: `${DEFAULT_COLORS.SUCCESS}40`,
    inactiveColor: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
    hoverAccent: DEFAULT_COLORS.SUCCESS,
    hoverBg: DEFAULT_COLORS.HOVER_BG,
  };
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  active,
  onClick,
  label,
  icon,
  disabled = false,
  tooltip,
  variant = 'success',
}) => {
  const p = paletteForVariant(variant);
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
      </button>
    </Tooltip>
  );
};

export default ToggleButton;
