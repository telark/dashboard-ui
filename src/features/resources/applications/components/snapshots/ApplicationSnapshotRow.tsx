import React, { memo, useState } from 'react';
import { EyeOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, Checkbox, Tooltip } from 'antd';
import { DEFAULT_COLORS } from '../../../../../constants';
import TimeAgo from '../../../../../components/display/time/TimeAgo';
import { APPLICATIONS_UI } from '../../constants';
import { APPLICATION_SNAPSHOT_ROW } from '../../constants/sectionLayout';
import { getApplicationSeverityAccentColor } from '../../utils/healthVisual';
import SnapshotMetaChip from './SnapshotMetaChip';
import type { ApplicationSnapshotSummary } from '../../models';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../features/auth/hooks/permissions/permissionEngine';

const R = APPLICATION_SNAPSHOT_ROW;

/** Borderless: two outlined boxes per row read as clutter against the list. */
const ICON_BTN: React.CSSProperties = {
  width: R.ICON_BUTTON_SIZE_PX,
  height: R.ICON_BUTTON_SIZE_PX,
  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
};

export type RollbackDisabledReason = 'sync' | 'activeRollback' | null;

export interface ApplicationSnapshotRowProps {
  snapshot: ApplicationSnapshotSummary;
  showMarginBottom: boolean;
  onViewManifest: (summary: ApplicationSnapshotSummary) => void;
  onRollback?: (summary: ApplicationSnapshotSummary) => void;
  rollbackLoading?: boolean;
  rollbackDisabled?: boolean;
  rollbackDisabledReason?: RollbackDisabledReason;
  compareMode?: boolean;
  compareChecked?: boolean;
  compareDisabled?: boolean;
  onToggleCompare?: (summary: ApplicationSnapshotSummary, checked: boolean) => void;
}

const ApplicationSnapshotRow: React.FC<ApplicationSnapshotRowProps> = memo(
  ({
    snapshot: s,
    showMarginBottom,
    onViewManifest,
    onRollback,
    rollbackLoading = false,
    rollbackDisabled = false,
    rollbackDisabledReason = null,
    compareMode = false,
    compareChecked = false,
    compareDisabled = false,
    onToggleCompare,
  }) => {
    const [hovered, setHovered] = useState(false);
    const canViewManifest = usePermission(
      ACTION_PERMISSIONS.applications.viewSnapshotManifest.scope,
      ACTION_PERMISSIONS.applications.viewSnapshotManifest.level,
      ACTION_PERMISSIONS.applications.viewSnapshotManifest.deny,
    );
    const canRollback = usePermission(
      ACTION_PERMISSIONS.applications.rollback.scope,
      ACTION_PERMISSIONS.applications.rollback.level,
      ACTION_PERMISSIONS.applications.rollback.deny,
    );

    const severityLabel =
      s.severity && s.severity.trim().length > 0 ? s.severity : APPLICATIONS_UI.FALLBACKS.EMPTY;

    const ui = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;

    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          border: `1px solid ${DEFAULT_COLORS.SURFACE_BORDER_LIGHT}`,
          borderRadius: R.RADIUS_PX,
          padding: R.PADDING,
          marginBottom: showMarginBottom ? R.ROW_SPACING_PX : 0,
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              minWidth: 0,
              flex: 1,
            }}
          >
            {compareMode ? (
              <span
                className="applications-bulk-select"
                style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={compareChecked}
                  disabled={compareDisabled}
                  onChange={(e) => onToggleCompare?.(s, e.target.checked)}
                />
              </span>
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
              {/* Generation is the identity of a snapshot, so it leads instead of
                  being one chip among three. */}
              <span
                style={{
                  fontSize: R.TITLE_FONT_SIZE_PX,
                  fontWeight: 700,
                  color: DEFAULT_COLORS.TEXT_ON_SURFACE,
                  whiteSpace: 'nowrap',
                }}
              >
                {ui.GENERATION} {s.generation}
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: R.GAP_PX,
                  fontSize: R.META_FONT_SIZE_PX,
                  color: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
                }}
              >
                <SnapshotMetaChip>
                  <span
                    style={{
                      width: R.SEVERITY_DOT_SIZE_PX,
                      height: R.SEVERITY_DOT_SIZE_PX,
                      borderRadius: '50%',
                      background: getApplicationSeverityAccentColor(s.severity),
                    }}
                  />
                  {severityLabel}
                </SnapshotMetaChip>
                {s.id ? <SnapshotMetaChip>{s.id}</SnapshotMetaChip> : null}
                <span>{s.size}</span>
                <span>{APPLICATIONS_UI.SECTIONS.SNAPSHOTS.STORAGE_METRICS_JOINER.trim()}</span>
                <span>
                  {s.takenAt && s.takenAt.trim().length > 0 ? (
                    <TimeAgo date={s.takenAt} />
                  ) : (
                    APPLICATIONS_UI.FALLBACKS.EMPTY
                  )}
                </span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <Tooltip
              title={
                !canViewManifest ? ui.VIEW_MANIFEST_PERMISSION_DENIED_TOOLTIP : ui.VIEW_MANIFEST
              }
            >
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onViewManifest(s)}
                style={ICON_BTN}
                aria-label={ui.VIEW_MANIFEST}
                disabled={!canViewManifest}
              />
            </Tooltip>
            <Tooltip
              title={
                !canRollback
                  ? ui.ROLLBACK_PERMISSION_DENIED_TOOLTIP
                  : rollbackDisabled
                    ? rollbackDisabledReason === 'activeRollback'
                      ? ui.ROLLBACK_IN_PROGRESS_TOOLTIP
                      : APPLICATIONS_UI.CARD.ACTIONS.SYNC_DISABLED_TOOLTIP
                    : ui.ROLLBACK
              }
            >
              <Button
                size="small"
                type="text"
                icon={<HistoryOutlined />}
                onClick={() => onRollback?.(s)}
                style={ICON_BTN}
                aria-label={ui.ROLLBACK}
                loading={rollbackLoading}
                disabled={!canRollback || !onRollback || rollbackDisabled}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  },
);

ApplicationSnapshotRow.displayName = 'ApplicationSnapshotRow';

export default ApplicationSnapshotRow;
