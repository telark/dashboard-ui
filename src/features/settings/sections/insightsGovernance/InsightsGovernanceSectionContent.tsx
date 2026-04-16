import React, { memo } from 'react';
import DiscoveryBehaviorSection from './DiscoveryBehaviorSection';
import SnapshotStorageSection from './SnapshotStorageSection';

const SECTION_GAP_PX = 12;
const AIInsightsGovernanceSectionContent: React.FC = memo(() => {
  return (
    <>
      <DiscoveryBehaviorSection />
      <div style={{ marginTop: SECTION_GAP_PX }}>
        <SnapshotStorageSection />
      </div>
    </>
  );
});

AIInsightsGovernanceSectionContent.displayName = 'AIInsightsGovernanceSectionContent';

export default AIInsightsGovernanceSectionContent;
