import React, { useState } from 'react';
import { Dropdown, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  DEFAULT_COLORS,
  DISABLED_OPACITY,
  FONT_SIZE,
  MOTION,
  RADIUS,
  ROW_ACTION_CLASS,
  ROW_ICON_BUTTON_SIZE,
} from '../../../constants';

interface RowIconButtonProps {
  icon: React.ReactNode;
  label: string;
  tooltip: React.ReactNode;
  disabled: boolean;
  onClick?: (e: React.MouseEvent) => void;
  /** Opens this menu on click instead of calling onClick. */
  menu?: MenuProps;
}

const wrapperStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  flexShrink: 0,
};

const buttonStyle = (disabled: boolean): React.CSSProperties => ({
  all: 'unset',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: disabled ? DEFAULT_COLORS.ICON_MUTED : DEFAULT_COLORS.TEXT_MUTED,
  fontSize: FONT_SIZE.LG,
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  borderRadius: RADIUS.XS,
  transition: `color ${MOTION.BASE_MS}ms, opacity ${MOTION.BASE_MS}ms`,
  opacity: disabled ? DISABLED_OPACITY : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

const RowIconButton: React.FC<RowIconButtonProps> = ({
  icon,
  label,
  tooltip,
  disabled,
  onClick,
  menu,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={ROW_ACTION_CLASS}
      style={buttonStyle(disabled)}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
      aria-label={label}
    >
      {icon}
    </button>
  );

  return (
    // Hovering the open menu counts as hovering its trigger, so the tooltip waits for it to close.
    <Tooltip title={tooltip} placement="left" open={menuOpen ? false : undefined}>
      <span style={wrapperStyle}>
        {menu ? (
          <Dropdown
            trigger={['click']}
            placement="bottomRight"
            disabled={disabled}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            menu={menu}
          >
            {button}
          </Dropdown>
        ) : (
          button
        )}
      </span>
    </Tooltip>
  );
};

export default RowIconButton;
