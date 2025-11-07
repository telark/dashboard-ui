import React from 'react';
import { Button, Space } from 'antd';

import { SettingOutlined, InfoCircleOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  return (
    <div
      style={{
        width: '100%', // Full screen width
        backgroundColor: 'white',
        height: '60px',
        display: 'flex',
        justifyContent: 'flex-end', // Align icons to the right
        alignItems: 'center',
        padding: '10px',
        position: 'fixed',
        left: '0', // Start from the left edge
        top: '0',
        zIndex: 1000,
        transition: 'width 0.3s ease',
      }}
    >
      {/* Action Buttons */}
      <Space size="middle">
        <Button
          icon={<SettingOutlined />}
          shape="circle"
          size="small"
          type="text" // Use "text" type for the ghost-like effect
        />
        <Button icon={<InfoCircleOutlined />} shape="circle" size="small" type="text" />
      </Space>
    </div>
  );
};

export default Header;
