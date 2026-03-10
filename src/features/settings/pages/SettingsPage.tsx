import React, { useState, useMemo } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import { SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import SettingsSidebar from '../components/SettingsSidebar';
import SectionContent from '../components/SectionContent';

const { HEADER_OFFSET_PX, PADDING_TOP_PX, PADDING_HORIZONTAL_AND_BOTTOM_PX } = PAGE_CONTENT_LAYOUT;
const SETTINGS_CONTENT_PADDING = `${PADDING_TOP_PX - HEADER_OFFSET_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px`;

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
        paddingTop: HEADER_OFFSET_PX,
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
          }}
        >
          <div
            style={{
              background: DEFAULT_COLORS.BACKGROUND_WHITE,
              minHeight: '100vh',
              padding: SETTINGS_CONTENT_PADDING,
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            {activeSectionConfig && (
              <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 0 }}>
                <h1
                  style={{
                    margin: 0,
                    padding: 0,
                    fontSize: 28,
                    fontWeight: 700,
                    color: DEFAULT_COLORS.TEXT_PRIMARY,
                    lineHeight: 1.2,
                  }}
                >
                  {activeSectionConfig.label}
                </h1>
                <p
                  style={{
                    margin: 0,
                    marginTop: 0,
                    padding: 0,
                    fontSize: 14,
                    fontWeight: 400,
                    color: DEFAULT_COLORS.TEXT_MUTED,
                    lineHeight: 1.2,
                  }}
                >
                  {activeSectionConfig.description}
                </p>
              </div>
            )}
            <SectionContent sectionKey={activeSection} />
          </div>
        </main>
        <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>
    </div>
  );
};

export default SettingsPage;
