import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import SettingsCard from './SettingsCard';
import { SETTINGS_CONSTANTS } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { ProfileSectionContent } from '../sections/profile';
import { AppearanceSectionContent } from '../sections/appearance';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SectionContentProps {
  sectionKey: SettingsSectionKey;
}

const SectionContent: React.FC<SectionContentProps> = memo(({ sectionKey }) => {
  switch (sectionKey) {
    case 'profile':
      return <ProfileSectionContent />;
    case 'appearance':
      return <AppearanceSectionContent />;
    case 'security':
      return (
        <>
          <SettingsCard
            title="Password"
            description="Change your password. Use a strong password you don’t use elsewhere."
          >
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
              Password change will be available here.
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Two-factor authentication"
              description="Add an extra layer of security to your account."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                2FA setup coming soon.
              </div>
            </SettingsCard>
          </div>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Active sessions"
              description="Manage devices where you’re currently signed in."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Session management coming soon.
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'preferences':
      return (
        <>
          <SettingsCard
            title="Language"
            description="Select your preferred language for the interface."
          >
            <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
              English (default)
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Timezone"
              description="All dates and times will be shown in this timezone."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Browser default
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'about':
      return (
        <>
          <SettingsCard title="Version" description="Current application version.">
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 14,
                color: DEFAULT_COLORS.SUCCESS,
              }}
            >
              1.0.0
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard title="Support" description="Documentation and help resources.">
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Links to docs and support will appear here.
              </div>
            </SettingsCard>
          </div>
        </>
      );
    default:
      return null;
  }
});

SectionContent.displayName = 'SectionContent';

export default SectionContent;
