import React, { useState } from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_COLORS } from '../../constants';
import { ButtonInterface } from '../../interfaces/common';

const SidebarButton: React.FC<ButtonInterface> = ({ text, icon, active, hoverIcon, route }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // For navigation

  const itemKey = `${route || 'route-missing'}-${text || 'text-missing'}`;

  return (
    <Menu.Item
      key={itemKey}
      eventKey={itemKey}
      icon={isHovered && hoverIcon ? hoverIcon : icon} // Ensure that hoverIcon exists before changing
      onClick={() => navigate(route)} // Handle navigation on click
      style={{
        backgroundColor: active
          ? DEFAULT_COLORS.SUCCESS
          : isHovered
            ? DEFAULT_COLORS.SUCCESS
            : 'transparent',
        color: active ? 'white' : isHovered ? 'white' : 'inherit',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: active ? '16px' : '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)} // Show hover icon on hover
      onMouseLeave={() => setIsHovered(false)} // Revert icon on mouse leave
    >
      {text}
    </Menu.Item>
  );
};

export default SidebarButton;
