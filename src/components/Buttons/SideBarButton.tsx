import React, { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import { ButtonInterface } from '../../interfaces/common';

const SidebarButton: React.FC<ButtonInterface> = ({ text, icon, active, hoverIcon, route }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // For navigation

  const itemKey = `${route || 'route-missing'}-${text || 'text-missing'}`;

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
      icon={isHovered && hoverIcon ? hoverIcon : coloredIcon}
      onClick={() => navigate(route)}
      style={{
        backgroundColor: 'transparent',
        color: isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : '#0B1F33',
        padding: '12px 10px',
        borderRadius: '10px',
        margin: '6px -12px 6px 6px',
        height: 46,
        display: 'flex',
        alignItems: 'center',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer',
        transition: 'all 180ms ease',
        borderRight: `3px solid ${isActiveOrHovered ? DEFAULT_COLORS.SUCCESS : 'transparent'}`,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {text}
    </Menu.Item>
  );
};

export default SidebarButton;
