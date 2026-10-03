import React from 'react';
import SettingsLayout from '../components/SettingsLayout';
import SettingsMainContent from '../components/SettingsMainContent';
import { useSettingsNavigation } from '../hooks';
import type { SettingsSectionKey } from '../constants';
import { NoPermissionCard } from '../../../components/shared';
import type { RequiredPermission } from '../../../interfaces/shared';
import { PermissionGate, ACTION_PERMISSIONS } from '../../auth/hooks';

const { editOidcConfig, controlAiInsights, viewGovernance } = ACTION_PERMISSIONS.settings;

// SSO stays readable under its edit deny rule, so only its level gates the section.
const SECTION_PERMISSIONS: Partial<Record<SettingsSectionKey, RequiredPermission>> = {
  identityProvider: { scope: editOidcConfig.scope, level: editOidcConfig.level },
  aiInsights: controlAiInsights,
  insightsGovernance: viewGovernance,
};

const SettingsPage: React.FC = () => {
  const {
    activeSection,
    activeSectionConfig,
    isPasskeysView,
    onManagePasskeysClick,
    passkeysBreadcrumbItems,
  } = useSettingsNavigation();

  const page = (
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

  const permission = SECTION_PERMISSIONS[activeSection];
  if (permission == null || activeSectionConfig == null) return page;

  // Outside SettingsLayout, like the feature routes' fallback, so the lock state sits where theirs does.
  return (
    <PermissionGate
      requiredScope={permission.scope}
      requiredLevel={permission.level}
      action={permission.deny}
      fallback={
        <NoPermissionCard featureName={activeSectionConfig.label} permission={permission} />
      }
    >
      {page}
    </PermissionGate>
  );
};

export default SettingsPage;
