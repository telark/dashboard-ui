import React from 'react';
import { UserAvatarDropdown } from '../../../features/access-and-permissions/users/components';

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
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {/* Action Buttons */}
      <div style={{ marginRight: '20px' }}>
        <UserAvatarDropdown />
      </div>
    </div>
  );
};

export default Header;
