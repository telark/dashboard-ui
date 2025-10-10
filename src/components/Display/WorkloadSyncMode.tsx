import React from 'react';
import { Descriptions } from 'antd';
import { Workload } from '../../interfaces/workload';

interface WorkloadSyncModeProps {
  workload: Workload;
}

const WorkloadSyncMode: React.FC<WorkloadSyncModeProps> = ({ workload }) => {
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Descriptions column={2}>
      <Descriptions.Item label="Sync Mode">{workload.config?.sync?.mode || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Last Update Time">
        {workload.config?.sync?.lastUpdateTime ? formatTime(workload.config.sync.lastUpdateTime) : 'N/A'}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default WorkloadSyncMode;
