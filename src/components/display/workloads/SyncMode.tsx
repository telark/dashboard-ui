import React from 'react';
import { Workload } from '../../../interfaces/workload';
import SyncMode from '../../tabs/SyncMode';
import { WorkloadDetailsHook } from '../../../hooks/WorkloadDetailsHook';

interface WorkloadSyncModeProps {
  workload: Workload;
}

const WorkloadSyncMode: React.FC<WorkloadSyncModeProps> = ({ workload }) => {
  const {
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleWorkloadSyncSave,
  } = WorkloadDetailsHook();

  return (
    <SyncMode
      isAutoSync={isAutoSync}
      loadingSave={loadingSave}
      hasChanges={hasChanges}
      handleAutoSyncChange={handleAutoSyncChange}
      handleSyncSave={handleWorkloadSyncSave}
    />
  );
};

export default WorkloadSyncMode;
