import React, { memo, useCallback, useEffect, useState } from 'react';
import { App as AntdApp, Tag } from 'antd';
import { useLocation } from 'react-router-dom';
import SettingsCard from '../../components/SettingsCard';
import { NoPermissionCard } from '../../../../components/shared';
import { STATUS_COLORS, getPillColor, FONT_WEIGHT } from '../../../../constants';
import { formatDateTime } from '../../../../utils/shared/time';
import logger from '../../../../logging';
import { ACTION_PERMISSIONS, useIsAdminOnAll } from '../../../auth/hooks';
import { getCurrentUser } from '../../../auth/utils';
import {
  BOOTSTRAP_CONSTANTS as C,
  BOOTSTRAP_TEXTS as T,
  DecideButtons,
  getBootstrapStatus,
  type BootstrapAction,
  type BootstrapRequest,
  type BootstrapStatus,
} from '../../../bootstrap';
import { SETTINGS_CONSTANTS } from '../../constants';
import BreakGlassAlertsSetting from './BreakGlassAlertsSetting';

const VIEW = ACTION_PERMISSIONS.bootstrap.view;
// A long email breaks anywhere rather than widening the card.
const hintStyle: React.CSSProperties = {
  fontSize: SETTINGS_CONSTANTS.CONTENT.HINT_FONT_SIZE,
  overflowWrap: 'anywhere',
};

// Each time the request reached, in order, and why a canceled one ended.
const requestLines = (request: BootstrapRequest, waitHours: number): string[] => {
  const lines = [T.OPENED(formatDateTime(request.openedAt))];
  if (request.state === C.STATE.PENDING) {
    const completes = new Date(Date.parse(request.openedAt) + waitHours * C.HOUR_MS);
    lines.push(T.COMPLETES(formatDateTime(completes)));
  }
  if (request.approvedAt) lines.push(T.APPROVED_AT(formatDateTime(request.approvedAt)));
  if (request.canceledAt) lines.push(T.CANCELED_AT(formatDateTime(request.canceledAt)));
  if (request.reason) lines.push(T.REASON[request.reason]);
  if (request.completedAt) lines.push(T.COMPLETED_AT(formatDateTime(request.completedAt)));
  return lines;
};

const RequestRow: React.FC<{
  request: BootstrapRequest;
  waitHours: number;
  decide?: React.ReactNode;
}> = ({ request, waitHours, decide }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.LINE_GAP }}>
    <div
      style={{ display: 'flex', alignItems: 'center', gap: C.LAYOUT.BUTTON_GAP, flexWrap: 'wrap' }}
    >
      <span style={{ fontWeight: FONT_WEIGHT.SEMIBOLD, overflowWrap: 'anywhere' }}>
        {request.kind === C.KIND_REPLACE ? T.KIND_REPLACE(request.targetEmail) : T.KIND_RECOVER}
      </span>
      <Tag color={getPillColor(STATUS_COLORS.BOOTSTRAP_REQUEST[request.state])}>
        {T.STATE[request.state]}
      </Tag>
    </div>
    <div style={hintStyle}>{requestLines(request, waitHours).join(T.LINE_SEPARATOR)}</div>
    {decide}
  </div>
);

// The bootstrap account sees its pin, its alerts switch and its requests, and decides with a passkey.
// Other Admins on ALL see the requests alone, and only while its alerts are on.
const BootstrapAccountSection: React.FC = memo(() => {
  const isAdminOnAll = useIsAdminOnAll();
  const { message } = AntdApp.useApp();
  const { key: locationKey } = useLocation();
  const [status, setStatus] = useState<BootstrapStatus | null>(null);
  const [failed, setFailed] = useState(false);
  const [loads, setLoads] = useState(0);

  // Read on each arrival too: the bell's notice opens this page even when it is already open.
  useEffect(() => {
    if (!isAdminOnAll) return undefined;
    let canceled = false;
    getBootstrapStatus()
      .then((loaded) => {
        if (canceled) return;
        setStatus(loaded);
        setFailed(false);
      })
      .catch((err: unknown) => {
        logger.warn(T.LOAD_FAILED_LOG, err);
        if (!canceled) setFailed(true);
      });
    return () => {
      canceled = true;
    };
  }, [isAdminOnAll, loads, locationKey]);

  const onDecided = useCallback(
    (action: BootstrapAction) => {
      message.success(action === C.ACTION.APPROVE ? T.APPROVED_MESSAGE : T.DENIED_MESSAGE);
      setLoads((count) => count + 1);
    },
    [message],
  );
  const reload = useCallback(() => setLoads((count) => count + 1), []);

  if (!isAdminOnAll) {
    return (
      <SettingsCard title={T.REQUESTS_LABEL}>
        <NoPermissionCard featureName={T.REQUESTS_LABEL} permission={VIEW} emptyState />
      </SettingsCard>
    );
  }

  const requests = status?.requests ?? [];
  if (getCurrentUser()?.bootstrap !== true) {
    if (!failed && (!status || status.notifyAdmins === false)) return null;
    return (
      <SettingsCard title={T.REQUESTS_LABEL}>
        {failed && <div style={hintStyle}>{T.LOAD_FAILED}</div>}
        {status && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.ROW_GAP }}>
            {requests.length === 0 && <div style={hintStyle}>{T.NO_REQUESTS}</div>}
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} waitHours={status.waitHours} />
            ))}
          </div>
        )}
      </SettingsCard>
    );
  }

  // The pinned account's passkey is the one that decides.
  const isPinned = status?.userID !== undefined && status.userID === getCurrentUser()?.id;
  const newest = requests[0];
  const open = newest?.state === C.STATE.PENDING || newest?.state === C.STATE.APPROVED;
  return (
    <SettingsCard title={T.CARD_TITLE} description={T.CARD_DESCRIPTION(status?.waitHours)}>
      {failed && <div style={hintStyle}>{T.LOAD_FAILED}</div>}
      {status && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: C.LAYOUT.ROW_GAP }}>
          <div>
            <div style={{ fontWeight: FONT_WEIGHT.BOLD }}>{T.PINNED_LABEL}</div>
            <div style={hintStyle}>
              {status.pinnedAt
                ? T.PINNED(status.email, formatDateTime(status.pinnedAt))
                : T.NOT_PINNED}
            </div>
          </div>
          <BreakGlassAlertsSetting stored={status.notifyAdmins !== false} onSaved={reload} />
          <div style={{ fontWeight: FONT_WEIGHT.BOLD }}>{T.REQUESTS_LABEL}</div>
          {requests.length === 0 && <div style={hintStyle}>{T.NO_REQUESTS}</div>}
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              waitHours={status.waitHours}
              decide={
                open && request === newest ? (
                  <DecideButtons
                    requestId={request.id}
                    canApprove={request.state === C.STATE.PENDING}
                    recovery={request.kind === C.KIND_RECOVER}
                    deniedReason={isPinned ? undefined : T.READ_ONLY}
                    onDecided={onDecided}
                  />
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </SettingsCard>
  );
});

BootstrapAccountSection.displayName = 'BootstrapAccountSection';

export default BootstrapAccountSection;
