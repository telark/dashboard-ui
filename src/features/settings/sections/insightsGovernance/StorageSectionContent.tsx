import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import SnapshotStorageSection from './SnapshotStorageSection';
import ReportStorageSection from './ReportStorageSection';

const { CONTENT } = SETTINGS_CONSTANTS;

const StorageSectionContent: React.FC = memo(() => (
  <>
    <SnapshotStorageSection />
    <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
      <ReportStorageSection />
    </div>
  </>
));

StorageSectionContent.displayName = 'StorageSectionContent';

export default StorageSectionContent;
