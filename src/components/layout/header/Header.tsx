import React from 'react';
import { UserAvatarDropdown } from '../../../features/access-and-permissions/users/components';
import { NotificationBell } from '../../../features/notifications/components';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../constants';

const Header: React.FC = () => {
  return (
    <div
      style={{
        width: '100%', // Full screen width
        backgroundColor: DEFAULT_COLORS.BACKGROUND_WHITE,
        height: HEADER_LAYOUT.HEIGHT,
        display: 'flex',
        justifyContent: 'flex-end', // Align icons to the right
        alignItems: 'center',
        padding: '10px',
        position: 'fixed',
        left: '0', // Start from the left edge
        top: '0',
        zIndex: 1000,
        transition: 'width 0.3s ease',
        borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
      }}
    >
      {/* Logo centered over the sidebar column */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: 'var(--sidebar-width)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 200ms ease',
        }}
      >
        <img
          src={HEADER_LAYOUT.LOGO.SRC}
          alt={HEADER_LAYOUT.LOGO.ALT}
          width={HEADER_LAYOUT.LOGO.WIDTH}
          height={HEADER_LAYOUT.LOGO.HEIGHT}
        />
      </div>
      {/* Action Buttons */}
      <div style={{ marginRight: '20px' }}>
        <NotificationBell />
      </div>
      <div style={{ marginRight: '20px' }}>
        <UserAvatarDropdown />
      </div>
    </div>
  );
};

export default Header;
