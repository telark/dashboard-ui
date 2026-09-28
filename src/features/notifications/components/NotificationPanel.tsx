import React from 'react';
import { FancySpinner } from '../../../components/animation';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../components/display/panels/slide-out';
import { ToggleButton } from '../../../components/display/buttons';
import { useNotifications } from '../hooks';
import { NOTIFICATIONS_PANEL_WIDTH, NOTIFICATIONS_TEXTS } from '../constants';
import NotificationItem from './NotificationItem';
import { PanelEmptyState } from '../../../components/display/panels/shared';

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose }) => {
  const { notifications, unreadCount, isLoading, markRead, markAllRead, clearAll } =
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
            gap: 4,
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
