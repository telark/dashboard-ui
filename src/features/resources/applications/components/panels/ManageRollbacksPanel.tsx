import React, { useCallback, useMemo, useState } from 'react';
import {
  CheckCircleOutlined,
  DownOutlined,
  HistoryOutlined,
  RightOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { App as AntdApp, Button, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS } from '../../../../../constants';
import { PanelEmptyState } from '../../../../../components/display/panels/shared';
import type { Application, ApplicationRollbackEntry } from '../../models';
import { APPLICATIONS_UI } from '../../constants/texts';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import SnapshotMetaChip from '../snapshots/SnapshotMetaChip';
import { APPLICATION_SNAPSHOT_ROW } from '../../constants/sectionLayout';
import { FancySpinner } from '../../../../../components/animation';
import type { AppDispatch } from '../../../../../store';
import { abortApplicationRollbackThunk } from '../../store';
import { useUsernamesByIds } from '../../hooks/useUsernamesByIds';
import {
  classifyRollbackStatus,
  formatRollbackNamespaceRef,
  formatRollbackStatusLabel,
  getRollbackStatusColors,
  type RollbackStatusState,
} from '../../utils/rollbacks';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;

const R = APPLICATION_SNAPSHOT_ROW;

/** Matches the borderless action buttons on the snapshot rows. */
const ICON_BTN: React.CSSProperties = {
  width: R.ICON_BUTTON_SIZE_PX,
  height: R.ICON_BUTTON_SIZE_PX,
};

export interface ManageRollbacksPanelProps {
  open: boolean;
  onClose: () => void;
  applicationName: string;
  detailRollbacks: Application['rollbacks'];
  onAfterAbort?: () => void;
}

const ManageRollbacksPanel: React.FC<ManageRollbacksPanelProps> = ({
  open,
  onClose,
  applicationName,
  detailRollbacks,
  onAfterAbort,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [abortBusyId, setAbortBusyId] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const { modal, message } = AntdApp.useApp();
  const canAbort = usePermission(
    ACTION_PERMISSIONS.applications.rollback.scope,
    ACTION_PERMISSIONS.applications.rollback.level,
    ACTION_PERMISSIONS.applications.rollback.deny,
  );
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

  const rollbacks = useMemo<ApplicationRollbackEntry[]>(
    () => (Array.isArray(detailRollbacks) ? detailRollbacks : []),
    [detailRollbacks],
  );

  const triggeredByIds = useMemo(
    () => rollbacks.map((entry) => entry.triggeredBy).filter((id): id is string => Boolean(id)),
    [rollbacks],
  );
  const usernamesById = useUsernamesByIds(triggeredByIds, open);

  const handleAbort = useCallback(
    (entry: ApplicationRollbackEntry) => {
      modal.confirm({
        title: ui.ABORT_CONFIRM_TITLE,
        content: ui.ABORT_CONFIRM_CONTENT,
        okText: ui.ABORT_CONFIRM_OK,
        okType: 'danger',
        cancelText: APPLICATIONS_UI.CARD.ACTIONS.CANCEL,
        onOk: async () => {
          setAbortBusyId(entry.id);
          try {
            await dispatch(
              abortApplicationRollbackThunk({ name: applicationName, rollbackId: entry.id }),
            ).unwrap();
            message.success(ui.ABORT_SUCCESS);
            onAfterAbort?.();
          } catch {
            message.error(ui.ABORT_FAILED);
          } finally {
            setAbortBusyId(null);
          }
        },
      });
    },
    [applicationName, dispatch, message, modal, onAfterAbort, ui],
  );

  return (
    <>
      <SlideOutPanel
        open={open}
        onClose={onClose}
        title={APPLICATIONS_UI.CARD.ACTIONS.MANAGE_ROLLBACKS}
        width={expanded ? PANEL_WIDTH_EXPANDED : PANEL_WIDTH}
        contentOnly
        headerExtra={
          <ExpandPanelButton expanded={expanded} onToggle={() => setExpanded((p) => !p)} />
        }
        formContent={
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
            {rollbacks.length === 0 ? (
              <PanelEmptyState
                icon={<HistoryOutlined />}
                title={ui.ROLLBACKS_EMPTY_TITLE}
                description={ui.ROLLBACKS_EMPTY_DESCRIPTION}
              />
            ) : (
              <div style={{ display: 'grid', rowGap: 10 }}>
                {rollbacks
                  .slice()
                  .sort((a, b) => String(b.triggeredAt).localeCompare(String(a.triggeredAt)))
                  .map((rb) => (
                    <RollbackRow
                      key={rb.id}
                      entry={rb}
                      triggeredByName={rb.triggeredBy ? usernamesById[rb.triggeredBy] || '' : ''}
                      canAbort={canAbort}
                      abortLoading={abortBusyId === rb.id}
                      onAbort={handleAbort}
                    />
                  ))}
              </div>
            )}
          </div>
        }
      />
    </>
  );
};

ManageRollbacksPanel.displayName = 'ManageRollbacksPanel';

export default ManageRollbacksPanel;

function RollbackRow(props: {
  entry: ApplicationRollbackEntry;
  /** Resolved username; falls back to the raw ID while loading or if unknown. */
  triggeredByName: string;
  canAbort: boolean;
  abortLoading: boolean;
  onAbort: (entry: ApplicationRollbackEntry) => void;
}): React.ReactElement {
  const { entry, triggeredByName, canAbort, abortLoading, onAbort } = props;
  const [hovered, setHovered] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const statusKey = String(entry.status || '').trim();
  const statusLabel = formatRollbackStatusLabel(statusKey || 'unknown');
  const statusState = classifyRollbackStatus(statusKey);
  const statusColors = getRollbackStatusColors(statusState);
  const isPending = statusState === 'pending';
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
        borderRadius: R.RADIUS_PX,
        padding: R.PADDING,
        background: hovered ? DEFAULT_COLORS.SURFACE_HOVER : DEFAULT_COLORS.SURFACE_WHITE,
        transition: R.TRANSITION,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: R.GAP_PX,
              minWidth: 0,
            }}
          >
            {/* Names the snapshot the rollback went back to, not its own generation. */}
            <span
              style={{
                fontSize: R.TITLE_FONT_SIZE_PX,
                fontWeight: 700,
                color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                whiteSpace: 'nowrap',
              }}
            >
              {ui.ROLLBACK_TARGET_PREFIX} {entry.targetGeneration}
            </span>
            <SnapshotMetaChip>
              {formatRollbackNamespaceRef(entry.namespace).replace(/^ns\//, '')}
            </SnapshotMetaChip>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: R.GAP_PX,
              minWidth: 0,
              fontSize: R.META_FONT_SIZE_PX,
              color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
            }}
          >
            {entry.restoredGeneration != null ? (
              <SnapshotMetaChip>
                {ui.RESTORED_PREFIX} {entry.restoredGeneration}
              </SnapshotMetaChip>
            ) : null}
            <span>
              {ui.TRIGGERED_PREFIX} <TimeAgo date={entry.triggeredAt} />
              {triggeredByName ? ` ${ui.META_SEPARATOR} ${ui.BY_PREFIX} ${triggeredByName}` : ''}
            </span>
            {entry.completedAt ? (
              <span>
                {ui.META_SEPARATOR} {ui.COMPLETED_PREFIX} <TimeAgo date={entry.completedAt} />
              </span>
            ) : null}
          </div>
          {/* The raw engine error is long and only matters when digging in, so the
              row states that it failed and lets the user ask for the detail. */}
          {entry.error ? (
            <div style={{ display: 'grid', rowGap: 4, minWidth: 0 }}>
              <button
                type="button"
                onClick={() => setErrorOpen((prev) => !prev)}
                aria-expanded={errorOpen}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  alignSelf: 'start',
                  fontSize: R.META_FONT_SIZE_PX,
                  fontWeight: 600,
                  color: DEFAULT_COLORS.DANGER,
                }}
              >
                {errorOpen ? <DownOutlined /> : <RightOutlined />}
                <span>{errorOpen ? ui.HIDE_ERROR : ui.SHOW_ERROR}</span>
              </button>
              {errorOpen ? (
                <div
                  style={{
                    padding: R.ERROR_PADDING,
                    borderRadius: R.ERROR_RADIUS_PX,
                    background: DEFAULT_COLORS.CHIP_ON_SURFACE_BG,
                    color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                    fontSize: R.ERROR_FONT_SIZE_PX,
                    fontFamily: 'monospace',
                    maxHeight: R.ERROR_MAX_HEIGHT_PX,
                    overflow: 'auto',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {entry.error}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isPending ? (
            <Tooltip
              title={canAbort ? ui.ABORT_ROLLBACK_TOOLTIP : ui.ABORT_PERMISSION_DENIED_TOOLTIP}
            >
              <Button
                size="small"
                type="text"
                danger
                icon={<StopOutlined />}
                onClick={() => onAbort(entry)}
                style={ICON_BTN}
                aria-label={ui.ABORT_ROLLBACK}
                disabled={!canAbort}
                loading={abortLoading}
              />
            </Tooltip>
          ) : null}
          <StatusBadge
            label={statusLabel}
            state={statusState}
            background={statusColors.background}
            color={statusColors.color}
          />
        </div>
      </div>
    </div>
  );
}

function StatusBadge(props: {
  label: string;
  state: RollbackStatusState;
  background: string;
  color: string;
}): React.ReactElement {
  const { label, state, background, color } = props;
  const showSpinner = state === 'inProgress' || state === 'pending';
  const showSuccessIcon = state === 'success';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background,
        color,
        padding: '2px 10px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 11,
        textTransform: 'capitalize',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        marginLeft: 'auto',
      }}
    >
      {showSpinner ? (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <FancySpinner size={14} ringThickness={2} color={color} />
        </span>
      ) : null}
      {showSuccessIcon ? <CheckCircleOutlined style={{ fontSize: 12 }} /> : null}
      <span>{label}</span>
    </span>
  );
}
