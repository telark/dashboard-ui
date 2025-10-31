import React, { useState, memo, useCallback, useMemo } from 'react';
import { App as AntdApp } from 'antd';
import { useSelector } from 'react-redux';
import { BridgeDetailsHook } from '../../../hooks/BridgeDetailsHook';
import { syncBridgeDetails } from '../../../utils/bridge/sync';
import { BRIDGE_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/bridge-details';
import { RootState } from '../../../store';
import { Loading, Error, Empty, Header, Tabs, Content } from '.';

const BridgeDetailsView: React.FC = memo(function BridgeDetailsView() {
  const {
    // Global Data
    bridgeDetails,
    loading,
    error,

    // Sync Mode Data
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleBridgeSyncSave,
  } = BridgeDetailsHook();

  const [activeTab, setActiveTab] = useState<TabKey>(BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL);
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
    return <Loading />;
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

      <Tabs activeTab={activeTab} totalResources={totalResources} onTabChange={setActiveTab} />

      <Content
        activeTab={activeTab}
        bridgeDetails={bridgeDetails}
        totalResources={totalResources}
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
