import React from 'react';
import { AppWorkload } from '../../../../interfaces/workload';
import InstancesTable from './instances/Table';

interface WorkloadInstancesProps {
  workload: AppWorkload;
}

const WorkloadInstances: React.FC<WorkloadInstancesProps> = ({ workload }) => {
  return <InstancesTable workload={workload} />;
};

export default WorkloadInstances;
