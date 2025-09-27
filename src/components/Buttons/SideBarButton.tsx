import React, { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import { ButtonInterface } from '../../interfaces/common';

const SidebarButton: React.FC<ButtonInterface & { isCollapsed?: boolean }> = ({ text, icon, active, hoverIcon, route, isCollapsed = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // For navigation

  const itemKey = `${route || 'route-missing'}-${text || 'text-missing'}`;

  const isActive = Boolean(active);
  const isActiveOrHovered = Boolean(active) || isHovered;
  const iconColor = isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : '#5B6B7C';
  const coloredIcon =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (icon && (React.isValidElement(icon) ? React.cloneElement(icon as any, { style: { color: iconColor } }) : icon)) ||
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
        color: isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : '#0B1F33',
        padding: '12px 10px',
        borderRadius: '10px',
        margin: isCollapsed ? '10px -12px 10px 0' : '10px -24px 10px 9.5px',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        fontWeight: 500,
        fontSize: 15,
        cursor: 'pointer',
        transition: 'all 180ms ease',
        borderRight: isCollapsed ? 'none' : `3px solid ${isActive ? DEFAULT_COLORS.SUCCESS : 'transparent'}`,
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
            width: 3,
            backgroundColor: DEFAULT_COLORS.SUCCESS,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </Menu.Item>
  );
};

export default SidebarButton;
