import React from 'react';
import { Empty } from 'antd';
import WorkloadCard from '../../cards/WorkloadCard';
import FancySpinner from '../../common/FancySpinner';
import type { WorkloadCardData } from '../../../interfaces/workload';

interface WorkloadListProps {
  workloads: WorkloadCardData[];
  loading?: boolean;
  onWorkloadClick?: (workload: WorkloadCardData) => void;
}

const WorkloadList: React.FC<WorkloadListProps> = React.memo(
  ({ workloads, loading = false, onWorkloadClick }) => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          width: '100%'
        }}>
          <FancySpinner label="Loading workloads…" showLabel={true} />
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
  },
);

export default WorkloadList;
