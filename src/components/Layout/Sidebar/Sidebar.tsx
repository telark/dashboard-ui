import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import UserBlock from './UserBlock';
import MenuItems from './MenuItems';

const { Sider } = Layout;

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const widthExpanded = 260;
  const widthCollapsed = 80;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', `${isCollapsed ? widthCollapsed : widthExpanded}px`);
  }, [isCollapsed]);

  return (
    <Sider
      width={isCollapsed ? widthCollapsed : widthExpanded}
      collapsed={isCollapsed}
      style={{
        height: '100vh',
        backgroundColor: 'white',
        position: 'fixed',
        left: 0, // Align the sidebar to the left of the page
        top: 0, // Align the sidebar from the top
        zIndex: 1, // Ensure it stays above the content
        paddingTop: '20px',
        paddingLeft: '12px',
        paddingRight: 0,
        overflow: 'hidden', // prevent inner margins from creating gutters
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures bottom alignment
        transition: 'width 0.3s ease',
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
            left: '30px',
            height: 40,
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: 20 }}>{isCollapsed ? '›' : '‹'}</span>
          {!isCollapsed && <span>Hide</span>}
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
