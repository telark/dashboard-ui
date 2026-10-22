import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import TimeAgo from '../../../components/display/time/TimeAgo';
import {
  CONTROL_FONT_SIZE,
  DEFAULT_COLORS,
  getPillTextColor,
  HAIRLINE,
  ROW_ICON_BUTTON_SIZE,
  STATUS_COLORS,
  STATUS_DOT,
  FONT_SIZE,
  FONT_WEIGHT,
  MOTION,
  SPACING,
} from '../../../constants';
import { NOTIFICATIONS_TEXTS } from '../constants';
import { getTypeConfig } from '../utils';
import type { Notification } from '../models';

export interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const rowActionStyle: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
  onDelete,
  onClose,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const isUnread = !notification.readAt;
  const config = getTypeConfig(notification.type);
  const Icon = config.icon;
  const accentColor =
    STATUS_COLORS.NOTIFICATION_SEVERITY[notification.severity] ??
    STATUS_COLORS.NOTIFICATION_SEVERITY.info;

  const renderedMessage = useMemo(() => {
    const parts = notification.message.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <strong
          key={i}
          style={{ fontWeight: FONT_WEIGHT.SEMIBOLD, color: DEFAULT_COLORS.TEXT_ON_SURFACE }}
        >
          {part}
        </strong>
      ) : (
        part
      ),
    );
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

  const restBackground = isUnread ? DEFAULT_COLORS.SURFACE_SUBTLE : DEFAULT_COLORS.SURFACE_WHITE;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: SPACING.MD,
        padding: `${SPACING.MD}px ${SPACING.XXL}px`,
        borderBottom: HAIRLINE.SURFACE_BORDER_LIGHT,
        cursor: 'pointer',
        background: hovered ? DEFAULT_COLORS.SURFACE_HOVER : restBackground,
        transition: `background ${MOTION.FAST_MS}ms ${MOTION.EASE}`,
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: '0 0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: ROW_ICON_BUTTON_SIZE,
          height: ROW_ICON_BUTTON_SIZE,
          borderRadius: '50%',
          // A glyph on its own tint fades on white (1.7:1); a solid chip follows the pill text rule.
          background: accentColor,
          color: getPillTextColor(accentColor),
        }}
      >
        <Icon style={{ fontSize: FONT_SIZE.BASE }} />
        {isUnread ? (
          <span
            role="img"
            aria-label={NOTIFICATIONS_TEXTS.UNREAD}
            style={{
              ...STATUS_DOT,
              position: 'absolute',
              top: '50%',
              right: '100%',
              marginRight: SPACING.SM,
              background: DEFAULT_COLORS.INFO_STRONG,
              transform: 'translateY(-50%)',
            }}
          />
        ) : null}
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingTop: SPACING.XS }}>
        <div
          title={notification.title}
          style={{
            // Off scale, kept exact: lineHeight 20px (px, LINE_HEIGHT is unitless).
            fontWeight: isUnread ? FONT_WEIGHT.SEMIBOLD : FONT_WEIGHT.MEDIUM,
            fontSize: FONT_SIZE.MD,
            lineHeight: '20px',
            color: DEFAULT_COLORS.TEXT_ON_SURFACE,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {notification.title}
        </div>
        <div
          title={notification.message.replaceAll('**', '')}
          style={{
            // Off scale, kept exact: lineHeight 18px (px, LINE_HEIGHT is unitless).
            marginTop: SPACING.XXS,
            fontSize: FONT_SIZE.SM,
            lineHeight: '18px',
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            overflow: 'hidden',
            overflowWrap: 'anywhere',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2,
          }}
        >
          {renderedMessage}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          alignSelf: 'stretch',
          flexShrink: 0,
        }}
      >
        {/* Keeps the row's own click and Enter (open the target) from firing with an action. */}
        <div
          style={{ display: 'flex', gap: SPACING.XXS, flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {isUnread ? (
            <Tooltip title={NOTIFICATIONS_TEXTS.MARK_READ}>
              <Button
                type="text"
                style={rowActionStyle}
                aria-label={NOTIFICATIONS_TEXTS.MARK_READ}
                icon={<CheckOutlined />}
                onClick={() => onMarkRead(notification.id)}
              />
            </Tooltip>
          ) : null}
          <Tooltip title={NOTIFICATIONS_TEXTS.DELETE}>
            <Button
              type="text"
              style={rowActionStyle}
              aria-label={NOTIFICATIONS_TEXTS.DELETE}
              icon={<DeleteOutlined />}
              onClick={() => onDelete(notification.id)}
            />
          </Tooltip>
        </div>
        {/* Right edge lines up with the delete glyph, not its button box. */}
        <div
          style={{
            // Off scale, kept exact: lineHeight 16px (px, LINE_HEIGHT is unitless).
            paddingRight: (ROW_ICON_BUTTON_SIZE - CONTROL_FONT_SIZE) / 2,
            fontSize: FONT_SIZE.XS,
            lineHeight: '16px',
            color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            whiteSpace: 'nowrap',
          }}
        >
          <TimeAgo date={notification.createdAt} />
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
