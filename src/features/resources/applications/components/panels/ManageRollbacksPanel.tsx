import React, { useCallback, useMemo, useState } from 'react';
import { CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import { App as AntdApp, Button, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  SlideOutPanel,
  ExpandPanelButton,
} from '../../../../../components/display/panels/slide-out';
import { DEFAULT_COLORS } from '../../../../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../../../../constants/pages/connectivity';
import type { Application, ApplicationRollbackEntry } from '../../models';
import { APPLICATIONS_UI } from '../../constants/texts';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import RowTag from '../../../../../components/display/table/RowTag';
import { APPLICATION_SECTION_LAYOUT } from '../../constants/sectionLayout';
import { FancySpinner } from '../../../../../components/animation';
import type { AppDispatch } from '../../../../../store';
import { abortApplicationRollbackThunk } from '../../store';
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
import { selectPermissionsState } from '../../../../auth/store/selectors/permissionsSelectors';

const PANEL_WIDTH = 650;
const PANEL_WIDTH_EXPANDED = 960;

const ICON_BTN: React.CSSProperties = {
  borderColor: DEFAULT_COLORS.BORDER_LIGHT,
  color: DEFAULT_COLORS.TEXT_PRIMARY,
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
  const { userID } = useSelector(selectPermissionsState);
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

  const handleAbort = useCallback(
    (entry: ApplicationRollbackEntry) => {
      modal.confirm({
        title: ui.ABORT_CONFIRM_TITLE,
        content: ui.ABORT_CONFIRM_CONTENT,
        okText: ui.ABORT_CONFIRM_OK,
        okType: 'danger',
        cancelText: APPLICATIONS_UI.CARD.ACTIONS.CANCEL,
        onOk: async () => {
          if (!userID) {
            message.error(ui.ABORT_USER_REQUIRED);
            return;
          }
          setAbortBusyId(entry.id);
          try {
            await dispatch(
              abortApplicationRollbackThunk({
                name: applicationName,
                rollbackId: entry.id,
                userID,
              }),
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
    [applicationName, dispatch, message, modal, onAfterAbort, ui, userID],
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rollbacks.length === 0 ? (
              <div style={{ fontSize: 13, color: DEFAULT_COLORS.TEXT_MUTED }}>
                No rollbacks recorded for this application yet.
              </div>
            ) : (
              <div style={{ display: 'grid', rowGap: 10 }}>
                {rollbacks
                  .slice()
                  .sort((a, b) => String(b.triggeredAt).localeCompare(String(a.triggeredAt)))
                  .map((rb) => (
                    <RollbackRow
                      key={rb.id}
                      entry={rb}
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
  canAbort: boolean;
  abortLoading: boolean;
  onAbort: (entry: ApplicationRollbackEntry) => void;
}): React.ReactElement {
  const { entry, canAbort, abortLoading, onAbort } = props;
  const statusKey = String(entry.status || '').trim();
  const statusLabel = formatRollbackStatusLabel(statusKey || 'unknown');
  const statusState = classifyRollbackStatus(statusKey);
  const statusColors = getRollbackStatusColors(statusState);
  const isPending = statusState === 'pending';
  const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

  return (
    <div
      style={{
        border: `1px solid ${DEFAULT_COLORS.BORDER_LIGHT}`,
        borderRadius: APPLICATION_SECTION_LAYOUT.COLUMN_INNER_RADIUS,
        padding: 10,
        background: DEFAULT_COLORS.BACKGROUND_WHITE,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <RowTag
              text={String(entry.targetSnapshotId || '').trim() || APPLICATIONS_UI.FALLBACKS.EMPTY}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            <RowTag
              text={`Generation: ${entry.targetGeneration}`}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            <RowTag
              text={formatRollbackNamespaceRef(entry.namespace).replace(/^ns\//, '')}
              {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
            />
            {entry.restoredGeneration != null ? (
              <RowTag
                text={`Restored: ${entry.restoredGeneration}`}
                {...APPLICATION_SECTION_LAYOUT.RUNTIME_VALUE_ROW_TAG}
              />
            ) : null}
          </div>
          <span style={{ fontSize: 12, color: DEFAULT_COLORS.TEXT_MUTED, fontWeight: 500 }}>
            Triggered: <TimeAgo date={entry.triggeredAt} />
            {entry.triggeredBy ? ` · ${entry.triggeredBy}` : ''}
            {entry.completedAt ? (
              <>
                {' '}
                · Completed: <TimeAgo date={entry.completedAt} />
              </>
            ) : null}
          </span>
          {entry.error ? (
            <span style={{ fontSize: 12, color: DEFAULT_COLORS.DANGER }}>{entry.error}</span>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isPending ? (
            <Tooltip
              title={canAbort ? ui.ABORT_ROLLBACK_TOOLTIP : ui.ABORT_PERMISSION_DENIED_TOOLTIP}
            >
              <Button
                size="small"
                type="default"
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
  const borderColor =
    state === 'pending' ? CONNECTIVITY_CONSTANTS.COLORS.WARNING : DEFAULT_COLORS.BORDER_LIGHT;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background,
        color,
        border: `1px solid ${borderColor}`,
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
