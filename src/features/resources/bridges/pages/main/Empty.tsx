import React from 'react';
import { Button } from 'antd';
import { BranchesOutlined, ReloadOutlined } from '@ant-design/icons';
import { BRIDGES_CONSTANTS } from '../../constants';

interface EmptyProps {
  onRefresh: () => void;
}

const Empty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={BRIDGES_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div style={BRIDGES_CONSTANTS.LAYOUT.EMPTY_ICON}>
        <BranchesOutlined />
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: BRIDGES_CONSTANTS.COLORS.TEXT_PRIMARY,
          marginBottom: 8,
        }}
      >
        {BRIDGES_CONSTANTS.MESSAGES.NO_BRIDGES_TITLE}
      </div>

      <div
        style={{
          color: BRIDGES_CONSTANTS.COLORS.TEXT_SECONDARY,
          marginBottom: 20,
          maxWidth: BRIDGES_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH,
          lineHeight: 1.6,
        }}
      >
        {BRIDGES_CONSTANTS.MESSAGES.NO_BRIDGES_DESCRIPTION}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
          {BRIDGES_CONSTANTS.MESSAGES.REFRESH}
        </Button>
      </div>
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
