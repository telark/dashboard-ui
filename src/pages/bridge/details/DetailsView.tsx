import React, { useState, memo, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { useSelector } from 'react-redux';
import { BridgeDetailsHook } from '../../../hooks/BridgeDetailsHook';
import { syncBridgeDetails } from '../../../utils/bridge/sync';
import { BRIDGE_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/bridge-details';
import { RootState } from '../../../store';
import { usePersistedTab } from '../../../utils/shared/usePersistedTab';
import { Error, Empty, Header, Tabs, Content } from '.';
import LoadingDetails from '../../../components/shared/LoadingDetails';

const BridgeDetailsView: React.FC = memo(function BridgeDetailsView() {
  const { name: bridgeNameFromUrl } = useParams<{ name: string }>();
  const {
    bridgeDetails,
    loading,
    error,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleBridgeSyncSave,
  } = BridgeDetailsHook();

  const { activeTab, handleTabChange } = usePersistedTab<TabKey>({
    resourceType: 'bridge',
    resourceName: bridgeNameFromUrl,
    tabKeys: BRIDGE_DETAILS_CONSTANTS.TAB_KEYS,
    defaultTab: BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL,
  });

  const [syncing, setSyncing] = useState(false);
  const { message } = AntdApp.useApp();
  const globalSyncing = useSelector((s: RootState) => s.bridge.syncing || {});
  const isGloballySyncing = Boolean(bridgeDetails?.name && globalSyncing[bridgeDetails.name]);

  const handleHeaderSync = useCallback(async () => {
    await syncBridgeDetails({
      details: bridgeDetails,
      setSyncing,
      message,
    });
  }, [bridgeDetails, setSyncing, message]);

  const totalResources = useMemo(
    () => bridgeDetails?.workloads?.length || 0,
    [bridgeDetails?.workloads?.length],
  );

  if (loading) {
    return <LoadingDetails />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!bridgeDetails) {
    return <Empty />;
  }

  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <Header
        bridgeDetails={bridgeDetails}
        syncing={syncing}
        isGloballySyncing={isGloballySyncing}
        onSync={handleHeaderSync}
      />

      <Tabs activeTab={activeTab} totalResources={totalResources} onTabChange={handleTabChange} />

      <Content
        activeTab={activeTab}
        bridgeDetails={bridgeDetails}
        isAutoSync={isAutoSync}
        loadingSave={loadingSave}
        hasChanges={hasChanges}
        handleAutoSyncChange={handleAutoSyncChange}
        handleBridgeSyncSave={handleBridgeSyncSave}
        syncing={syncing}
        isGloballySyncing={isGloballySyncing}
      />
    </div>
  );
});

export default BridgeDetailsView;
