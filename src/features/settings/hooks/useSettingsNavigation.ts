import { useState, useMemo, useCallback } from 'react';
import { SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import type { SectionHeaderBreadcrumbItem } from '../components/SectionHeader';
import { SECURITY_SECTION_CONSTANTS } from '../sections/security/constants';

export type SecuritySubView = 'overview' | 'passkeys';

export function useSettingsNavigation(initialSection: SettingsSectionKey = 'profile') {
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>(initialSection);
  const [securitySubView, setSecuritySubView] = useState<SecuritySubView>('overview');

  const activeSectionConfig = useMemo(
    () => SETTINGS_SECTIONS_LIST.find((s) => s.key === activeSection),
    [activeSection],
  );

  const isPasskeysView = activeSection === 'security' && securitySubView === 'passkeys';

  const onSectionChange = useCallback((key: SettingsSectionKey) => {
    if (key !== 'security') {
      setSecuritySubView('overview');
    }
    setActiveSection(key);
  }, []);

  const onManagePasskeysClick = useCallback(() => {
    setActiveSection('security');
    setSecuritySubView('passkeys');
  }, []);

  const passkeysBreadcrumbItems = useMemo<SectionHeaderBreadcrumbItem[]>(
    () => [
      {
        label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.SECURITY,
        onClick: () => setSecuritySubView('overview'),
      },
      { label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.PASSKEYS },
    ],
    [],
  );

  return {
    activeSection,
    activeSectionConfig,
    isPasskeysView,
    onSectionChange,
    onManagePasskeysClick,
    passkeysBreadcrumbItems,
  };
}
