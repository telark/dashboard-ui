import React from 'react';
import WorkloadHeader from '../../../../components/display/workloads/apps/Header';
import type { AppWorkload } from '../../../../interfaces/resources/workload';

interface HeaderProps {
  workload: AppWorkload;
}

const Header: React.FC<HeaderProps> = React.memo(({ workload }) => {
  return <WorkloadHeader workload={workload} />;
});

Header.displayName = 'Header';

export default Header;
