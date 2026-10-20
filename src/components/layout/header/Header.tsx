import React from 'react';
import { Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { NotificationBell } from '../../../features/notifications/components';
import SidebarToggleButton from './SidebarToggleButton';
import { APP_ROUTES, DEFAULT_COLORS, DOCS_URL, HEADER_LAYOUT } from '../../../constants';

const Header: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: DEFAULT_COLORS.PAGE_BG,
        height: HEADER_LAYOUT.HEIGHT,
        display: 'flex',
        justifyContent: 'flex-end', // Align icons to the right
        alignItems: 'center',
        padding: '10px',
        position: 'fixed',
        left: '0', // Start from the left edge
        top: '0',
        zIndex: 1000,
        borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_SUBTLE}`,
      }}
    >
      {/* Logo pinned to the sidebar menu items' left edge, toggle beside it */}
      <div
        style={{
          position: 'absolute',
          left: HEADER_LAYOUT.LOGO.LEFT_PX,
          top: 0,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: HEADER_LAYOUT.LOGO.TOGGLE_GAP,
        }}
      >
        <Link
          to={APP_ROUTES.HOME}
          aria-label={HEADER_LAYOUT.LOGO.ALT}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <img
            src={HEADER_LAYOUT.LOGO.SRC}
            alt={HEADER_LAYOUT.LOGO.ALT}
            width={HEADER_LAYOUT.LOGO.WIDTH}
            height={HEADER_LAYOUT.LOGO.HEIGHT}
          />
        </Link>
        <SidebarToggleButton />
      </div>
      <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Tooltip title={HEADER_LAYOUT.DOCS_LABEL}>
          <Button
            type="text"
            shape="circle"
            icon={<QuestionCircleOutlined style={{ fontSize: 18 }} />}
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={HEADER_LAYOUT.DOCS_LABEL}
          />
        </Tooltip>
        <NotificationBell />
      </div>
    </div>
  );
};

export default Header;
