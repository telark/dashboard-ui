import React, { memo } from 'react';
import SnapshotStorageSection from './SnapshotStorageSection';
import ReportStorageSection from './ReportStorageSection';

const SECTION_GAP_PX = 12;

const StorageSectionContent: React.FC = memo(() => (
  <>
    <SnapshotStorageSection />
    <div style={{ marginTop: SECTION_GAP_PX }}>
      <ReportStorageSection />
    </div>
  </>
));

StorageSectionContent.displayName = 'StorageSectionContent';

export default StorageSectionContent;
