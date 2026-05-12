import React, { useCallback, useState } from 'react';
import { Badge, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotifications } from '../hooks';
import NotificationPanel from './NotificationPanel';

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <>
      <Badge count={unreadCount} overflowCount={9} size="small" offset={[-2, 2]} showZero={false}>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined style={{ fontSize: 18 }} />}
          onClick={handleOpen}
          aria-label={`${unreadCount} unread notifications`}
        />
      </Badge>
      <NotificationPanel open={open} onClose={handleClose} />
    </>
  );
};

export default NotificationBell;
