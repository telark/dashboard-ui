import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { TbLayoutSidebar } from 'react-icons/tb';
import { useSidebarCollapse } from '../../../hooks/layout';
import { DEFAULT_COLORS, SIDEBAR_LAYOUT } from '../../../constants';

const isMacPlatform = (): boolean => navigator.userAgent.toLowerCase().includes('mac');

// Only rendered while the sidebar is shut; an open sidebar is closed by dragging
// its edge, so the header stays clear.
const SidebarToggleButton: React.FC = memo(() => {
  const { isCollapsed, toggle } = useSidebarCollapse({ withShortcut: true });
  const [hovered, setHovered] = useState(false);
  const config = SIDEBAR_LAYOUT.TOGGLE;

  if (!isCollapsed) {
    return null;
  }

  const shortcut = isMacPlatform() ? config.SHORTCUT_LABEL_MAC : config.SHORTCUT_LABEL_DEFAULT;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: config.SEPARATOR_GAP,
      }}
    >
      <span aria-hidden style={{ color: DEFAULT_COLORS.BORDER_DEFAULT }}>
        {config.SEPARATOR}
      </span>
      <Tooltip title={`${config.EXPAND_LABEL} (${shortcut})`}>
        <button
          type="button"
          onClick={toggle}
          aria-label={config.EXPAND_LABEL}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: config.BUTTON_SIZE,
            height: config.BUTTON_SIZE,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: hovered ? DEFAULT_COLORS.TEXT_PRIMARY : DEFAULT_COLORS.TEXT_MUTED,
            cursor: 'pointer',
            transition: config.TRANSITION,
          }}
        >
          <TbLayoutSidebar size={config.ICON_SIZE} />
        </button>
      </Tooltip>
    </div>
  );
});

SidebarToggleButton.displayName = 'SidebarToggleButton';

export default SidebarToggleButton;
