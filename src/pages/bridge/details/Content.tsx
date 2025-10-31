import React from 'react';
import { Card } from 'antd';
import BridgeGeneralInfo from '../../../components/display/bridge/GeneralInfo';
import HistoryTimeLine from '../../../components/display/shared/HistoryTimeLine';
import BridgeResources from '../../../components/display/bridge/Resources';
import SyncMode from '../../../components/tabs/SyncMode';
import { BRIDGE_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/bridge-details';

interface ContentProps {
  activeTab: TabKey;
  bridgeDetails: any;
  totalResources: number;
  // Sync Mode Data
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (value: boolean) => void;
  handleBridgeSyncSave: () => void;
  // Sync State
  syncing: boolean;
  isGloballySyncing: boolean;
}

const Content: React.FC<ContentProps> = React.memo(
  ({
    activeTab,
    bridgeDetails,
    totalResources,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleBridgeSyncSave,
    syncing,
    isGloballySyncing,
  }) => {
    const renderTabContent = () => {
      switch (activeTab) {
        case BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL:
          return (
            <Card
              style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <BridgeGeneralInfo
                name={bridgeDetails.name}
                creationTime={bridgeDetails.creationTime}
                lastUpdateTime={bridgeDetails.lastUpdateTime}
                status={bridgeDetails.status}
                type={bridgeDetails.type}
                grouper={bridgeDetails.grouper}
                sourceName={bridgeDetails.sourceName}
                sourceType={bridgeDetails.sourceType}
                ports={bridgeDetails.ports}
                workloads={bridgeDetails.workloads}
              />
            </Card>
          );

        case BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.RESOURCES:
          return (
            <Card
              style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <div style={{ padding: 4 }}>
                <BridgeResources
                  name={bridgeDetails.name}
                  workloads={bridgeDetails.workloads || []}
                />
              </div>
            </Card>
          );

        case BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.HISTORY:
          return (
            <Card
              style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <HistoryTimeLine Records={bridgeDetails.history} />
            </Card>
          );

        case BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.SYNC:
          return (
            <Card
              style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD}
              styles={{ body: BRIDGE_DETAILS_CONSTANTS.LAYOUT.SECTION_CARD_BODY }}
            >
              <SyncMode
                isAutoSync={isAutoSync}
                loadingSave={loadingSave}
                hasChanges={hasChanges}
                handleAutoSyncChange={handleAutoSyncChange}
                handleSyncSave={handleBridgeSyncSave}
                syncing={syncing}
                isGloballySyncing={isGloballySyncing}
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
