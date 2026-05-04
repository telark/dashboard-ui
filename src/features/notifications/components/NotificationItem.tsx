import React, { useCallback } from 'react';
import TimeAgo from 'react-timeago';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATION_SEVERITY_COLORS } from '../constants';
import { getTypeConfig } from '../utils';
import type { Notification } from '../models';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkRead }) => {
  const navigate = useNavigate();
  const isUnread = !notification.readAt;
  const config = getTypeConfig(notification.type);
  const Icon = config.icon;
  const accentColor = NOTIFICATION_SEVERITY_COLORS[notification.severity] ?? '#1890ff';

  const handleClick = useCallback(() => {
    const target = config.navigateTo(notification.metadata);
    if (isUnread) {
      onMarkRead(notification.id);
    }
    if (target) {
      navigate(target);
    }
  }, [config, navigate, notification.id, notification.metadata, isUnread, onMarkRead]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 16px',
        borderLeft: `3px solid ${accentColor}`,
        borderBottom: '1px solid #f0f0f0',
        cursor: 'pointer',
        background: isUnread ? '#fafcff' : '#ffffff',
        transition: 'background 0.15s ease',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          marginTop: 2,
          color: accentColor,
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        <Icon style={{ fontSize: 18 }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: isUnread ? 600 : 400,
            fontSize: 13,
            color: '#262626',
            marginBottom: 2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {notification.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: '#595959',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 4,
          }}
        >
          {notification.message}
        </div>
        <div style={{ fontSize: 11, color: '#8c8c8c' }}>
          <TimeAgo date={notification.createdAt} />
        </div>
      </div>

      {isUnread ? (
        <div
          aria-label="unread"
          style={{
            flex: '0 0 auto',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: accentColor,
            marginTop: 8,
          }}
        />
      ) : null}
    </div>
  );
};

export default NotificationItem;
