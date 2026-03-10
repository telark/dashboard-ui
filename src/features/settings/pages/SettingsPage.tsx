import React from 'react';
import SettingsLayout from '../components/SettingsLayout';
import SettingsSidebar from '../components/SettingsSidebar';
import SettingsMainContent from '../components/SettingsMainContent';
import { useSettingsNavigation } from '../hooks';

const SettingsPage: React.FC = () => {
  const {
    activeSection,
    activeSectionConfig,
    isPasskeysView,
    onSectionChange,
    onManagePasskeysClick,
    passkeysBreadcrumbItems,
  } = useSettingsNavigation();

  return (
    <SettingsLayout
      sidebar={<SettingsSidebar activeSection={activeSection} onSectionChange={onSectionChange} />}
    >
      <SettingsMainContent
        activeSection={activeSection}
        activeSectionConfig={activeSectionConfig}
        isPasskeysView={isPasskeysView}
        passkeysBreadcrumbItems={passkeysBreadcrumbItems}
        onManagePasskeysClick={onManagePasskeysClick}
      />
    </SettingsLayout>
  );
};

export default SettingsPage;
