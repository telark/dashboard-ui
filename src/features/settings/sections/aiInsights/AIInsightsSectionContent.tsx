import React from 'react';
import AIInsightsSection from '../insightsGovernance/AIInsightsSection';
import SettingsNoPermissionsCard from '../../components/SettingsNoPermissionsCard';
import { usePermission } from '../../../auth/hooks/permissions/permissionEngine';

const AIInsightsSectionContent: React.FC = () => {
  const canView = usePermission('settings', 'Owner');
  if (!canView) {
    return (
      <SettingsNoPermissionsCard description="You do not have permission to manage AI Insights settings." />
    );
  }
  return <AIInsightsSection />;
};

export default AIInsightsSectionContent;
