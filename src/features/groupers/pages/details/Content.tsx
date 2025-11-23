import React, { useMemo } from 'react';
import { Card } from 'antd';
import ViewDetails from '../../../../components/display/shared/views/ViewDetails';
import HistoryTimeLine from '../../../../components/display/shared/timeline';
import MaintenanceMode from '../../../../components/tabs/MaintenanceMode';
import { Resources } from '../../components';
import SyncMode from '../../../../components/tabs/SyncMode';
import { GROUPER_DETAILS_CONSTANTS, TabKey } from '../../constants/grouper-details';
import { createGrouperViewConfig } from '../../config';

interface ContentProps {
  activeTab: TabKey;
  grouperDetails: any;
  totalResources: number;
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (value: boolean) => void;
  handleGrouperSyncSave: () => void;
  isMaintenanceModeActive: boolean;
  isMaintenanceModalVisible: boolean;
  maintenanceUpdateAction: boolean;
  maintenanceDeleteAction: boolean;
  handleEnableMaintenanceClick: () => void;
  handleCancelMaintenance: () => void;
  handleMaintenanceUpdateActionChange: (checked: boolean) => void;
  handleMaintenanceDeleteActionChange: (checked: boolean) => void;
  handleMaintenanceMode: () => void;
  hasMaintenanceData: boolean;
  handleRemoveMaintenanceMode: () => void;
  syncing: boolean;
  isGloballySyncing: boolean;
}

const Content: React.FC<ContentProps> = React.memo(
  ({
    activeTab,
    grouperDetails,
    totalResources,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleGrouperSyncSave,
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
    syncing,
    isGloballySyncing,
  }) => {
    const grouperViewConfig = useMemo(() => {
      if (!grouperDetails) return null;
      return createGrouperViewConfig(grouperDetails, totalResources);
    }, [grouperDetails, totalResources]);

    const renderTabContent = () => {
      switch (activeTab) {
        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.GENERAL:
          return grouperViewConfig ? <ViewDetails config={grouperViewConfig} /> : null;

        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.RESOURCES:
          return (
            <Card
              style={GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <div style={{ padding: 4 }}>
                <Resources
                  resources={[
                    ...(grouperDetails.workloads || []),
                    ...(grouperDetails.bridges || []),
                  ]}
                />
              </div>
            </Card>
          );

        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.HISTORY:
          return (
            <Card
              style={GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <HistoryTimeLine Records={grouperDetails.history} />
            </Card>
          );

        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.SYNC:
          return (
            <Card
              style={GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <SyncMode
                isAutoSync={isAutoSync}
                loadingSave={loadingSave}
                hasChanges={hasChanges}
                handleAutoSyncChange={handleAutoSyncChange}
                handleSyncSave={handleGrouperSyncSave}
                syncing={syncing}
                isGloballySyncing={isGloballySyncing}
              />
            </Card>
          );

        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.MAINTENANCE:
          return (
            <Card
              style={{ ...GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD, marginBottom: 24 }}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <MaintenanceMode
                isMaintenanceModeActive={isMaintenanceModeActive}
                maintenanceUpdateAction={maintenanceUpdateAction}
                maintenanceDeleteAction={maintenanceDeleteAction}
                isMaintenanceModalVisible={isMaintenanceModalVisible}
                handleEnableMaintenanceClick={handleEnableMaintenanceClick}
                handleCancelMaintenance={handleCancelMaintenance}
                handleMaintenanceUpdateActionChange={handleMaintenanceUpdateActionChange}
                handleMaintenanceDeleteActionChange={handleMaintenanceDeleteActionChange}
                handleMaintenanceMode={handleMaintenanceMode}
                hasMaintenanceData={hasMaintenanceData}
                handleRemoveMaintenanceMode={handleRemoveMaintenanceMode}
              />
            </Card>
          );

        default:
          return null;
      }
    };

    return <>{renderTabContent()}</>;
  },
);

Content.displayName = 'Content';

export default Content;
