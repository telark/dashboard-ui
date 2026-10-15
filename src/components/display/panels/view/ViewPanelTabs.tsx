import React, { useMemo, useState } from 'react';
import { Tabs, type TabsProps } from 'antd';
import { VIEW } from '../../../../constants/layout/panels';
import ViewPanelDetails from './ViewPanelDetails';
import type { ViewDetailRow, ViewPanelTab } from './types';

interface ViewPanelTabsProps {
  details: ViewDetailRow[];
  tabs: ViewPanelTab[];
}

const DETAILS_KEY = 'details';

const ViewPanelTabs: React.FC<ViewPanelTabsProps> = ({ details, tabs }) => {
  const [activeKey, setActiveKey] = useState(DETAILS_KEY);
  const items = useMemo<TabsProps['items']>(
    () => [
      {
        key: DETAILS_KEY,
        label: <span style={VIEW.TAB_LABEL}>{VIEW.TAB_DETAILS_LABEL}</span>,
        children: <ViewPanelDetails details={details} />,
      },
      ...tabs.map((tab) => ({
        key: tab.key,
        label: (
          <span style={VIEW.TAB_LABEL}>
            {tab.label}
            {tab.count !== undefined && (
              <span
                style={
                  tab.key === activeKey
                    ? { ...VIEW.TAB_COUNT, ...VIEW.TAB_COUNT_ACTIVE }
                    : VIEW.TAB_COUNT
                }
              >
                {tab.count}
              </span>
            )}
          </span>
        ),
        children: tab.content,
      })),
    ],
    [details, tabs, activeKey],
  );

  return (
    <Tabs
      style={VIEW.TABS}
      tabBarStyle={VIEW.TAB_BAR}
      activeKey={activeKey}
      onChange={setActiveKey}
      items={items}
    />
  );
};

export default ViewPanelTabs;
