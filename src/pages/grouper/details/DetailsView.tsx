import React, { useState, memo } from 'react';
import { App as AntdApp } from 'antd';
import { useSelector } from 'react-redux';
import { GrouperDetailsHook } from '../../../hooks/GrouperDetailsHook';
import { syncGrouperDetails } from '../../../utils/grouper-details';
import { GROUPER_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/grouper-details';
import { RootState } from '../../../store';
import {
  Loading,
  Error,
  Empty,
  Header,
  Tabs,
  Content,
} from '.';



const GrouperDetailsView: React.FC = memo(() => {
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
    maintenaceUpdateAction,
    maintenaceDeleteAction,
    handleEnableMaintenanceClick,
    handleCancelMaintenance,
    handleMaintenanceUpdateActionChange,
    handleMaintenanceDeleteActionChange,
    handleMaintenanceMode,
    hasMaintenanceData,
    handleRemoveMaintenanceMode,
  } = GrouperDetailsHook();

  const [activeTab, setActiveTab] = useState<TabKey>(GROUPER_DETAILS_CONSTANTS.TAB_KEYS.GENERAL);
  const [syncing, setSyncing] = useState(false);
  const { message } = AntdApp.useApp();
  const globalSyncing = useSelector((s: RootState) => (s.grouper as any).syncing || {});
  const isGloballySyncing = Boolean(globalSyncing[(grouperDetails as any)?.name]);

  const handleHeaderSync = async () => {
    await syncGrouperDetails({
      grouperDetails,
      setSyncing,
      message,
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  if (!grouperDetails) {
    return <Empty />;
  }

  const totalResources =
    (grouperDetails.workloads?.length || 0) + (grouperDetails.bridges?.length || 0);

  return (
    <div style={GROUPER_DETAILS_CONSTANTS.LAYOUT.PAGE_CONTAINER}>
      <Header
        grouperDetails={grouperDetails}
        isMaintenanceModeActive={isMaintenanceModeActive}
        syncing={syncing}
        isGloballySyncing={isGloballySyncing}
        onSync={handleHeaderSync}
      />

      <Tabs
        activeTab={activeTab}
        totalResources={totalResources}
        onTabChange={setActiveTab}
      />

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
        maintenaceUpdateAction={maintenaceUpdateAction}
        maintenaceDeleteAction={maintenaceDeleteAction}
        handleEnableMaintenanceClick={handleEnableMaintenanceClick}
        handleCancelMaintenance={handleCancelMaintenance}
        handleMaintenanceUpdateActionChange={handleMaintenanceUpdateActionChange}
        handleMaintenanceDeleteActionChange={handleMaintenanceDeleteActionChange}
        handleMaintenanceMode={handleMaintenanceMode}
        hasMaintenanceData={hasMaintenanceData}
        handleRemoveMaintenanceMode={handleRemoveMaintenanceMode}
      />
    </div>
  );
});

export default GrouperDetailsView;
