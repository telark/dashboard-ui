import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import MenuItems from './MenuItems';

const { Sider } = Layout;

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const widthExpanded = 260;
  const widthCollapsed = 64;
  const headerHeight = 60;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', `${isCollapsed ? widthCollapsed : widthExpanded}px`);
  }, [isCollapsed]);

  return (
    <Sider
      width={isCollapsed ? widthCollapsed : widthExpanded}
      collapsed={isCollapsed}
      style={{
        height: `calc(100vh - ${headerHeight}px)`,
        backgroundColor: 'white',
        position: 'fixed',
        left: 0, // Align the sidebar to the left of the page
        top: `${headerHeight}px`, // Start below the header
        zIndex: 1, // Ensure it stays above the content
        paddingTop: 0,
        paddingLeft: isCollapsed ? '0px' : '12px',
        paddingRight: 0,
        overflow: 'hidden', // prevent inner margins from creating gutters
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Ensures bottom alignment
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Menu Items */}
      <div style={{ flexGrow: 1 }}>
        {' '}
        {/* This ensures the menu takes up available space */}
        <MenuItems isCollapsed={isCollapsed} />
      </div>

      {/* Bottom Hide Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: isCollapsed ? 'absolute' : 'fixed',
          bottom: '20px',
          left: isCollapsed ? '50%' : `${widthExpanded - 16}px`,
          border: 'none',
          background: 'white',
          color: '#5B6B7C',
          fontSize: 18,
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 10,
          transform: isCollapsed ? 'translateX(-50%)' : 'none',
        }}
      >
        {isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
      </button>
    </Sider>
  );
};

export default Sidebar;
