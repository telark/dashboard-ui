import React, { useState } from 'react';
import { Workload } from '../../interfaces/workload';
import SyncMode from '../tabs/SyncMode';

interface WorkloadSyncModeProps {
  workload: Workload;
}

const WorkloadSyncMode: React.FC<WorkloadSyncModeProps> = ({ workload }) => {
  // Use state to manage the switch value
  const [isAutoSync, setIsAutoSync] = useState(workload.config?.sync?.mode === 'auto' || false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleAutoSyncChange = (checked: boolean) => {
    setIsAutoSync(checked);
    setHasChanges(true); // Mark as having changes when switch is toggled
    console.log('Auto sync changed:', checked);
  };
  
  const handleGrouperSyncSave = () => {
    setLoadingSave(true);
    // Simulate save operation
    setTimeout(() => {
      setLoadingSave(false);
      setHasChanges(false);
      console.log('Sync save completed');
    }, 1000);
  };

  return (
    <SyncMode
      isAutoSync={isAutoSync}
      loadingSave={loadingSave}
      hasChanges={hasChanges}
      handleAutoSyncChange={handleAutoSyncChange}
      handleGrouperSyncSave={handleGrouperSyncSave}
    />
  );
};

export default WorkloadSyncMode;
