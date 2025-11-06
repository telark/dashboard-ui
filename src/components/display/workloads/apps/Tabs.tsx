import React from 'react';
import TabButton from '../../../../components/buttons/TabButton';

const TAB_KEYS = {
  GENERAL: 'general',
  INSTANCES: 'instances',
  BRIDGES: 'bridges',
  HISTORY: 'history',
  SYNC: 'sync',
} as const;

type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];

interface WorkloadTabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const WorkloadTabs: React.FC<WorkloadTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: 'linear-gradient(180deg, rgba(239,244,250,0.6), rgba(239,244,250,0))',
        padding: '8px 0',
        borderRadius: 24,
      }}
    >
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
export { TAB_KEYS };
export type { TabKey };
