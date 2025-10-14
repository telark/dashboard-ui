import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { WORKLOADS_PAGE_CONSTANTS } from '../../../../constants/pages/workloads';

const { Title, Text } = Typography;

interface ErrorProps {
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = React.memo(({ onRetry }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '24px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/workloads')}
        style={{ marginBottom: '24px' }}
      >
        Back to Workloads
      </Button>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Title level={3} style={{ color: WORKLOADS_PAGE_CONSTANTS.COLORS.WARNING }}>
          Failed to load app details
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          Unable to connect to the server. Please try again.
        </Text>

        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            {WORKLOADS_PAGE_CONSTANTS.MESSAGES.REFRESH}
          </Button>
        )}
      </div>
    </div>
  );
});

Error.displayName = 'Error';

export default Error;
