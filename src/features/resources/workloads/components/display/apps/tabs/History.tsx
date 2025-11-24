import React from 'react';
import type { AppWorkload } from '../../../../models';
import HistoryTimeLine from '../../../../../../../components/display/shared/timeline';

interface WorkloadHistoryProps {
  workload: AppWorkload;
}

const WorkloadHistory: React.FC<WorkloadHistoryProps> = ({ workload }) => {
  return <HistoryTimeLine Records={workload.config?.history || []} />;
};

export default WorkloadHistory;
