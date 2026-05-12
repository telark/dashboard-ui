import React from 'react';
import { Empty } from 'antd';
import { NOTIFICATIONS_TEXTS } from '../constants';

const EmptyNotifications: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
      }}
    >
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>
              {NOTIFICATIONS_TEXTS.EMPTY_TITLE}
            </div>
            <div style={{ color: '#8c8c8c', fontSize: 12 }}>
              {NOTIFICATIONS_TEXTS.EMPTY_DESCRIPTION}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default EmptyNotifications;
