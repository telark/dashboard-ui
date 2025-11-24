import React from 'react';
import { Button, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { WORKLOADS_CONSTANTS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';

const { Title, Text } = Typography;

interface EmptyProps {
  onRefresh?: () => void;
}

const Empty: React.FC<EmptyProps> = React.memo(({ onRefresh }) => {
  return (
    <div style={WORKLOADS_CONSTANTS.LAYOUT.EMPTY_STATE_CONTAINER}>
      <div style={{ textAlign: 'center', maxWidth: WORKLOADS_CONSTANTS.UI.EMPTY_STATE_MAX_WIDTH }}>
        <div style={WORKLOADS_CONSTANTS.LAYOUT.EMPTY_ICON}>
          <ReloadOutlined />
        </div>

        <Title
          level={3}
          style={{ color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_PRIMARY, marginBottom: 8 }}
        >
          {WORKLOADS_CONSTANTS.MESSAGES.NO_WORKLOADS_TITLE}
        </Title>

        <Text
          style={{
            color: CONNECTIVITY_CONSTANTS.COLORS.TEXT_SECONDARY,
            marginBottom: 24,
            display: 'block',
          }}
        >
          {WORKLOADS_CONSTANTS.MESSAGES.NO_WORKLOADS_DESCRIPTION}
        </Text>

        {onRefresh && (
          <Button type="primary" icon={<ReloadOutlined />} onClick={onRefresh}>
            {CONNECTIVITY_CONSTANTS.MESSAGES.REFRESH}
          </Button>
        )}
      </div>
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
