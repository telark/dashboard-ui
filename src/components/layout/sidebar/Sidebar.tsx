import { useEffect, useRef, memo } from 'react';
import { useLocation } from 'react-router-dom';
import MenuItems from './MenuItems';
import SettingsMenuItems from './SettingsMenuItems';
import SidebarResizeHandle from './SidebarResizeHandle';
import { UserAvatarDropdown } from '../../../features/access-and-permissions/users/components';
import { useMediaQuery, useSidebarCollapse } from '../../../hooks/layout';
import { DEFAULT_COLORS, HEADER_LAYOUT, SIDEBAR_LAYOUT, APP_ROUTES } from '../../../constants';

const Sidebar = memo(() => {
  const location = useLocation();
  const isSettingsRoute = location.pathname.startsWith(APP_ROUTES.SETTINGS);
  const lastNonSettingsPath = useRef('/');

  useEffect(() => {
    if (!isSettingsRoute) {
      lastNonSettingsPath.current = location.pathname;
    }
  }, [location.pathname, isSettingsRoute]);

  const { isCollapsed, width, applyDraggedWidth } = useSidebarCollapse();
  const reduceMotion = useMediaQuery(SIDEBAR_LAYOUT.REDUCED_MOTION_QUERY);

  return (
    <div
      className={SIDEBAR_LAYOUT.CLASS}
      style={{
        position: 'fixed',
        left: 0,
        top: HEADER_LAYOUT.HEIGHT_PX,
        width: isCollapsed ? SIDEBAR_LAYOUT.WIDTH_COLLAPSED : width,
        height: `calc(100vh - ${HEADER_LAYOUT.HEIGHT_PX}px)`,
        backgroundColor: DEFAULT_COLORS.PAGE_BG,
        borderRight: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: reduceMotion ? 'none' : SIDEBAR_LAYOUT.WIDTH_TRANSITION,
      }}
    >
      {!isCollapsed && <SidebarResizeHandle onResize={applyDraggedWidth} />}
      <div style={{ flexGrow: 1, overflowX: 'hidden', position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            paddingTop: SIDEBAR_LAYOUT.CONTENT_TOP_PADDING,
            opacity: isSettingsRoute ? 0 : 1,
            transition: 'opacity 150ms ease',
            pointerEvents: isSettingsRoute ? 'none' : 'auto',
          }}
        >
          <MenuItems isCollapsed={isCollapsed} />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            paddingTop: SIDEBAR_LAYOUT.CONTENT_TOP_PADDING,
            opacity: isSettingsRoute ? 1 : 0,
            transition: 'opacity 150ms ease',
            pointerEvents: isSettingsRoute ? 'auto' : 'none',
          }}
        >
          <SettingsMenuItems isCollapsed={isCollapsed} backPath={lastNonSettingsPath.current} />
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
          padding: '6px 0',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <UserAvatarDropdown variant="sidebar" isCollapsed={isCollapsed} />
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
