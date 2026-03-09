import React, { useState, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { SETTINGS_CONSTANTS, SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import SettingsSidebar from '../components/SettingsSidebar';
import SectionContent from '../components/SectionContent';

const { CONTENT } = SETTINGS_CONSTANTS;

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>('profile');
  const activeSectionConfig = useMemo(
    () => SETTINGS_SECTIONS_LIST.find((s) => s.key === activeSection),
    [activeSection],
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 60,
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'auto',
            padding: '24px 48px 48px',
          }}
        >
          <div style={{ maxWidth: CONTENT.MAX_WIDTH, margin: 0 }}>
            {activeSectionConfig && (
              <div style={{ marginBottom: 24 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: CONTENT.SECTION_TITLE_FONT_SIZE,
                    fontWeight: 600,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                  }}
                >
                  {activeSectionConfig.label}
                </h2>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontSize: 14,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    lineHeight: 1.5,
                  }}
                >
                  {activeSectionConfig.description}
                </p>
              </div>
            )}
            <SectionContent sectionKey={activeSection} />
          </div>
        </main>
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
