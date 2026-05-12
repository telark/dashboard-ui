import React from 'react';
import SettingsLayout from '../components/SettingsLayout';
import SettingsMainContent from '../components/SettingsMainContent';
import { useSettingsNavigation } from '../hooks';

const SettingsPage: React.FC = () => {
  const {
    activeSection,
    activeSectionConfig,
    isPasskeysView,
    onManagePasskeysClick,
    passkeysBreadcrumbItems,
  } = useSettingsNavigation();

  return (
    <SettingsLayout>
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
