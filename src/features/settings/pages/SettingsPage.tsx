import React, { useState, useMemo, useCallback } from 'react';
import { DEFAULT_COLORS } from '../../../constants';
import { PAGE_CONTENT_LAYOUT } from '../../../constants/shared/pages';
import { SETTINGS_SECTIONS_LIST } from '../constants';
import type { SettingsSectionKey } from '../constants';
import SettingsSidebar from '../components/SettingsSidebar';
import SectionContent from '../components/SectionContent';
import { SECURITY_SECTION_CONSTANTS } from '../sections/security/constants';
import PasskeysMainPage from '../../../features/auth/pages/passkeys/MainPage';

const { HEADER_OFFSET_PX, PADDING_TOP_PX, PADDING_HORIZONTAL_AND_BOTTOM_PX } = PAGE_CONTENT_LAYOUT;
const SETTINGS_CONTENT_PADDING = `${PADDING_TOP_PX - HEADER_OFFSET_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px ${PADDING_HORIZONTAL_AND_BOTTOM_PX}px`;

type SecuritySubView = 'overview' | 'passkeys';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSectionKey>('profile');
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

  const passkeysBreadcrumbItems = useMemo(
    () => [
      {
        label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.SECURITY,
        onClick: () => setSecuritySubView('overview'),
      },
      { label: SECURITY_SECTION_CONSTANTS.LABELS.BREADCRUMBS.PASSKEYS },
    ],
    [],
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
            {isPasskeysView ? (
              <>
                <div
                  style={{
                    marginBottom: 32,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      padding: 0,
                      fontSize: 28,
                      fontWeight: 700,
                      color: DEFAULT_COLORS.TEXT_PRIMARY,
                      lineHeight: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {passkeysBreadcrumbItems.map((b, index) => (
                      <React.Fragment key={index}>
                        {index > 0 && <span style={{ color: '#64748b' }}> / </span>}
                        {b.onClick ? (
                          <button
                            type="button"
                            onClick={b.onClick}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              color: '#64748b',
                              fontSize: 28,
                              fontWeight: 700,
                              fontFamily: 'inherit',
                              textDecoration: 'none',
                            }}
                          >
                            {b.label}
                          </button>
                        ) : (
                          <span style={{ color: DEFAULT_COLORS.TEXT_PRIMARY }}>{b.label}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </h1>
                </div>
                <PasskeysMainPage embedInSettings />
              </>
            ) : (
              <>
                {activeSectionConfig && (
                  <div
                    style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 0 }}
                  >
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
                <SectionContent
                  sectionKey={activeSection}
                  securitySectionProps={{ onManagePasskeysClick }}
                />
              </>
            )}
          </div>
        </main>
        <SettingsSidebar activeSection={activeSection} onSectionChange={onSectionChange} />
      </div>
    </div>
  );
};

export default SettingsPage;
