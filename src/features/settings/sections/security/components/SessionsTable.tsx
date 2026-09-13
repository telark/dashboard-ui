import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { isSessionExpired } from '../../../../../features/auth/utils/session/validation';
import { SECURITY_SECTION_CONSTANTS } from '../constants';
import type { SessionDetails } from '../../../../../features/auth/models/session';

const { LABELS } = SECURITY_SECTION_CONSTANTS;

const formatBrowser = (browser: string): string =>
  browser.replace(/\s+[\d][\d.]*.*$/, '').trim() || browser;

const formatDevice = (device: string): string => {
  if (/^mac/i.test(device)) return 'Mac';
  if (/^win/i.test(device)) return 'Windows';
  if (/^linux/i.test(device)) return 'Linux';
  return device;
};

const formatOS = (os: string): string => {
  if (os.toLowerCase().startsWith('macos')) return 'macOS';
  const stripped = os.replace(/\s+\d+\.\d+(\.\d+)*$/, '').trim();
  return stripped || os;
};

// minmax(0, ...) rather than bare track sizes: a grid track's implicit
// min-width is otherwise its content's, so long device/browser text refuses to
// shrink and forces real overlap once the container gets narrow.
const SESSION_GRID_COLUMNS =
  'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 140px) minmax(0, 140px) minmax(0, 100px)';
// Below this the columns have no room left to give; the table scrolls
// horizontally instead of continuing to squeeze into an unreadable mess.
const SESSION_TABLE_MIN_WIDTH = 640;

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

// A grid item's implicit min-width is its content's, same as a flex item's —
// without this the device/browser text refuses to shrink inside its track.
const truncateCellStyle: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  currentSessionName: string | null;
  revokingSessionName: string | null;
  onRevokeClick: (session: SessionDetails) => void;
}

const SessionsTable: React.FC<SessionsTableProps> = memo(
  ({ sessions, loading, error, currentSessionName, revokingSessionName, onRevokeClick }) => (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: SESSION_TABLE_MIN_WIDTH }}>
        <div style={tableHeaderStyle}>
          <span>{LABELS.ACTIVE_SESSIONS_HEADER_DEVICE}</span>
          <span>{LABELS.ACTIVE_SESSIONS_HEADER_BROWSER}</span>
          <span>{LABELS.ACTIVE_SESSIONS_HEADER_CREATED}</span>
          <span>{LABELS.ACTIVE_SESSIONS_HEADER_EXPIRES}</span>
          <span />
        </div>
        {loading && <div style={emptyRowStyle}>{LABELS.SESSIONS_LOADING}</div>}
        {!loading && error && <div style={emptyRowStyle}>{LABELS.SESSIONS_ERROR}</div>}
        {!loading && !error && sessions.length === 0 && (
          <div style={emptyRowStyle}>{LABELS.ACTIVE_SESSIONS_EMPTY}</div>
        )}
        {!loading &&
          !error &&
          sessions.length > 0 &&
          sessions.map((session) => {
            const expired = isSessionExpired(session.expiresTimestamp);
            const sessionName = session.metadata?.name;
            const isCurrent = sessionName === currentSessionName;
            return (
              <div key={sessionName ?? session.createdTimestamp} style={rowStyle}>
                <span style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: isCurrent ? 600 : undefined, ...truncateCellStyle }}>
                    {session.deviceMetadata?.device
                      ? formatDevice(session.deviceMetadata.device)
                      : isCurrent
                        ? LABELS.SESSIONS_THIS_DEVICE
                        : LABELS.SESSIONS_OTHER_SESSION}
                  </div>
                  {session.deviceMetadata?.os && (
                    <div
                      style={{
                        fontSize: 12,
                        color: DEFAULT_COLORS.TEXT_MUTED,
                        marginTop: 2,
                        ...truncateCellStyle,
                      }}
                    >
                      {formatOS(session.deviceMetadata.os)}
                    </div>
                  )}
                </span>
                <span style={{ fontSize: 13, minWidth: 0 }}>
                  {session.deviceMetadata?.browser ? (
                    <Tooltip
                      title={session.deviceMetadata.userAgent || undefined}
                      placement="topLeft"
                    >
                      <span
                        style={{
                          cursor: session.deviceMetadata.userAgent ? 'help' : undefined,
                          display: 'block',
                          ...truncateCellStyle,
                        }}
                      >
                        {formatBrowser(session.deviceMetadata.browser)}
                      </span>
                    </Tooltip>
                  ) : (
                    '—'
                  )}
                </span>
                <span>
                  <TimeAgo date={session.createdTimestamp} />
                </span>
                <span style={expired ? { color: DEFAULT_COLORS.TEXT_MUTED } : undefined}>
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
                      disabled={revokingSessionName === sessionName}
                    >
                      {LABELS.SESSIONS_REVOKE}
                    </button>
                  )}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  ),
);

SessionsTable.displayName = 'SessionsTable';

export default SessionsTable;
