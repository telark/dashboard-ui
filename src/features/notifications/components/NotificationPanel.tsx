import React from 'react';
import { FancySpinner } from '../../../components/animation';
import { Button, Empty, Tooltip, Typography } from 'antd';
import { BellOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { SlideOutPanel } from '../../../components/display/panels/slide-out';
import { DEFAULT_COLORS, EMPTY_CLASS, ROW_ICON_BUTTON_SIZE, SPACING } from '../../../constants';
import type { UseNotificationsResult } from '../hooks';
import { NOTIFICATIONS_PANEL_WIDTH, NOTIFICATIONS_TEXTS } from '../constants';
import NotificationItem from './NotificationItem';

export interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  // The bell's subscription: a second useNotifications() would start a second poller.
  feed: UseNotificationsResult;
}

const toolbarIconStyle: React.CSSProperties = {
  width: ROW_ICON_BUTTON_SIZE,
  height: ROW_ICON_BUTTON_SIZE,
};

const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose, feed }) => {
  const { notifications, unreadCount, isLoading, markRead, deleteOne, markAllRead, clearAll } =
    feed;

  const hasNotifications = notifications.length > 0;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: SPACING.MD,
        width: '100%',
        height: '100%',
      }}
    >
      {hasNotifications && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.XS,
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
        <Empty
          className={EMPTY_CLASS.PANEL}
          image={<BellOutlined />}
          description={
            <>
              <Typography.Title level={5}>{NOTIFICATIONS_TEXTS.EMPTY_TITLE}</Typography.Title>
              <Typography.Text>{NOTIFICATIONS_TEXTS.EMPTY_DESCRIPTION}</Typography.Text>
            </>
          }
        />
      ) : (
        <div
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: `${SPACING.XS}px 0`,
            margin: `0 -${SPACING.XXL}px`,
          }}
        >
          {isLoading && !hasNotifications ? (
            <div style={{ padding: SPACING.XXXL, display: 'flex', justifyContent: 'center' }}>
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
