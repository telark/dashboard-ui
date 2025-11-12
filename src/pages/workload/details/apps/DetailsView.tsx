import React, { useEffect, useState, memo } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppWorkloadDetailsHook } from '../../../../hooks/AppWorkloadDetailsHook';
import { WorkloadDetailsError, Empty, Header, Tabs, Content } from '.';
import { WORKLOAD_DETAILS_CONSTANTS, TabKey } from '../../../../constants/pages/workload-details';
import LoadingDetails from '../../../../components/shared/LoadingDetails';
import { RootState } from '../../../../store';
import { STORE_ERRORS } from '../../../../constants/store/store';
import { usePersistedTab } from '../../../../utils/shared/usePersistedTab';

const AppWorkloadDetailsView: React.FC = memo(function AppWorkloadDetailsView() {
  const { name: workloadNameFromUrl } = useParams<{ name: string }>();
  const { activeTab, handleTabChange } = usePersistedTab<TabKey>({
    resourceType: 'workload',
    resourceName: workloadNameFromUrl,
    tabKeys: WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS,
    defaultTab: WORKLOAD_DETAILS_CONSTANTS.TAB_KEYS.GENERAL,
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
    return <WorkloadDetailsError onRetry={() => globalThis.location.reload()} />;
  }

  if (!workload) {
    return <Empty appName={workloadNameFromUrl} />;
  }

  return (
    <div style={WORKLOAD_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Header workload={workload} />
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />
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
