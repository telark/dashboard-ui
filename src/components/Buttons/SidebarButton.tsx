// src/components/Sidebar/SidebarButton.tsx
import React from "react";
import { Menu } from "antd";

interface SidebarButtonProps {
  text: string;
  icon: React.ReactNode;
  active?: boolean; // Optional prop for active buttons (e.g., Dashboard)
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ text, icon, active }) => {
  return (
    <Menu.Item
      icon={icon}
      style={{
        backgroundColor: active ? "#20C997" : "transparent",
        color: active ? "white" : "inherit",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: active ? "16px" : "0px",
      }}
    >
      {text}
    </Menu.Item>
  );
};

export default SidebarButton;
