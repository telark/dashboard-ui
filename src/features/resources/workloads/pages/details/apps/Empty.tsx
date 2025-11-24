import React from 'react';
import { Button, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { WORKLOAD_DETAILS_CONSTANTS } from '../../../constants';

const { Title, Text } = Typography;

interface EmptyProps {
  appName?: string;
}

const Empty: React.FC<EmptyProps> = React.memo(({ appName }) => {
  const navigate = useNavigate();

  return (
    <div style={WORKLOAD_DETAILS_CONSTANTS.STATES.EMPTY_CONTAINER}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/workloads')}
        style={{ marginBottom: '24px' }}
      >
        Back to Workloads
      </Button>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Title level={3}>App not found</Title>
        <Text type="secondary">The app &quot;{appName}&quot; could not be found.</Text>
      </div>
    </div>
  );
});

Empty.displayName = 'Empty';

export default Empty;
