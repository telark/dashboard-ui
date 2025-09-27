import { Layout } from 'antd';
import { useState } from 'react';
import UserBlock from './UserBlock';
import MenuItems from './MenuItems';

const { Sider } = Layout;

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <Sider
      width={isCollapsed ? 80 : 260}
      collapsed={isCollapsed}
      style={{
        height: '100vh', // Ensure it takes up the full height of the screen
        backgroundColor: 'white',
        position: 'fixed', // Keep the sidebar fixed on the left
        left: 0, // Align the sidebar to the left of the page
        top: 0, // Align the sidebar from the top
        zIndex: 1, // Ensure it stays above the content
        paddingTop: '20px', // Add padding to the top for spacing
        paddingLeft: isCollapsed ? '0px' : '12px', // Ensure there is space on the left of the content
        paddingRight: 0, // Flush items to the right edge
        overflow: 'hidden', // prevent inner margins from creating gutters
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures bottom alignment
        transition: 'all 0.3s ease',
      }}
    >
      {/* Top Section */}
      {!isCollapsed && (
        <div>
          <UserBlock />
        </div>
      )}

      {/* Menu Items */}
      <div style={{ flexGrow: 1 }}>
        {' '}
        {/* This ensures the menu takes up available space */}
        <MenuItems isCollapsed={isCollapsed} />
      </div>

      {/* Bottom Hide Button */}
      <div style={{ marginTop: 'auto', paddingBottom: '20px' }}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#5B6B7C',
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: isCollapsed ? 0 : 8,
            padding: '8px 0',
            position: 'fixed',
            bottom: '20px',
            left: isCollapsed ? '30px' : '30px',
            width: isCollapsed ? '20px' : 'auto',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            height: 40,
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: 20, transform: isCollapsed ? 'rotate(0deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
            {isCollapsed ? '›' : '‹'}
          </span>
          {!isCollapsed && <span>Hide</span>}
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
