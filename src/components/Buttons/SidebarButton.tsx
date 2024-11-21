import React, { useState } from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

interface SidebarButtonProps {
  text: string;
  icon: React.ReactNode;
  active?: boolean; // Optional prop for active buttons (e.g., Dashboard)
  hoverIcon?: React.ReactNode; // Hover icon (filled version)
  route: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  text,
  icon,
  active,
  hoverIcon,
  route,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate(); // For navigation

  return (
    <Menu.Item
      icon={isHovered && hoverIcon ? hoverIcon : icon} // Ensure that hoverIcon exists before changing
      onClick={() => navigate(route)} // Handle navigation on click
      style={{
        backgroundColor: active ? "#20C997" : isHovered ? "#20C997" : "transparent",
        color: active ? "white" : isHovered ? "white" : "inherit",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: active ? "16px" : "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)} // Show hover icon on hover
      onMouseLeave={() => setIsHovered(false)} // Revert icon on mouse leave
    >
      {text}
    </Menu.Item>
  );
};

export default SidebarButton;
