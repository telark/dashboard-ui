import React, { useState, memo, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { useSelector } from 'react-redux';
import { useGrouperDetails } from '../../hooks';
import { syncGrouperDetails } from '../../utils/sync/sync';
import { GROUPER_DETAILS_CONSTANTS, TabKey } from '../../constants/grouper-details';
import { RootState } from '../../../../store';
import { usePersistedTab } from '../../../../utils/shared/usePersistedTab';
import { GrouperDetailsError, GrouperDetailsEmpty, Header, Tabs, Content } from '..';
import LoadingDetails from '../../../../components/shared/LoadingDetails';

const GrouperDetailsView: React.FC = memo(function GrouperDetailsView() {
  const { name: grouperNameFromUrl } = useParams<{ name: string }>();
  const {
    // Global Data
    grouperDetails,
    loading,
    error,

    // Sync Mode Data
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleGrouperSyncSave,

    // Maintenance Mode Data
    isMaintenanceModeActive,
    isMaintenanceModalVisible,
    maintenanceUpdateAction,
    maintenanceDeleteAction,
    handleEnableMaintenanceClick,
    handleCancelMaintenance,
    handleMaintenanceUpdateActionChange,
    handleMaintenanceDeleteActionChange,
    handleMaintenanceMode,
    hasMaintenanceData,
    handleRemoveMaintenanceMode,
  } = useGrouperDetails();

  const { activeTab, handleTabChange } = usePersistedTab<TabKey>({
    resourceType: 'grouper',
    resourceName: grouperNameFromUrl,
    tabKeys: GROUPER_DETAILS_CONSTANTS.TAB_KEYS,
    defaultTab: GROUPER_DETAILS_CONSTANTS.TAB_KEYS.GENERAL,
  });

  const [syncing, setSyncing] = useState(false);
  const { message } = AntdApp.useApp();
  const globalSyncing = useSelector((s: RootState) => s.grouper.syncing || {});
  const isGloballySyncing = Boolean(grouperDetails?.name && globalSyncing[grouperDetails.name]);

  const handleHeaderSync = useCallback(async () => {
    await syncGrouperDetails({
      details: grouperDetails,
      setSyncing,
      message,
    });
  }, [grouperDetails, setSyncing, message]);

  const totalResources = useMemo(
    () => (grouperDetails?.workloads?.length || 0) + (grouperDetails?.bridges?.length || 0),
    [grouperDetails?.workloads?.length, grouperDetails?.bridges?.length],
  );

  if (loading) {
    return <LoadingDetails />;
  }

  if (error) {
    return <GrouperDetailsError error={error} />;
  }

  if (!grouperDetails) {
    return <GrouperDetailsEmpty />;
  }

  return (
    <div style={GROUPER_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Header
          grouperDetails={grouperDetails}
          isMaintenanceModeActive={isMaintenanceModeActive}
          syncing={syncing}
          isGloballySyncing={isGloballySyncing}
          onSync={handleHeaderSync}
        />

        <Tabs activeTab={activeTab} totalResources={totalResources} onTabChange={handleTabChange} />

        <Content
          activeTab={activeTab}
          grouperDetails={grouperDetails}
          totalResources={totalResources}
          isAutoSync={isAutoSync}
          loadingSave={loadingSave}
          hasChanges={hasChanges}
          handleAutoSyncChange={handleAutoSyncChange}
          handleGrouperSyncSave={handleGrouperSyncSave}
          isMaintenanceModeActive={isMaintenanceModeActive}
          isMaintenanceModalVisible={isMaintenanceModalVisible}
          maintenanceUpdateAction={maintenanceUpdateAction}
          maintenanceDeleteAction={maintenanceDeleteAction}
          handleEnableMaintenanceClick={handleEnableMaintenanceClick}
          handleCancelMaintenance={handleCancelMaintenance}
          handleMaintenanceUpdateActionChange={handleMaintenanceUpdateActionChange}
          handleMaintenanceDeleteActionChange={handleMaintenanceDeleteActionChange}
          handleMaintenanceMode={handleMaintenanceMode}
          hasMaintenanceData={hasMaintenanceData}
          handleRemoveMaintenanceMode={handleRemoveMaintenanceMode}
          syncing={syncing}
          isGloballySyncing={isGloballySyncing}
        />
      </div>
    </div>
  );
});

export default GrouperDetailsView;
