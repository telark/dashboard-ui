import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { WORKLOAD_DETAILS_CONSTANTS } from '../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../../constants/pages/connectivity';

const { Title, Text } = Typography;

interface WorkloadDetailsErrorProps {
  onRetry?: () => void;
}

const WorkloadDetailsError: React.FC<WorkloadDetailsErrorProps> = React.memo(({ onRetry }) => {
  const navigate = useNavigate();

  return (
    <div style={WORKLOAD_DETAILS_CONSTANTS.STATES.ERROR_CONTAINER}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/workloads')}
        style={{ marginBottom: '24px' }}
      >
        Back to Workloads
      </Button>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Title level={3} style={{ color: CONNECTIVITY_CONSTANTS.COLORS.WARNING }}>
          Failed to load app details
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
          Unable to connect to the server. Please try again.
        </Text>

        {onRetry && (
          <Button type="primary" onClick={onRetry}>
            {CONNECTIVITY_CONSTANTS.MESSAGES.REFRESH}
          </Button>
        )}
      </div>
    </div>
  );
});

WorkloadDetailsError.displayName = 'WorkloadDetailsError';

export default WorkloadDetailsError;
