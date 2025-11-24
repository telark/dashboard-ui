import React from 'react';
import WorkloadHeader from '../../../components/display/apps/header/Header';
import type { AppWorkload } from '../../../models';

interface HeaderProps {
  workload: AppWorkload;
}

const Header: React.FC<HeaderProps> = React.memo(({ workload }) => {
  return <WorkloadHeader workload={workload} />;
});

Header.displayName = 'Header';

export default Header;
