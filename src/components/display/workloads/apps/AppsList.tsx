import React from 'react';
import { Empty } from 'antd';
import WorkloadCard from '../../../cards/WorkloadCard';
import { FancySpinner } from '../../../shared';
import type { AppWorkloadCardData } from '../../../../interfaces/workload';

interface AppsListProps {
  apps: AppWorkloadCardData[];
  loading?: boolean;
  onAppClick?: (app: AppWorkloadCardData) => void;
}

const AppsList: React.FC<AppsListProps> = React.memo(({ apps, loading = false, onAppClick }) => {
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          width: '100%',
        }}
      >
        <FancySpinner label="Loading apps" showLabel={true} />
      </div>
    );
  }

  if (apps.length === 0) {
    return <Empty description="No apps found" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <div style={{ width: '100%' }}>
      {apps.map((app) => (
        <WorkloadCard key={app.name} workload={app} onClick={() => onAppClick?.(app)} />
      ))}
    </div>
  );
});

export default AppsList;
