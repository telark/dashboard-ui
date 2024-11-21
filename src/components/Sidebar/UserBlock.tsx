// src/components/Sidebar/UserBlock.tsx
import React from "react";
import { Avatar, Typography } from "antd";

const { Text } = Typography;

const UserBlock = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
      <Avatar
        size={48}
        style={{ backgroundColor: "#20C997", marginRight: "12px" }}
      >
        HK
      </Avatar>
      <div>
        <Text strong style={{ fontSize: "16px" }}>
          houssem kraoua
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Role
        </Text>
      </div>
    </div>
  );
};

export default UserBlock;
