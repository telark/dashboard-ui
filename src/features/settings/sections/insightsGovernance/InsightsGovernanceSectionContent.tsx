import React, { memo } from 'react';
import DiscoveryBehaviorSection from './DiscoveryBehaviorSection';
import SnapshotStorageSection from './SnapshotStorageSection';
import SettingsNoPermissionsCard from '../../components/SettingsNoPermissionsCard';
import { usePermission } from '../../../auth/hooks/permissions/permissionEngine';

const SECTION_GAP_PX = 12;

const AIInsightsGovernanceSectionContent: React.FC = memo(() => {
  const canView = usePermission('settings', 'Contributor');
  if (!canView) {
    return (
      <SettingsNoPermissionsCard description="You do not have permission to manage Insights Governance settings." />
    );
  }
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
