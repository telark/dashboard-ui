import React from 'react';
import { AppWorkload } from '../../../../interfaces/workload';
import HistoryTimeLine from '../../shared/timeline';

interface WorkloadHistoryProps {
  workload: AppWorkload;
}

const WorkloadHistory: React.FC<WorkloadHistoryProps> = ({ workload }) => {
  return <HistoryTimeLine Records={workload.config?.history || []} />;
};

export default WorkloadHistory;
