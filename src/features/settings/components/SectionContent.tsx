import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import SettingsCard from './SettingsCard';
import { SETTINGS_CONSTANTS } from '../constants';
import type { SettingsSectionKey } from '../constants';
import { ProfileSectionContent } from '../sections/profile';
import { AppearanceSectionContent } from '../sections/appearance';
import { SecuritySectionContent } from '../sections/security';
import { AIDataSectionContent } from '../sections/aiData';

const { CONTENT } = SETTINGS_CONSTANTS;

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
      case 'aiData':
        return <AIDataSectionContent />;
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
  },
);

SectionContent.displayName = 'SectionContent';

export default SectionContent;
