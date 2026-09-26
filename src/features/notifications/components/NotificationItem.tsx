import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeAgo from '../../../components/display/time/TimeAgo';
import { DEFAULT_COLORS } from '../../../constants';
import { NOTIFICATION_SEVERITY_COLORS } from '../constants';
import { getTypeConfig } from '../utils';
import type { Notification } from '../models';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onClose,
}) => {
  const navigate = useNavigate();
  const isUnread = !notification.readAt;
  const config = getTypeConfig(notification.type);
  const Icon = config.icon;
  const accentColor =
    NOTIFICATION_SEVERITY_COLORS[notification.severity] ?? NOTIFICATION_SEVERITY_COLORS.info;

  const renderedMessage = useMemo(() => {
    const parts = notification.message.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
  }, [notification.message]);

  const handleClick = useCallback(() => {
    const target = config.navigateTo(notification.metadata);
    if (isUnread) {
      onMarkRead(notification.id);
    }
    onClose();
    if (target) {
      navigate(target);
    }
  }, [config, navigate, notification.id, notification.metadata, isUnread, onMarkRead, onClose]);

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
        padding: '8px 24px',
        borderBottom: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
        cursor: 'pointer',
        background: isUnread ? DEFAULT_COLORS.SURFACE_SUBTLE : DEFAULT_COLORS.SURFACE_WHITE,
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
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
            marginBottom: 2,
          }}
        >
          <div
            style={{
              fontWeight: isUnread ? 600 : 400,
              fontSize: 13,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minWidth: 0,
            }}
          >
            {notification.title}
          </div>
          <div
            style={{ fontSize: 11, color: DEFAULT_COLORS.TEXT_ON_SURFACE_DISABLED, flexShrink: 0 }}
          >
            <TimeAgo date={notification.createdAt} />
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {renderedMessage}
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
