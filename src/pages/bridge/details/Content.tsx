import React, { useMemo } from 'react';
import { Card } from 'antd';
import ViewDetails from '../../../components/display/shared/views/ViewDetails';
import HistoryTimeLine from '../../../components/display/shared/timeline';
import BridgeResources from '../../../components/display/bridge/Resources';
import SyncMode from '../../../components/tabs/SyncMode';
import { BRIDGE_DETAILS_CONSTANTS, TabKey } from '../../../constants/pages/bridge-details';
import { createBridgeViewConfig } from '../../../config/bridgeViewConfig';

interface ContentProps {
  activeTab: TabKey;
  bridgeDetails: any;
  isAutoSync: boolean;
  loadingSave: boolean;
  hasChanges: boolean;
  handleAutoSyncChange: (value: boolean) => void;
  handleBridgeSyncSave: () => void;
  syncing: boolean;
  isGloballySyncing: boolean;
}

const Content: React.FC<ContentProps> = React.memo(
  ({
    activeTab,
    bridgeDetails,
    isAutoSync,
    loadingSave,
    hasChanges,
    handleAutoSyncChange,
    handleBridgeSyncSave,
    syncing,
    isGloballySyncing,
  }) => {
    const bridgeViewConfig = useMemo(() => {
      if (!bridgeDetails) return null;
      return createBridgeViewConfig(bridgeDetails);
    }, [bridgeDetails]);

    const renderTabContent = () => {
      switch (activeTab) {
        case BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL:
          return bridgeViewConfig ? <ViewDetails config={bridgeViewConfig} /> : null;

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
