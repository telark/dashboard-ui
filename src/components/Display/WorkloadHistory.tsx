import React from 'react';
import { Workload } from '../../interfaces/workload';
import HistoryTimeLine from './HistoryTimeLine';

interface WorkloadHistoryProps {
  workload: Workload;
}

const WorkloadHistory: React.FC<WorkloadHistoryProps> = ({ workload }) => {
  return (
    <HistoryTimeLine Records={workload.config?.history || []} />
  );
};

export default WorkloadHistory;
