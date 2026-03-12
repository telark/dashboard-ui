import React, { memo } from 'react';
import PasskeysMainPage from '../../auth/pages/passkeys/MainPage';
import SectionHeader from '../components/SectionHeader';
import type { SectionHeaderBreadcrumbItem } from '../components/SectionHeader';

interface PasskeysSettingsViewProps {
  breadcrumbItems: SectionHeaderBreadcrumbItem[];
}

const PasskeysSettingsView: React.FC<PasskeysSettingsViewProps> = memo(({ breadcrumbItems }) => (
  <>
    <SectionHeader title="" breadcrumbItems={breadcrumbItems} />
    <PasskeysMainPage embedInSettings />
  </>
));

PasskeysSettingsView.displayName = 'PasskeysSettingsView';

export default PasskeysSettingsView;
