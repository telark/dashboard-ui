import { useMemo, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import type { SectionHeaderBreadcrumbItem } from '../components/SectionHeader';
import { SECURITY_SECTION_CONSTANTS } from '../sections/security/constants';
import { APP_ROUTES } from '../../../constants';

const SECTION_TO_SLUG: Record<SettingsSectionKey, string> = {
  profile: 'profile',
  appearance: 'appearance',
  timezone: 'timezone',
  security: 'security',
  aiInsights: 'insights',
  insightsGovernance: 'discovery',
  identityProvider: 'authentication',
  myPermissions: 'permissions',
  about: 'about',
};

const SLUG_TO_SECTION: Record<string, SettingsSectionKey> = {
  profile: 'profile',
  appearance: 'appearance',
  timezone: 'timezone',
  security: 'security',
  insights: 'aiInsights',
  discovery: 'insightsGovernance',
  authentication: 'identityProvider',
  permissions: 'myPermissions',
  about: 'about',
};

export function useSettingsNavigation(initialSection: SettingsSectionKey = 'profile') {
  const location = useLocation();
  const navigate = useNavigate();
  const activeSection = useMemo<SettingsSectionKey>(() => {
    const prefix = `${APP_ROUTES.SETTINGS}/`;
    if (!location.pathname.startsWith(prefix)) return initialSection;
    const segment = location.pathname.slice(prefix.length).split('/')[0];
    return SLUG_TO_SECTION[segment] ?? initialSection;
  }, [initialSection, location.pathname]);

  useEffect(() => {
    if (location.pathname === APP_ROUTES.SETTINGS) {
      navigate(`${APP_ROUTES.SETTINGS}/profile`, { replace: true });
    }
  }, [location.pathname, navigate]);

  const activeSectionConfig = useMemo(
    () => SETTINGS_SECTIONS_LIST.find((s) => s.key === activeSection),
    [activeSection],
  );

  const isPasskeysView = location.pathname === APP_ROUTES.PASSKEYS;

  const onSectionChange = useCallback(
    (key: SettingsSectionKey) => {
      navigate(`${APP_ROUTES.SETTINGS}/${SECTION_TO_SLUG[key]}`);
    },
    [navigate],
  );

  const onManagePasskeysClick = useCallback(() => {
    navigate(APP_ROUTES.PASSKEYS);
  }, [navigate]);

  const passkeysBreadcrumbItems = useMemo<SectionHeaderBreadcrumbItem[]>(
    () => [
      {
        label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.SECURITY,
        onClick: () => navigate(`${APP_ROUTES.SETTINGS}/${SECTION_TO_SLUG.security}`),
      },
      { label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.PASSKEYS },
    ],
    [navigate],
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
