import React, { useEffect, useState, memo } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppWorkloadDetailsHook } from '../../../../hooks/AppWorkloadDetailsHook';
import { Loading, Error, Empty, Header, Tabs, Content } from '.';
import { GROUPER_DETAILS_CONSTANTS } from '../../../../constants/pages/grouper-details';
import { RootState } from '../../../../store';

const AppWorkloadDetailsView: React.FC = memo(function AppWorkloadDetailsView() {
  const { name } = useParams<{ name: string }>();
  const [activeTab, setActiveTab] = useState<
    'general' | 'instances' | 'bridges' | 'history' | 'sync'
  >('general');
  const [syncing, setSyncing] = useState(false);

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
  const globalSyncing = useSelector((s: RootState) => (s.workload as any).syncing || {});
  const isGloballySyncing = Boolean(workloadName && globalSyncing[workloadName]);

  useEffect(() => {
    if (error) {
      message.error('Failed to load workload details');
    }
  }, [error]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error onRetry={() => window.location.reload()} />;
  }

  if (!workload) {
    return <Empty appName={name} />;
  }

  return (
    <div style={GROUPER_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <Header workload={workload} />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
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
  );
});

export default AppWorkloadDetailsView;
