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
const requestLines = (request: BootstrapRequest): string[] => {
  const lines = [T.OPENED(formatDateTime(request.openedAt))];
  if (request.state === C.STATE.PENDING) {
    const completes = new Date(Date.parse(request.openedAt) + C.REQUEST_WAIT_MS);
    lines.push(T.COMPLETES(formatDateTime(completes)));
  }
  if (request.approvedAt) lines.push(T.APPROVED_AT(formatDateTime(request.approvedAt)));
  if (request.canceledAt) lines.push(T.CANCELED_AT(formatDateTime(request.canceledAt)));
  if (request.reason) lines.push(T.REASON[request.reason]);
  if (request.completedAt) lines.push(T.COMPLETED_AT(formatDateTime(request.completedAt)));
  return lines;
};

const RequestRow: React.FC<{ request: BootstrapRequest; decide?: React.ReactNode }> = ({
  request,
  decide,
}) => (
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
    <div style={hintStyle}>{requestLines(request).join(T.LINE_SEPARATOR)}</div>
    {decide}
  </div>
);

// Admins on ALL read the pin and the requests; only the bootstrap account decides, with a passkey.
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
      <SettingsCard title={T.CARD_TITLE}>
        <NoPermissionCard featureName={T.CARD_TITLE} permission={VIEW} emptyState />
      </SettingsCard>
    );
  }

  // The pinned account's passkey is the one that decides.
  const isPinned = status?.userID !== undefined && status.userID === getCurrentUser()?.id;
  const isBootstrap = getCurrentUser()?.bootstrap === true;
  const notifyAdmins = status?.notifyAdmins !== false;
  const requests = status?.requests ?? [];
  const newest = requests[0];
  const open = newest?.state === C.STATE.PENDING || newest?.state === C.STATE.APPROVED;
  return (
    <SettingsCard title={T.CARD_TITLE} description={T.CARD_DESCRIPTION}>
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
          <BreakGlassAlertsSetting stored={notifyAdmins} canEdit={isBootstrap} onSaved={reload} />
          <div style={{ fontWeight: FONT_WEIGHT.BOLD }}>{T.REQUESTS_LABEL}</div>
          {/* The exporter sends no requests to the others then, so an empty list would mislead. */}
          {requests.length === 0 && (
            <div style={hintStyle}>
              {notifyAdmins || isBootstrap ? T.NO_REQUESTS : T.REQUESTS_PRIVATE}
            </div>
          )}
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              request={request}
              decide={
                open && request === newest ? (
                  <DecideButtons
                    requestId={request.id}
                    canApprove={request.state === C.STATE.PENDING}
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
