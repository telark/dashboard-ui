import React, { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { DEFAULT_COLORS } from '../../../../constants';
import { SETTINGS_CONSTANTS } from '../../constants';
import { SECURITY_SECTION_CONSTANTS } from './constants';
import SettingsCard from '../../components/SettingsCard';
import TimeAgo from '../../../../components/display/time/TimeAgo';
import { useSessionsList } from '../../../../features/auth/hooks';
import { getSessionToken } from '../../../../features/auth/utils/session/token';
import { isSessionExpired } from '../../../../features/auth/utils/session/validation';
import { handleUserLogout } from '../../../../features/auth/utils/logout/logout';
import type { SessionDetails } from '../../../../features/auth/models/session';

const { CONTENT } = SETTINGS_CONSTANTS;
const { LABELS } = SECURITY_SECTION_CONSTANTS;

const SESSION_GRID_COLUMNS = '1fr 140px 140px 100px';

const tableHeaderStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: SESSION_GRID_COLUMNS,
  gap: 16,
  padding: '12px 0',
  borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  fontSize: 12,
  fontWeight: 600,
  color: DEFAULT_COLORS.TEXT_MUTED,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

const rowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: SESSION_GRID_COLUMNS,
  gap: 16,
  padding: '12px 0',
  borderBottom: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
  fontSize: 14,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  alignItems: 'center',
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

const revokeButtonStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: DEFAULT_COLORS.SUCCESS,
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
    const navigate = useNavigate();
    const { sessions, loading, error, refetch, revokeSession } = useSessionsList();
    const [revokingToken, setRevokingToken] = useState<string | null>(null);
    const [sessionToRevoke, setSessionToRevoke] = useState<SessionDetails | null>(null);
    const currentToken = getSessionToken();

    const sortedSessions = useMemo(() => {
      if (!currentToken) return sessions;
      const current = sessions.find((s) => s.sessionToken === currentToken);
      const rest = sessions.filter((s) => s.sessionToken !== currentToken);
      return current ? [current, ...rest] : sessions;
    }, [sessions, currentToken]);

    const handleRevokeClick = useCallback((session: SessionDetails) => {
      setSessionToRevoke(session);
    }, []);

    const handleRevokeConfirm = useCallback(
      async () => {
        if (!sessionToRevoke) return;
        const token = sessionToRevoke.sessionToken;
        setRevokingToken(token);
        try {
          await revokeSession(token, {
            onRevokedCurrentSession: () => handleUserLogout(navigate),
          });
          message.success(LABELS.SESSIONS_REVOKE_SUCCESS);
          setSessionToRevoke(null);
        } catch {
          message.error(LABELS.SESSIONS_REVOKE_ERROR);
          setSessionToRevoke(null);
        } finally {
          setRevokingToken(null);
        }
      },
      [sessionToRevoke, revokeSession, navigate],
    );

    const revokeModalMessage =
      sessionToRevoke?.sessionToken === currentToken
        ? LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_CURRENT
        : LABELS.REVOKE_CONFIRM_MODAL.MESSAGE_OTHER;

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
                <span>{LABELS.ACTIVE_SESSIONS_HEADER_CREATED}</span>
                <span>{LABELS.ACTIVE_SESSIONS_HEADER_EXPIRES}</span>
                <span />
              </div>
              {loading && (
                <div style={emptyRowStyle}>{LABELS.SESSIONS_LOADING}</div>
              )}
              {!loading && error && (
                <div style={emptyRowStyle}>{LABELS.SESSIONS_ERROR}</div>
              )}
              {!loading && !error && sessions.length === 0 && (
                <div style={emptyRowStyle}>{LABELS.ACTIVE_SESSIONS_EMPTY}</div>
              )}
              {!loading && !error && sortedSessions.length > 0 && (
                <>
                  {sortedSessions.map((session) => {
                    const expired = isSessionExpired(session.expiresTimestamp);
                    const isCurrent = session.sessionToken === currentToken;
                    return (
                      <div key={session.sessionToken} style={rowStyle}>
                        <span>
                          {isCurrent
                            ? LABELS.SESSIONS_THIS_DEVICE
                            : LABELS.SESSIONS_OTHER_SESSION}
                        </span>
                        <span>
                          <TimeAgo date={session.createdTimestamp} />
                        </span>
                        <span
                          style={
                            expired
                              ? { color: DEFAULT_COLORS.TEXT_MUTED }
                              : undefined
                          }
                        >
                          <TimeAgo date={session.expiresTimestamp} />
                        </span>
                        <span>
                          {expired ? (
                            <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}>
                              {LABELS.SESSIONS_EXPIRED}
                            </span>
                          ) : (
                            <button
                              type="button"
                              style={revokeButtonStyle}
                              onClick={() => handleRevokeClick(session)}
                              disabled={revokingToken === session.sessionToken}
                            >
                              {LABELS.SESSIONS_REVOKE}
                            </button>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </SettingsCard>
        </div>

        <Modal
          open={sessionToRevoke !== null}
          title={LABELS.REVOKE_CONFIRM_MODAL.TITLE}
          onOk={handleRevokeConfirm}
          onCancel={() => setSessionToRevoke(null)}
          okText={LABELS.REVOKE_CONFIRM_MODAL.OK}
          cancelText={LABELS.REVOKE_CONFIRM_MODAL.CANCEL}
          okButtonProps={{
            loading: revokingToken !== null,
            danger: true,
          }}
          centered
          destroyOnClose
        >
          <p>{revokeModalMessage}</p>
        </Modal>
      </>
    );
  },
);

SecuritySectionContent.displayName = 'SecuritySectionContent';

export default SecuritySectionContent;
