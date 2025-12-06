import React, { useState, useMemo, memo, useCallback } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../../constants';
import { ButtonInterface } from '../../../interfaces/shared';

const SidebarButton: React.FC<ButtonInterface & { isCollapsed?: boolean }> = memo(
  ({ text, icon, active, hoverIcon, route, isCollapsed = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const itemKey = useMemo(() => `${route || 'route-missing'}-${text || 'text-missing'}`, [route, text]);

    const isActive = Boolean(active);
    const isActiveOrHovered = isActive || isHovered;
    const iconColor = isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.ICON_DEFAULT;

    const coloredIcon = useMemo(() => {
      if (!icon) return null;

      if (React.isValidElement(icon)) {
        return React.cloneElement(icon, {
          style: { color: iconColor, fontSize: '18px', width: '18.5px', height: '18.5px' },
        } as React.Attributes);
      }
      return icon;
    }, [icon, iconColor]);

    const borderRight = useMemo(() => {
      if (isCollapsed) return 'none';
      const borderColor = isActive ? DEFAULT_COLORS.SUCCESS : 'transparent';
      return `${BUTTON_CONFIGS.SIDEBAR_BUTTON.BORDER_WIDTH}px solid ${borderColor}`;
    }, [isCollapsed, isActive]);

    const buttonStyle = useMemo(
      () => ({
        backgroundColor: 'transparent',
        color: isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.TEXT_DEFAULT,
        padding: BUTTON_CONFIGS.SIDEBAR_BUTTON.PADDING,
        borderRadius: BUTTON_CONFIGS.SIDEBAR_BUTTON.BORDER_RADIUS,
        margin: isCollapsed ? '10px auto' : BUTTON_CONFIGS.SIDEBAR_BUTTON.EXPANDED_MARGIN,
        height: BUTTON_CONFIGS.SIDEBAR_BUTTON.HEIGHT,
        display: 'flex',
        alignItems: 'center',
        fontWeight: BUTTON_CONFIGS.SIDEBAR_BUTTON.FONT_WEIGHT,
        fontSize: BUTTON_CONFIGS.SIDEBAR_BUTTON.FONT_SIZE,
        cursor: 'pointer',
        transition: BUTTON_CONFIGS.SIDEBAR_BUTTON.TRANSITION,
        borderRight,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        position: 'relative' as const,
      }),
      [isActiveOrHovered, isCollapsed, borderRight],
    );

    const handleClick = useCallback(() => {
      navigate(route);
    }, [navigate, route]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
      <Menu.Item
        key={itemKey}
        eventKey={itemKey}
        title={String(text)}
        icon={isHovered && hoverIcon ? hoverIcon : coloredIcon}
        onClick={handleClick}
        style={buttonStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
        {isCollapsed && isActive ? (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: BUTTON_CONFIGS.SIDEBAR_BUTTON.BORDER_WIDTH,
              backgroundColor: DEFAULT_COLORS.SUCCESS,
              pointerEvents: 'none',
            }}
          />
        ) : null}
      </Menu.Item>
    );
  },
);

SidebarButton.displayName = 'SidebarButton';

export default SidebarButton;
