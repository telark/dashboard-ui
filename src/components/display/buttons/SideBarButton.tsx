import React, { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../../constants';
import { ButtonInterface } from '../../../interfaces/shared';

const SidebarButton: React.FC<ButtonInterface & { isCollapsed?: boolean }> = memo(
  ({ text, icon, active, route, isCollapsed = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const SB = BUTTON_CONFIGS.SIDEBAR_BUTTON;

    const isActive = Boolean(active);
    const isActiveOrHovered = isActive || isHovered;
    const accentColor = DEFAULT_COLORS.SUCCESS;
    const iconColor = isActiveOrHovered ? accentColor : BUTTON_COLORS.ICON_DEFAULT;
    const textColor = isActiveOrHovered ? accentColor : BUTTON_COLORS.TEXT_DEFAULT;

    const coloredIcon = React.isValidElement(icon)
      ? React.cloneElement(icon, {
          style: { color: iconColor, fontSize: 16, width: 16, height: 16, flexShrink: 0, transition: 'color 150ms ease' },
        } as React.Attributes)
      : icon;

    const handleClick = useCallback(() => navigate(route), [navigate, route]);
    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-current={isActive ? 'page' : undefined}
        aria-label={isCollapsed ? String(text) : undefined}
        title={isCollapsed ? String(text) : undefined}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          textAlign: 'left',
          gap: 10,
          width: '100%',
          height: SB.HEIGHT,
          padding: isCollapsed ? 0 : SB.PADDING,
          margin: 0,
          border: 'none',
          borderRight: `${SB.BORDER_WIDTH}px solid ${isActive ? accentColor : 'transparent'}`,
          borderRadius: SB.BORDER_RADIUS,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: isHovered ? DEFAULT_COLORS.BACKGROUND_HOVER : 'transparent',
          color: textColor,
          fontWeight: SB.FONT_WEIGHT,
          fontSize: SB.FONT_SIZE,
          cursor: 'pointer',
          transition: SB.TRANSITION,
          boxSizing: 'border-box',
        }}
      >
        {coloredIcon}
        {!isCollapsed && (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
              fontWeight: SB.FONT_WEIGHT,
              fontSize: SB.FONT_SIZE,
              color: textColor,
              transition: 'color 150ms ease',
            }}
          >
            {text}
          </span>
        )}
      </button>
    );
  },
);

SidebarButton.displayName = 'SidebarButton';

export default SidebarButton;
