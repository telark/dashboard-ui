import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import WorkloadHeader from '../../../../components/display/workloads/apps/Header';
import type { AppWorkload } from '../../../../interfaces/workload';

interface HeaderProps {
  workload: AppWorkload;
}

const Header: React.FC<HeaderProps> = React.memo(({ workload }) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: '24px' }}>
      <WorkloadHeader workload={workload} />
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
