import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import SettingsCard from './SettingsCard';
import { SETTINGS_CONSTANTS } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { ProfileSectionContent } from '../sections/profile';

const { CONTENT } = SETTINGS_CONSTANTS;

interface SectionContentProps {
  sectionKey: SettingsSectionKey;
}

const SectionContent: React.FC<SectionContentProps> = memo(({ sectionKey }) => {
  switch (sectionKey) {
    case 'profile':
      return <ProfileSectionContent />;
    case 'appearance':
      return (
        <>
          <SettingsCard
            title="Theme"
            description="Choose how the dashboard looks. System preference support coming soon."
          >
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {['Light', 'Dark', 'System'].map((theme) => (
                <div
                  key={theme}
                  style={{
                    padding: '12px 20px',
                    borderRadius: 8,
                    border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
                    background:
                      theme === 'Light' ? 'rgba(32, 201, 151, 0.08)' : DEFAULT_COLORS.BACKGROUND_WHITE,
                    color: theme === 'Light' ? '#0d9488' : DEFAULT_COLORS.TEXT_MUTED,
                    fontWeight: theme === 'Light' ? 600 : 500,
                    fontSize: 14,
                    cursor: 'default',
                  }}
                >
                  {theme}
                </div>
              ))}
            </div>
          </SettingsCard>
          <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
            <SettingsCard
              title="Density"
              description="Compact or comfortable spacing for lists and tables."
            >
              <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: 14 }}>
                Comfortable (default)
              </div>
            </SettingsCard>
          </div>
        </>
      );
    case 'notifications':
      return (
        <>
          <SettingsCard
            title="Email notifications"
            description="Choose which updates you want to receive by email."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Security alerts', 'Product updates', 'Weekly digest'].map((label, i) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom:
                      i < 2 ? `1px solid ${DEFAULT_COLORS.BACKGROUND_HOVER}` : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_SECONDARY }}>
                    {label}
                  </span>
                  <div
                    style={{
                      width: 40,
                      height: 22,
                      borderRadius: 11,
                      background: DEFAULT_COLORS.BORDER_LIGHT,
                      cursor: 'default',
                    }}
                  />
                </div>
              ))}
            </div>
          </SettingsCard>
        </>
      );
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
