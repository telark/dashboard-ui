import React, { memo } from 'react';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { isSessionExpired } from '../../../../../features/auth/utils/session/validation';
import { SECURITY_SECTION_CONSTANTS } from '../constants';
import type { SessionDetails } from '../../../../../features/auth/models/session';

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

export interface SessionsTableProps {
  sessions: SessionDetails[];
  loading: boolean;
  error: string | null;
  currentToken: string | null;
  revokingToken: string | null;
  onRevokeClick: (session: SessionDetails) => void;
}

const SessionsTable: React.FC<SessionsTableProps> = memo(
  ({
    sessions,
    loading,
    error,
    currentToken,
    revokingToken,
    onRevokeClick,
  }) => (
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
      {!loading && !error && sessions.length > 0 &&
        sessions.map((session) => {
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
                    onClick={() => onRevokeClick(session)}
                    disabled={revokingToken === session.sessionToken}
                  >
                    {LABELS.SESSIONS_REVOKE}
                  </button>
                )}
              </span>
            </div>
          );
        })}
    </div>
  ),
);

SessionsTable.displayName = 'SessionsTable';

export default SessionsTable;
