import React, { memo } from 'react';
import type { SettingsSectionKey } from '../constants';
import { ProfileSectionContent } from '../sections/profile';
import { AppearanceSectionContent } from '../sections/appearance';
import { SecuritySectionContent } from '../sections/security';
import { AIInsightsSectionContent } from '../sections/aiInsights';
import { InsightsGovernanceSectionContent } from '../sections/insightsGovernance';
import { IdentityProviderSectionContent } from '../sections/identityProvider';
import { MyPermissionsSectionContent } from '../sections/myPermissions';

export interface SecuritySectionProps {
  onManagePasskeysClick: () => void;
}

interface SectionContentProps {
  sectionKey: SettingsSectionKey;
  securitySectionProps?: SecuritySectionProps;
}

const SectionContent: React.FC<SectionContentProps> = memo(
  ({ sectionKey, securitySectionProps }) => {
    switch (sectionKey) {
      case 'profile':
        return <ProfileSectionContent />;
      case 'appearance':
        return <AppearanceSectionContent />;
      case 'security':
        return (
          <SecuritySectionContent
            onManagePasskeysClick={securitySectionProps?.onManagePasskeysClick}
          />
        );
      case 'aiInsights':
        return <AIInsightsSectionContent />;
      case 'insightsGovernance':
        return <InsightsGovernanceSectionContent />;
      case 'identityProvider':
        return <IdentityProviderSectionContent />;
      case 'myPermissions':
        return <MyPermissionsSectionContent />;
      default:
        return null;
    }
  },
);

SectionContent.displayName = 'SectionContent';

export default SectionContent;
