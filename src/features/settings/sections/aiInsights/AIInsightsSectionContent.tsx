import React from 'react';
import AIInsightsSection from '../insightsGovernance/AIInsightsSection';
import { NoPermissionCard } from '../../../../components/shared';
import { SETTINGS_CONSTANTS } from '../../constants';
import {
  ACTION_PERMISSIONS,
  usePermission,
} from '../../../auth/hooks/permissions/permissionEngine';

const { controlAiInsights } = ACTION_PERMISSIONS.settings;

const AIInsightsSectionContent: React.FC = () => {
  const canView = usePermission(
    controlAiInsights.scope,
    controlAiInsights.level,
    controlAiInsights.deny,
  );
  if (!canView) {
    return (
      <NoPermissionCard
        featureName={SETTINGS_CONSTANTS.SECTIONS.AI_INSIGHTS.label}
        permission={controlAiInsights}
      />
    );
  }
  return <AIInsightsSection />;
};

export default AIInsightsSectionContent;
