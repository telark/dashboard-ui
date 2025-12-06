import { Layout } from 'antd';
import { useEffect, useState, memo } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import MenuItems from './MenuItems';

const { Sider } = Layout;

const Sidebar = memo(() => {
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
        left: 0,
        top: `${headerHeight}px`,
        zIndex: 1,
        paddingTop: 0,
        paddingLeft: isCollapsed ? '0px' : '12px',
        paddingRight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <MenuItems isCollapsed={isCollapsed} />
      </div>

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
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
