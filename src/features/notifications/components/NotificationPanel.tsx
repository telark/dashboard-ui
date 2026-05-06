import React from 'react';
import { FancySpinner } from '../../../components/animation';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../components/display/panels/slide-out';
import { ToggleButton } from '../../../components/display/buttons';
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

  const hasNotifications = notifications.length > 0;

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
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
          <ToggleButton
            active={false}
            onClick={() => void markAllRead()}
            label={NOTIFICATIONS_TEXTS.MARK_ALL_READ}
            icon={<CheckOutlined />}
            disabled={unreadCount === 0}
            variant="neutral"
          />
          <ToggleButton
            active={false}
            onClick={() => void clearAll()}
            label={NOTIFICATIONS_TEXTS.CLEAR_ALL}
            icon={<DeleteOutlined />}
            variant="danger"
          />
        </div>
      )}
      <div
        style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '4px 0',
          margin: '0 -24px',
        }}
      >
        {isLoading && !hasNotifications ? (
          <div style={{ padding: 32, display: 'flex', justifyContent: 'center' }}>
            <FancySpinner />
          </div>
        ) : !hasNotifications ? (
          <EmptyNotifications />
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markRead} onClose={onClose} />
          ))
        )}
      </div>
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
