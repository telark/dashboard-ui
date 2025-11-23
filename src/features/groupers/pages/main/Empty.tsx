import React from 'react';
import { Button } from 'antd';
import { AppstoreOutlined, ReloadOutlined } from '@ant-design/icons';
import { GROUPERS_CONSTANTS } from '../../constants';

interface EmptyProps {
  onRefresh: () => void;
}

const GrouperMainEmpty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={GROUPERS_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div style={GROUPERS_CONSTANTS.LAYOUT.EMPTY_ICON}>
        <AppstoreOutlined />
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: GROUPERS_CONSTANTS.COLORS.TEXT_PRIMARY,
          marginBottom: 8,
        }}
      >
        {GROUPERS_CONSTANTS.MESSAGES.NO_GROUPERS_TITLE}
      </div>

      <div
        style={{
          color: GROUPERS_CONSTANTS.COLORS.TEXT_SECONDARY,
          marginBottom: 20,
          maxWidth: GROUPERS_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
          lineHeight: 1.6,
        }}
      >
        {GROUPERS_CONSTANTS.MESSAGES.NO_GROUPERS_DESCRIPTION}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
          {GROUPERS_CONSTANTS.MESSAGES.REFRESH}
        </Button>
      </div>
    </div>
  );
});

GrouperMainEmpty.displayName = 'GrouperMainEmpty';

export default GrouperMainEmpty;
