import React from 'react';
import TabButton from '../../../../components/buttons/TabButton';
import { UI } from '../../../../constants/layout/ui';
import { BRIDGE_DETAILS_CONSTANTS, TabKey } from '../../constants';

interface TabsProps {
  activeTab: TabKey;
  totalResources: number;
  onTabChange: (tab: TabKey) => void;
}

const Tabs: React.FC<TabsProps> = React.memo(({ activeTab, totalResources, onTabChange }) => {
  return (
    <div style={BRIDGE_DETAILS_CONSTANTS.LAYOUT.TABS_CONTAINER}>
      <TabButton
        label={UI.TABS.GENERAL}
        active={activeTab === BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL}
        onClick={() => onTabChange(BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.GENERAL)}
      />
      <TabButton
        label={`${UI.TABS.RESOURCES} (${totalResources})`}
        active={activeTab === BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.RESOURCES}
        onClick={() => onTabChange(BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.RESOURCES)}
      />
      <TabButton
        label={UI.TABS.HISTORY}
        active={activeTab === BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.HISTORY}
        onClick={() => onTabChange(BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.HISTORY)}
      />
      <TabButton
        label={UI.TABS.SYNC_MODE}
        active={activeTab === BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.SYNC}
        onClick={() => onTabChange(BRIDGE_DETAILS_CONSTANTS.TAB_KEYS.SYNC)}
      />
    </div>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
