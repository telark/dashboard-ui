import React, { memo } from 'react';
import SectionHeader from './SectionHeader';
import SectionContent from './SectionContent';
import { PasskeysSettingsView } from '../views';
import type { SettingsSectionConfig, SettingsSectionKey } from '../constants';
import type { SectionHeaderBreadcrumbItem } from './SectionHeader';

interface SettingsMainContentProps {
  activeSection: SettingsSectionKey;
  activeSectionConfig: SettingsSectionConfig | undefined;
  isPasskeysView: boolean;
  passkeysBreadcrumbItems: SectionHeaderBreadcrumbItem[];
  onManagePasskeysClick: () => void;
}

const SettingsMainContent: React.FC<SettingsMainContentProps> = memo(
  ({
    activeSection,
    activeSectionConfig,
    isPasskeysView,
    passkeysBreadcrumbItems,
    onManagePasskeysClick,
  }) => {
    if (isPasskeysView) {
      return <PasskeysSettingsView breadcrumbItems={passkeysBreadcrumbItems} />;
    }

    return (
      <>
        {activeSectionConfig != null && (
          <SectionHeader
            title={activeSectionConfig.label}
            description={activeSectionConfig.description}
          />
        )}
        <SectionContent
          sectionKey={activeSection}
          securitySectionProps={{ onManagePasskeysClick }}
        />
      </>
    );
  },
);

SettingsMainContent.displayName = 'SettingsMainContent';

export default SettingsMainContent;
