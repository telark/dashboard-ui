import React from 'react';
import { Card } from 'antd';
import GrouperGeneralInfo from '../../../components/display/grouper/GeneralInfo';
import HistoryTimeLine from '../../../components/display/shared/HistoryTimeLine';
import MaintenanceMode from '../../../components/tabs/MaintenanceMode';
import Resources from '../../../components/display/grouper/Resources';
import SyncMode from '../../../components/tabs/SyncMode';
import { GROUPER_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/grouper-details';

interface ContentProps {
  activeTab: TabKey;
  grouperDetails: any;
  totalResources: number;
  // Sync Mode Data
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (value: boolean) => void;
  handleGrouperSyncSave: () => void;
  // Maintenance Mode Data
  isMaintenanceModeActive: boolean;
  isMaintenanceModalVisible: boolean;
  maintenaceUpdateAction: boolean;
  maintenaceDeleteAction: boolean;
  handleEnableMaintenanceClick: () => void;
  handleCancelMaintenance: () => void;
  handleMaintenanceUpdateActionChange: (checked: boolean) => void;
  handleMaintenanceDeleteActionChange: (checked: boolean) => void;
  handleMaintenanceMode: () => void;
  hasMaintenanceData: boolean;
  handleRemoveMaintenanceMode: () => void;
  // Sync State
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
    maintenaceUpdateAction,
    maintenaceDeleteAction,
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
    const renderTabContent = () => {
      switch (activeTab) {
        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.GENERAL:
          return (
            <Card
              style={GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <GrouperGeneralInfo {...grouperDetails} totalResources={totalResources} />
            </Card>
          );

        case GROUPER_DETAILS_CONSTANTS.TAB_KEYS.RESOURCES:
          return (
            <Card
              style={GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: GROUPER_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <div style={{ padding: 4 }}>
                <Resources
                  name={grouperDetails.name}
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
                maintenaceUpdateAction={maintenaceUpdateAction}
                maintenaceDeleteAction={maintenaceDeleteAction}
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
