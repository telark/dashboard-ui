import React, { useEffect, useState, memo } from 'react';
import { message } from 'antd';
import { useParams } from 'react-router-dom';
import { AppWorkloadDetailsHook } from '../../../../hooks/AppWorkloadDetailsHook';
import {
  Loading,
  Error,
  Empty,
  Header,
  Tabs,
  Content,
} from '.';

const AppWorkloadDetailsView: React.FC = memo(() => {
  const { name } = useParams<{ name: string }>();
  const [activeTab, setActiveTab] = useState<'general' | 'instances' | 'bridges' | 'history' | 'sync'>('general');

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
    <>
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
      />
    </>
  );
});

export default AppWorkloadDetailsView;
