import React from 'react';
import { FancySpinner } from '../../../components/animation';
import { Button, Tooltip } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../components/display/panels/slide-out';
import { DEFAULT_COLORS, ROW_ICON_BUTTON_SIZE } from '../../../constants';
import { useNotifications } from '../hooks';
import { NOTIFICATIONS_PANEL_WIDTH, NOTIFICATIONS_TEXTS } from '../constants';
import NotificationItem from './NotificationItem';
import { PanelEmptyState } from '../../../components/display/panels/shared';

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const toolbarIconStyle: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { notifications, unreadCount, isLoading, markRead, deleteOne, markAllRead, clearAll } =
    useNotifications();

  const hasNotifications = notifications.length > 0;

  const content = (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', height: '100%' }}
    >
      {hasNotifications && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
            justifyContent: 'flex-end',
          }}
        >
          <Tooltip title={NOTIFICATIONS_TEXTS.MARK_ALL_READ}>
            <Button
              type="text"
              style={{ ...toolbarIconStyle, color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED }}
              aria-label={NOTIFICATIONS_TEXTS.MARK_ALL_READ}
              icon={<CheckOutlined />}
              disabled={unreadCount === 0}
              onClick={() => void markAllRead()}
            />
          </Tooltip>
          <Tooltip title={NOTIFICATIONS_TEXTS.CLEAR_ALL}>
            <Button
              type="text"
              danger
              style={toolbarIconStyle}
              aria-label={NOTIFICATIONS_TEXTS.CLEAR_ALL}
              icon={<DeleteOutlined />}
              onClick={() => void clearAll()}
            />
          </Tooltip>
        </div>
      )}
      {!isLoading && !hasNotifications ? (
        <PanelEmptyState
          icon={<BellOutlined />}
          title={NOTIFICATIONS_TEXTS.EMPTY_TITLE}
          description={NOTIFICATIONS_TEXTS.EMPTY_DESCRIPTION}
        />
      ) : (
        <div
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '4px 0',
            margin: '0 -24px',
          }}
        >
          {isLoading && !hasNotifications ? (
            <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
              <FancySpinner />
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={markRead}
                onDelete={deleteOne}
                onClose={onClose}
              />
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={NOTIFICATIONS_TEXTS.TITLE}
      width={NOTIFICATIONS_PANEL_WIDTH}
      contentOnly
      formContent={content}
    />
  );
};

export default NotificationPanel;
