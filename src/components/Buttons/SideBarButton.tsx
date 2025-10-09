import React, { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS, BUTTON_CONFIGS, BUTTON_COLORS } from '../../constants';
import { ButtonInterface } from '../../interfaces/common';

const SidebarButton: React.FC<ButtonInterface & { isCollapsed?: boolean }> = ({
  text,
  icon,
  active,
  hoverIcon,
  route,
  isCollapsed = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // For navigation

  const itemKey = `${route || 'route-missing'}-${text || 'text-missing'}`;

  const isActive = Boolean(active);
  const isActiveOrHovered = Boolean(active) || isHovered;
  const iconColor = isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.ICON_DEFAULT;
  const coloredIcon =
    (icon &&
      (React.isValidElement(icon)
        ? React.cloneElement(icon as any, { style: { color: iconColor } })
        : icon)) ||
    null;

  return (
    <Menu.Item
      key={itemKey}
      eventKey={itemKey}
      title={String(text)}
      icon={isHovered && hoverIcon ? hoverIcon : coloredIcon}
      onClick={() => navigate(route)}
      style={{
        backgroundColor: 'transparent',
        color: isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : BUTTON_COLORS.TEXT_DEFAULT,
        padding: BUTTON_CONFIGS.SIDEBAR_BUTTON.PADDING,
        borderRadius: BUTTON_CONFIGS.SIDEBAR_BUTTON.BORDER_RADIUS,
        margin: isCollapsed
          ? BUTTON_CONFIGS.SIDEBAR_BUTTON.COLLAPSED_MARGIN
          : BUTTON_CONFIGS.SIDEBAR_BUTTON.EXPANDED_MARGIN,
        height: BUTTON_CONFIGS.SIDEBAR_BUTTON.HEIGHT,
        display: 'flex',
        alignItems: 'center',
        fontWeight: BUTTON_CONFIGS.SIDEBAR_BUTTON.FONT_WEIGHT,
        fontSize: BUTTON_CONFIGS.SIDEBAR_BUTTON.FONT_SIZE,
        cursor: 'pointer',
        transition: BUTTON_CONFIGS.SIDEBAR_BUTTON.TRANSITION,
        borderRight: isCollapsed
          ? 'none'
          : `${BUTTON_CONFIGS.SIDEBAR_BUTTON.BORDER_WIDTH}px solid ${isActive ? DEFAULT_COLORS.SUCCESS : 'transparent'}`,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
};

export default SidebarButton;
