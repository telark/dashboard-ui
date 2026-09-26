import React, { memo } from 'react';
import DiscoveryBehaviorSection from './DiscoveryBehaviorSection';
import SnapshotStorageSection from './SnapshotStorageSection';
import { NoPermissionCard } from '../../../../components/shared';
import { SETTINGS_CONSTANTS } from '../../constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const SECTION_GAP_PX = 12;
const { viewGovernance } = ACTION_PERMISSIONS.settings;

const AIInsightsGovernanceSectionContent: React.FC = memo(() => {
  const canView = usePermission(viewGovernance.scope, viewGovernance.level);
  if (!canView) {
    return (
      <NoPermissionCard
        featureName={SETTINGS_CONSTANTS.SECTIONS.AI_DATA.label}
        permission={viewGovernance}
      />
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
