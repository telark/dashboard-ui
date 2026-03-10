import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../constants';
import SettingsCard from '../../components/SettingsCard';
import { SETTINGS_CONSTANTS } from '../../constants';
import { SECURITY_SECTION_CONSTANTS } from './constants';

const { CONTENT } = SETTINGS_CONSTANTS;
const { LABELS } = SECURITY_SECTION_CONSTANTS;

const tableHeaderStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 140px 80px',
  gap: 16,
  padding: '12px 0',
  borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  fontSize: 12,
  fontWeight: 600,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

const emptyRowStyle: React.CSSProperties = {
  padding: '24px 0',
  fontSize: 14,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textAlign: 'center',
};

const linkStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: DEFAULT_COLORS.SUCCESS,
  textDecoration: 'none',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

interface SecuritySectionContentProps {
  /** When provided, "Manage passkeys" stays in Security (no route); opens passkeys sub-view with breadcrumb. */
  onManagePasskeysClick?: () => void;
}

const SecuritySectionContent: React.FC<SecuritySectionContentProps> = memo(
  ({ onManagePasskeysClick }) => {
    return (
      <>
        <SettingsCard
          title={LABELS.PASSKEYS_CARD_TITLE}
          description={LABELS.PASSKEYS_CARD_DESCRIPTION}
        >
          <div style={{ fontSize: 14, color: DEFAULT_COLORS.TEXT_SECONDARY }}>
            {onManagePasskeysClick ? (
              <button type="button" style={linkStyle} onClick={onManagePasskeysClick}>
                {LABELS.PASSKEYS_MANAGE_LINK}
              </button>
            ) : (
              <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                {LABELS.PASSKEYS_MANAGE_LINK}
              </span>
            )}
          </div>
        </SettingsCard>
        <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
          <SettingsCard
            title={LABELS.ACTIVE_SESSIONS_CARD_TITLE}
            description={LABELS.ACTIVE_SESSIONS_CARD_DESCRIPTION}
          >
            <div>
              <div style={tableHeaderStyle}>
                <span>{LABELS.ACTIVE_SESSIONS_HEADER_DEVICE}</span>
                <span>{LABELS.ACTIVE_SESSIONS_HEADER_LAST_ACTIVE}</span>
                <span>{LABELS.ACTIVE_SESSIONS_HEADER_ACTIONS}</span>
              </div>
              <div style={emptyRowStyle}>{LABELS.ACTIVE_SESSIONS_EMPTY}</div>
            </div>
          </SettingsCard>
        </div>
      </>
    );
  },
);

SecuritySectionContent.displayName = 'SecuritySectionContent';

export default SecuritySectionContent;
