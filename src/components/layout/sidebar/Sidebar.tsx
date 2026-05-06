import { useEffect, useState, memo, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import MenuItems from './MenuItems';
import { DEFAULT_COLORS, HEADER_LAYOUT } from '../../../constants';

const SIDEBAR_WIDTH_EXPANDED = 220;
const SIDEBAR_WIDTH_COLLAPSED = 52;
const STORAGE_KEY = 'sidebar_collapsed';

const Sidebar = memo(() => {
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true',
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      `${isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED}px`,
    );
  }, [isCollapsed]);

  const handleToggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: HEADER_LAYOUT.HEIGHT_PX,
        width: isCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
        height: `calc(100vh - ${HEADER_LAYOUT.HEIGHT_PX}px)`,
        backgroundColor: DEFAULT_COLORS.BACKGROUND_WHITE,
        borderRight: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'width 200ms ease',
      }}
    >
      <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <MenuItems isCollapsed={isCollapsed} />
      </div>

      <div
        style={{
          borderTop: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
          padding: '8px 0',
          flexShrink: 0,
          display: 'flex',
          justifyContent: isCollapsed ? 'center' : 'flex-end',
          paddingRight: isCollapsed ? 0 : 8,
        }}
      >
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            background: 'transparent',
            border: 'none',
            color: DEFAULT_COLORS.TEXT_MUTED,
            cursor: 'pointer',
            width: 28,
            height: 28,
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'background 150ms ease',
          }}
        >
          {isCollapsed ? <HiChevronRight /> : <HiChevronLeft />}
        </button>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
