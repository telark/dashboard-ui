import React from 'react';
import { Empty, Spin } from 'antd';
import WorkloadCard from '../../cards/WorkloadCard';
import type { WorkloadCardData } from '../../../interfaces/workload';

interface WorkloadListProps {
  workloads: WorkloadCardData[];
  loading?: boolean;
  onWorkloadClick?: (workload: WorkloadCardData) => void;
}

const WorkloadList: React.FC<WorkloadListProps> = ({
  workloads,
  loading = false,
  onWorkloadClick,
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (workloads.length === 0) {
    return <Empty description="No workloads found" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div style={{ width: '100%' }}>
      {workloads.map((workload) => (
        <WorkloadCard
          key={workload.name}
          workload={workload}
          onClick={() => onWorkloadClick?.(workload)}
        />
      ))}
    </div>
  );
};

export default WorkloadList;
