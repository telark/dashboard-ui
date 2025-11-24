import React from 'react';
import TabButton from '../../../../../../../components/buttons/TabButton';
import { WORKLOAD_DETAILS_CONSTANTS, TabKey } from '../../../../constants';

const { TAB_KEYS } = WORKLOAD_DETAILS_CONSTANTS;

interface WorkloadTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const WorkloadTabs: React.FC<WorkloadTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div style={WORKLOAD_DETAILS_CONSTANTS.LAYOUT.TABS_CONTAINER}>
      <TabButton
        label="General"
        active={activeTab === TAB_KEYS.GENERAL}
        onClick={() => onTabChange(TAB_KEYS.GENERAL)}
      />
      <TabButton
        label="Instances"
        active={activeTab === TAB_KEYS.INSTANCES}
        onClick={() => onTabChange(TAB_KEYS.INSTANCES)}
      />
      <TabButton
        label="Bridges"
        active={activeTab === TAB_KEYS.BRIDGES}
        onClick={() => onTabChange(TAB_KEYS.BRIDGES)}
      />
      <TabButton
        label="History"
        active={activeTab === TAB_KEYS.HISTORY}
        onClick={() => onTabChange(TAB_KEYS.HISTORY)}
      />
      <TabButton
        label="Sync Mode"
        active={activeTab === TAB_KEYS.SYNC}
        onClick={() => onTabChange(TAB_KEYS.SYNC)}
      />
    </div>
  );
};

export default WorkloadTabs;
