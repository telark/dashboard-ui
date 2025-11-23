import React from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { WORKLOADS_PAGE_CONSTANTS } from '../../constants';

const { Title, Text } = Typography;

interface EmptyProps {
  onRefresh?: () => void;
}

const Empty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div
        style={{ textAlign: 'center', maxWidth: WORKLOADS_PAGE_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH }}
      >
        <div style={WORKLOADS_PAGE_CONSTANTS.LAYOUT.EMPTY_ICON}>
          <ReloadOutlined />
        </div>

        <Title
          level={3}
          style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_PRIMARY, marginBottom: 8 }}
        >
          {WORKLOADS_PAGE_CONSTANTS.MESSAGES.NO_WORKLOADS_TITLE}
        </Title>

        <Text
          style={{
            color: WORKLOADS_PAGE_CONSTANTS.COLORS.TEXT_SECONDARY,
            marginBottom: 24,
            display: 'block',
          }}
        >
          {WORKLOADS_PAGE_CONSTANTS.MESSAGES.NO_WORKLOADS_DESCRIPTION}
        </Text>

        {onRefresh && (
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
            {WORKLOADS_PAGE_CONSTANTS.MESSAGES.REFRESH}
          </Button>
        )}
      </div>
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
