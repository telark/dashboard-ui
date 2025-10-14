import React from 'react';
import { Button } from 'antd';
import { AppstoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { GROUPERS_PAGE_CONSTANTS } from '../../../constants/pages/groupers';

interface EmptyProps {
  onRefresh: () => void;
}

const Empty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={GROUPERS_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div style={GROUPERS_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON}>
        <AppstoreOutlined />
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: GROUPERS_PAGE_CONSTANTS.COLORS.TEXT_PRIMARY,
          marginBottom: 8,
        }}
      >
        {GROUPERS_PAGE_CONSTANTS.MESSAGES.NO_GROUPERS_TITLE}
      </div>

      <div
        style={{
          color: GROUPERS_PAGE_CONSTANTS.COLORS.TEXT_SECONDARY,
          marginBottom: 20,
          maxWidth: GROUPERS_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
          lineHeight: 1.6,
        }}
      >
        {GROUPERS_PAGE_CONSTANTS.MESSAGES.NO_GROUPERS_DESCRIPTION}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
          {GROUPERS_PAGE_CONSTANTS.MESSAGES.REFRESH}
        </Button>
      </div>
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
