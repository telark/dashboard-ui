import React from 'react';
import WorkloadTabs, { type TabKey } from '../../../../components/display/workloads/apps/Tabs';

interface TabsProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

const Tabs: React.FC<TabsProps> = React.memo(({ activeTab, onTabChange }) => {
  return <WorkloadTabs activeTab={activeTab} onTabChange={onTabChange} />;
});

Tabs.displayName = 'Tabs';

export default Tabs;
