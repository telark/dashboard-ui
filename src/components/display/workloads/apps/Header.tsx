import React, { useState } from 'react';
import { SyncOutlined, ClusterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import TimeAgo from '../../../time/TimeAgo';
import Header from '../../shared/sections/Header';
import { AppWorkload } from '../../../../interfaces/resources/workload';
import { syncAppWorkloadDetails } from '../../../../utils/workload/sync';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { APP_ROUTES, ICONS, UI } from '../../../../constants';
import WorkloadMetrics from './Metrics';

const WorkloadIcon = ICONS.WORKLOAD;

interface WorkloadHeaderProps {
  workload: AppWorkload;
}

const WorkloadHeader: React.FC<WorkloadHeaderProps> = React.memo(({ workload }) => {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [syncing, setSyncing] = useState(false);
  const globalSyncing = useSelector((s: RootState) => s.workload.syncing || {});
  const workloadName = workload?.fasid?.name;
  const isGloballySyncing = Boolean(workloadName && globalSyncing[workloadName]);
  const grouperName = workload?.fasid?.grouper;

  const handleSync = async () => {
    await syncAppWorkloadDetails({
      details: workload,
      setSyncing,
      message,
    });
  };

  const handleViewGrouper = () => {
    if (grouperName) {
      navigate(`${APP_ROUTES.GROUPERS}/${grouperName}/details`);
    }
  };

  const breadcrumbs = [
    { label: 'Workloads', to: APP_ROUTES.WORKLOADS },
    { label: workload.fasid.sourceName },
  ];

  return (
    <Header
      breadcrumbs={breadcrumbs}
      subtitle={
        <>
          {UI.HEADER.LAST_UPDATE_PREFIX}{' '}
          <TimeAgo date={workload.config?.sync?.lastUpdateTime || new Date().toISOString()} />
        </>
      }
      primaryText={UI.BUTTONS.SYNC}
      primaryIcon={<SyncOutlined size={16} />}
      primaryLoading={syncing || isGloballySyncing}
      primaryDisabled={syncing || isGloballySyncing}
      onPrimary={handleSync}
      secondaryText="View Grouper"
      secondaryIcon={<ClusterOutlined size={16} />}
      onSecondary={grouperName ? handleViewGrouper : undefined}
      icon={<WorkloadIcon />}
      extraContent={<WorkloadMetrics workload={workload} />}
    />
  );
});

WorkloadHeader.displayName = 'WorkloadHeader';

export default WorkloadHeader;
