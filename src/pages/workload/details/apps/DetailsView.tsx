import React, { useEffect, useState, memo } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppWorkloadDetailsHook } from '../../../../hooks/AppWorkloadDetailsHook';
import { Error, Empty, Header, Tabs, Content } from '.';
import { GROUPER_DETAILS_CONSTANTS } from '../../../../constants/pages/grouper-details';
import LoadingDetails from '../../../../components/shared/LoadingDetails';
import { RootState } from '../../../../store';
import { STORE_ERRORS } from '../../../../constants/store/store';
import { usePersistedTab } from '../../../../utils/shared/usePersistedTab';
import { TAB_KEYS, type TabKey } from '../../../../components/display/workloads/apps/Tabs';
import WorkloadMetrics from '../../../../components/display/workloads/apps/Metrics';

const AppWorkloadDetailsView: React.FC = memo(function AppWorkloadDetailsView() {
  const { name: workloadNameFromUrl } = useParams<{ name: string }>();
  const { activeTab, handleTabChange } = usePersistedTab<TabKey>({
    resourceType: 'workload',
    resourceName: workloadNameFromUrl,
    tabKeys: TAB_KEYS,
    defaultTab: TAB_KEYS.GENERAL,
  });
  const [syncing] = useState(false);

  const {
    workloadDetails: workload,
    loading,
    error,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleWorkloadSyncSave,
  } = AppWorkloadDetailsHook();

  const workloadName = workload?.fasid?.name;
  const globalSyncing = useSelector((s: RootState) => s.workload.syncing || {});
  const isGloballySyncing = Boolean(workloadName && globalSyncing[workloadName]);

  useEffect(() => {
    if (error) {
      message.error(STORE_ERRORS.FETCH_APP_DETAILS);
    }
  }, [error]);

  if (loading) {
    return <LoadingDetails />;
  }

  if (error) {
    return <Error onRetry={() => window.location.reload()} />;
  }

  if (!workload) {
    return <Empty appName={workloadNameFromUrl} />;
  }

  return (
    <div style={GROUPER_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Header workload={workload} />
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
        <WorkloadMetrics workload={workload} />
        <Content
          workload={workload}
          activeTab={activeTab}
          isAutoSync={isAutoSync}
          loadingSave={loadingSave}
          hasChanges={hasChanges}
          handleAutoSyncChange={handleAutoSyncChange}
          handleWorkloadSyncSave={handleWorkloadSyncSave}
          syncing={syncing}
          isGloballySyncing={isGloballySyncing}
        />
      </div>
    </div>
  );
});

export default AppWorkloadDetailsView;
