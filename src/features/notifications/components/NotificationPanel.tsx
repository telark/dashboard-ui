import React, { useMemo } from 'react';
import { Button, Spin } from 'antd';
import { SlideOutPanel } from '../../../components/display/panels/slide-out';
import { useNotifications } from '../hooks';
import { NOTIFICATIONS_PANEL_WIDTH, NOTIFICATIONS_TEXTS } from '../constants';
import NotificationItem from './NotificationItem';
import EmptyNotifications from './EmptyNotifications';

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { notifications, unreadCount, isLoading, markRead, markAllRead, clearAll } =
    useNotifications();

  const headerExtra = useMemo(
    () => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          size="small"
          type="text"
          disabled={unreadCount === 0}
          onClick={() => {
            void markAllRead();
          }}
        >
          {NOTIFICATIONS_TEXTS.MARK_ALL_READ}
        </Button>
        <Button
          size="small"
          type="text"
          danger
          disabled={notifications.length === 0}
          onClick={() => {
            void clearAll();
          }}
        >
          {NOTIFICATIONS_TEXTS.CLEAR_ALL}
        </Button>
      </div>
    ),
    [clearAll, markAllRead, notifications.length, unreadCount],
  );

  const content = (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        background: '#ffffff',
      }}
    >
      {isLoading && notifications.length === 0 ? (
        <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        notifications.map((n) => (
          <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
        ))
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
      headerExtra={headerExtra}
      formContent={content}
    />
  );
};

export default NotificationPanel;
